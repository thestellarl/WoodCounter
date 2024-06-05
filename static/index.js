window.onload = () => {
  let boards = [];
  const boardMap = {};
  var audio = new Audio("beep.mp3");
  var socket = io();

  const totalLengthHeader = document.getElementById("total-length");
  const averageLengthHeader = document.getElementById("average-length");
  const queueWrapper = document.getElementById("board-queue-wrapper");

  const goFullscreen = () => {
    document.documentElement.requestFullscreen();
    document.getElementById("fullscreen-button").remove();
  };

  document
    .getElementById("fullscreen-button")
    .addEventListener("click", goFullscreen);

  socket.on("connect", function () {
    socket.emit("my event", { data: "I'm connected!" });
    console.log("connected");
  });

  const addBoardHandler = (boardData) => {
    if (!boardData.id) return;
    audio.play();
    boards.push(boardData.id);
    boardMap[boardData.id] = { ...boardData };
    addBoardToDOM(boardData);
    if (queueWrapper.childElementCount > 5) removeBoardFromDOM();
  };

  const updateFooter = (boardData) => {
    const { totalLength, averageLength } = boardData;
    totalLengthHeader.innerHTML = totalLength;
    averageLengthHeader.innerHTML = averageLength;
  };

  const draggableBoard = (boardElement, id) => {
    var pos1 = 0,
      pos2 = 0;
    const onDragBoardStart = (e) => {
      const archiveWrapper = document.createElement("div");
      boardElement.parentElement.appendChild(archiveWrapper);
      archiveWrapper.setAttribute("id", "archive-wrapper");
      archiveWrapper.appendChild(document.createTextNode(`X`));

      const removeWrapper = document.createElement("div");
      boardElement.parentElement.appendChild(removeWrapper);
      removeWrapper.setAttribute("id", "remove-wrapper");
      removeWrapper.appendChild(document.createTextNode(`X`));

      pos1 = e.touches[0].clientX;
      document.ontouchmove = dragBoardHandler;
      document.ontouchend = onDragBoardEnd;
    };

    const onDragBoardEnd = () => {
      if (Math.abs(pos2 / window.innerWidth) > 0.1) {
        if (pos2 < 0) socket.emit("remove board", id);
        if (pos2 > 0) socket.emit("archive board", id);
        boardElement.parentElement.style.opacity = 0;
      } else {
        boardElement.style.left = 0;
      }
      document.getElementById("remove-wrapper").remove();
      document.createElement("archive-wrapper").remove();
      document.ontouchend = null;
      document.ontouchmove = null;
    };

    const dragBoardHandler = (e) => {
      e = e || window.event;
      e.preventDefault();
      pos2 = e.touches[0].clientX - pos1;
      boardElement.style.left = `${pos2}px`;
    };
    boardElement.addEventListener("touchstart", onDragBoardStart);
  };

  const addBoardToDOM = ({ id, length }) => {
    const outerWrapper = document.createElement("div");
    const innerWrapper = document.createElement("div");
    const board = document.createElement("div");
    draggableBoard(innerWrapper, id);
    boardMap[id] = { ...boardMap[id], element: innerWrapper };

    outerWrapper.appendChild(innerWrapper);
    innerWrapper.appendChild(document.createTextNode(`Length: ${length}`));
    innerWrapper.appendChild(board);
    outerWrapper.setAttribute("class", "board-wrapper");
    innerWrapper.setAttribute("class", "board-inner-wrapper");
    board.setAttribute("class", "board");
    board.style.width = `${length}%`;
    queueWrapper.appendChild(outerWrapper);
    document.scrollTop = document.scrollHeight;
  };

  const removeBoardFromDOM = () => {
    queueWrapper.firstChild.remove();
  };

  setInterval(() => {
    addBoardHandler({ id: 0, length: 50 });
  }, 1000);

  socket.on("message", (board) => {
    let boardData = JSON.parse(board);
    addBoardHandler(boardData);
    updateFooter(boardData);
  });

  socket.on("board removed", (id) => {
    elem = boardMap[id].element;
    setInterval(() => {
      elem.parentElement.style.height = 0;
    }, 200);
    setInterval(() => {
      elem.parentElement.remove();
    }, 400);
  });

  document.getElementById("power-off-button").addEventListener("click", () => {
    returnValue = confirm("Are you sure you want to shutdown?");
    if (returnValue) socket.emit("shutdown");
  });
};

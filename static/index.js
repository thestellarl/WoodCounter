window.onload = () => {
  let boards = [];
  const boardMap = {};

  var socket = io();
  socket.on("connect", function () {
    socket.emit("my event", { data: "I'm connected!" });
    console.log("connected");
  });

  const addBoardHandler = (boardData) => {
    boards.push(boardData.id);
    boardMap[boardData.id] = { ...boardData };
    addBoardToDOM(boardData);
  };

  const draggableBoard = (boardElement, id) => {
    var pos1 = 0,
      pos2 = 0;
    const onDragBoardStart = (e) => {
      const removeWrapper = document.createElement("div");
      boardElement.parentElement.appendChild(removeWrapper);
      removeWrapper.setAttribute("id", "remove-wrapper");
      removeWrapper.appendChild(document.createTextNode(`X`));
      pos1 = e.touches[0].clientX;
      document.ontouchmove = dragBoardHandler;
      document.ontouchend = onDragBoardEnd;
    };

    const onDragBoardEnd = () => {
      if (pos2 < (-1 * window.innerWidth) / 4) {
        boardElement.parentElement.style.opacity = 0;
        socket.emit("remove board", id);
      } else {
        boardElement.style.left = 0;
      }
      document.getElementById("remove-wrapper").remove();
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
    const queueWrapper = document.getElementById("board-queue-wrapper");
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

  socket.on("message", (board) => {
    addBoardHandler(JSON.parse(board));
    console.log(JSON.parse(board));
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

  document
    .getElementById("power-off-button")
    .addEventListener("click", () => console.log("power off"));
};

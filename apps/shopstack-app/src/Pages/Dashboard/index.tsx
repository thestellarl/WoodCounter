import React, { useState, useEffect, useRef } from 'react';
import List, {
  ListRowProps,
  ListRowRenderer,
} from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

interface Board {
  id: number;
  length: number;
  timestamp: Date;
  sortingLabel: string;
  sheetLink: string;
}

export const Dashboard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const listRef = useRef<List>(null);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    // Simulating data fetching from Raspberry Pi
    const fetchBoards = () => {
      const newBoard: Board = {
        id: Date.now(),
        length: Math.round(Math.random() * 100 + 50), // Random length between 50-150 inches
        timestamp: new Date(),
        sortingLabel: ['A', 'B', 'C'][Math.floor(Math.random() * 3)], // Random sorting label
        sheetLink: `https://example.com/sheet/${Date.now()}`,
      };
      setBoards((prevBoards) => [...prevBoards, newBoard]);
    };

    const intervalId = setInterval(fetchBoards, 1000); // Fetch every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const maxLength = Math.max(...boards.map((board) => board.length), 1);

  useEffect(() => {
    if (listRef.current && boards.length > 0 && isNearBottomRef.current) {
      listRef.current.scrollToRow(boards.length - 1);
    }
  }, [boards]);

  const renderRow = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => {
    const board = boards[index];
    const backgroundWidth = (board.length / maxLength) * 100;

    return (
      <div
        key={key}
        style={style}
        className={`p-4 border-b relative ${
          selectedBoard?.id === board.id ? 'bg-blue-100' : ''
        }`}
        onClick={() => setSelectedBoard(board)}
      >
        <div
          className="absolute inset-y-0 left-0 bg-green-200 opacity-50 z-0"
          style={{ width: `${backgroundWidth}%` }}
        />
        <div className="relative z-10">
          {/* Existing content */}
          <div className="flex justify-between items-center">
            <span className="font-bold">{board.length}" Board</span>
            <span className="text-sm text-gray-600">
              {board.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm">Sort: {board.sortingLabel}</span>
            <a
              href={board.sheetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Sheet
            </a>
          </div>
        </div>
      </div>
    );
  };

  const handleScroll = ({
    clientHeight,
    scrollHeight,
    scrollTop,
  }: {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
  }) => {
    const bottomThreshold = 20; // pixels from bottom to trigger auto-scroll
    isNearBottomRef.current =
      scrollHeight - (scrollTop + clientHeight) <= bottomThreshold;
  };

  const calculateStats = () => {
    const totalLength = boards.reduce((sum, board) => sum + board.length, 0);
    const averageLength = boards.length > 0 ? totalLength / boards.length : 0;
    return { totalLength, averageLength };
  };

  const { totalLength, averageLength } = calculateStats();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow flex">
        <div className="w-1/3 border-r">
          <h2 className="text-xl font-bold p-4">Boards</h2>
          <div className="h-[calc(100vh-10rem)]">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={listRef}
                  width={width}
                  height={height}
                  rowCount={boards.length}
                  rowHeight={80}
                  rowRenderer={renderRow}
                  onScroll={handleScroll}
                />
              )}
            </AutoSizer>
          </div>
        </div>
        <div className="w-2/3 p-4">
          <h2 className="text-xl font-bold mb-4">Selected Board Details</h2>
          {selectedBoard ? (
            <div>
              <p>
                <strong>Length:</strong> {selectedBoard.length}"
              </p>
              <p>
                <strong>Timestamp:</strong>{' '}
                {selectedBoard.timestamp.toLocaleString()}
              </p>
              <p>
                <strong>Sorting Label:</strong> {selectedBoard.sortingLabel}
              </p>
              <p>
                <strong>Sheet:</strong>{' '}
                <a
                  href={selectedBoard.sheetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Sheet
                </a>
              </p>
            </div>
          ) : (
            <p>No board selected</p>
          )}
        </div>
      </div>
      <div className="bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-2">Project Stats</h2>
        <div className="flex justify-between">
          <p>
            <strong>Total Length:</strong> {totalLength.toFixed(2)} inches
          </p>
          <p>
            <strong>Average Length:</strong> {averageLength.toFixed(2)} inches
          </p>
          <p>
            <strong>Total Boards:</strong> {boards.length}
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface BoardType {
  id: string;
  length: number;
}

export const BoardQueue = () => {
  const boards = React.useState<BoardType[]>([]);

  return <div></div>;
};

const renderBoards = (boards: BoardType[]) => {
  return <div></div>;
};

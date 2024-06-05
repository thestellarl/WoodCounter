import React from 'react';
import List, {
  ListRowProps,
  ListRowRenderer,
} from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { BoardType } from '../../Pages/Dashboard';

interface BoardQueueProps {
  boards: BoardType[];
}

export const BoardQueue = ({ boards }: BoardQueueProps) => {
  function rowRenderer({
    key,
    index,
    isScrolling,
    isVisible,
    style,
  }: ListRowProps) {
    const { length } = boards[index];
    return (
      <div key={key} className="h-[50px]" style={style}>
        <div
          className={`h-10 bg-[#8f6f4a]`}
          style={{ width: `${Math.round(length)}%` }}
        ></div>
      </div>
    );
  }

  return (
    <div className="w-full flex-auto">
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={boards.length}
            rowHeight={50}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};

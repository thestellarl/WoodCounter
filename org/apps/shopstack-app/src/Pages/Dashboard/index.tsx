import React from 'react';
import { BoardQueue } from '../../components/BoardQueue';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export interface BoardType {
  id: number;
  length: number;
}

export const Dashboard = () => {
  const onFullscreenClick = async () =>
    await document.documentElement.requestFullscreen();
  const [boards, setBoards] = React.useState<BoardType[]>([]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('adding board');
      setBoards((prev) => [
        ...prev,
        { id: Math.round(Math.random() * 10000), length: Math.random() * 100 },
      ]);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="text-6xl flex flex-col min-h-screen">
      <Header
        onFullscreenClick={onFullscreenClick}
        onPowerOffClick={() => {}}
      />
      <BoardQueue boards={boards} />
      <Footer />
    </div>
  );
};

import { BoardQueue } from '../../components/BoardQueue';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export const Dashboard = () => {
  const onFullscreenClick = async () =>
    await document.documentElement.requestFullscreen();

  return (
    <div className="text-6xl">
      <Header
        onFullscreenClick={onFullscreenClick}
        onPowerOffClick={() => {}}
      />
      <BoardQueue />
      <Footer />
    </div>
  );
};

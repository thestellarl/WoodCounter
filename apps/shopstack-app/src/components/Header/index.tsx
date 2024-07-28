import { Link } from 'react-router-dom';

interface HeaderProps {
  onFullscreenClick: () => void;
  onPowerOffClick: () => void;
}

export const Header = ({ onFullscreenClick, onPowerOffClick }: HeaderProps) => {
  return (
    <div className="flex flex-col sticky top-0 z-10 bg-cyan-900 text-white w-screen">
      <div className="flex flex-row items-center justify-between px-6 py-2 w-full">
        <h2 id="fullscreen-button" onClick={onFullscreenClick}>
          Fullscreen
        </h2>
        <h2>
          <Link to="/settings">Settings</Link>
        </h2>
        <h2 id="power-off-button" onClick={onPowerOffClick}>
          Power Off
        </h2>
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <div className="flex flex-row justify-around fixed bottom-0 z-2 w-screen bg-gray-300">
      <div>
        <h1>Total:</h1>
        <h1 id="total-length"></h1>
      </div>
      <div>
        <h1>Average:</h1>
        <h1 id="average-length"></h1>
      </div>
    </div>
  );
};

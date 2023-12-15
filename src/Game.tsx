import DesignMenu from "./features/DesignMenu";
import Canvas from "./main/Canvas";
const Game = () => {
  return (
    <div id="Game" className="Game">
      <Canvas/>
      <DesignMenu/>
    </div>
  );
}

export default Game;

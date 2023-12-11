import DesignMenu from "./features/DesignMenu/DesignMenu";
import Canvas from "./objects/Canvas";
const Game = () => {
  return (
    <div className="Game">
      <Canvas/>
      <DesignMenu/>
    </div>
  );
}

export default Game;

import { useAppDispatch } from "../../app/hooks";
import { resetGame } from "../../features/game/gameSlice";

export function Settings() {
    const dispatch = useAppDispatch();

    const onResetGame = () => {
        dispatch(resetGame());
    }

    return <div className="card">
        <button className="danger" onClick={onResetGame}>Nulstil spillet</button>
    </div>;
}
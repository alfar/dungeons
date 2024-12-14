import { useAppDispatch } from "../../app/hooks";
import { resetGame } from "../../features/game/gameSlice";
import { adventurers } from "../../resources/adventurers";
import { Inventory } from "../Inventory/Inventory";

interface RosterProps {
    onAdventurerSwitch: (id: number) => any;
}

export function Roster(props: RosterProps)
{
    const dispatch = useAppDispatch();
    const adventurerIds = Object.keys(adventurers) as any as Array<number>;

    const selectAdventurer = (index: number) => {
        props.onAdventurerSwitch(adventurerIds[index]);
    };

    const onResetGame = () => {
        dispatch(resetGame());
    }

    return (
        <div className="card  roster">
            <h1>Skift eventyrer <button onClick={onResetGame}>Nulstil spillet</button></h1>
            <Inventory slots={adventurerIds.length} items={adventurerIds.map(id => adventurers[id].icon)} selectedSlotIndex={-1} onSlotClicked={selectAdventurer} />
        </div>
    )
}
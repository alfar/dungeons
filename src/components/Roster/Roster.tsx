import { useAppSelector } from "../../app/hooks";
import { adventurers } from "../../resources/adventurers";
import { Inventory } from "../Inventory/Inventory";

interface RosterProps {
    locationId: number;
    onAdventurerSwitch: (id: number) => any;
}

export function Roster(props: RosterProps)
{
    const state = useAppSelector(state => state.game);
    const adventurerIds = Object.keys(adventurers).map(k => parseInt(k, 10)).filter(id => (state.currentLocation[id] ?? 0) === props.locationId);
    const selectedIndex = adventurerIds.indexOf(state.activeAdventurer);

    const selectAdventurer = (index: number) => {
        props.onAdventurerSwitch(adventurerIds[index]);
    };

    return (
        <div className="card  roster">
            <h2>Eventyrere</h2>
            <Inventory slots={adventurerIds.length} items={adventurerIds.map(id => adventurers[id].icon)} selectedSlotIndex={selectedIndex} onSlotClicked={selectAdventurer} />
        </div>
    )
}
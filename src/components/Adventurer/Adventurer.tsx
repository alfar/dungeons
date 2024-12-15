import { useState } from "react";
import { Inventory } from "../Inventory/Inventory";
import { ActionData } from "../../resources/locations";
import { useAppDispatch, withSave } from "../../app/hooks";

interface AdventurerProps {
    name: string;
    race: string;
    class: string;
    items: number[];
    onDrop: (index: number) => any;
    actions?: { [item: number]: ActionData };
    locked?: boolean;
}

export function Adventurer(props: AdventurerProps) {
    const dispatch = useAppDispatch();
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

    const commands = [];

    if (props.items[selectedSlotIndex] > 0)
    {
        commands.push(<button key={-1} onClick={() => props.onDrop(selectedSlotIndex)}>Efterlad</button>);
        if (props.actions && props.actions[props.items[selectedSlotIndex]]) {
            const act = props.actions[props.items[selectedSlotIndex]].act;
            commands.push(<button key={0} onClick={() => dispatch(withSave(act))}>{props.actions[props.items[selectedSlotIndex]].text}</button>);
        }
    }

    return (
        <div className="card  adventurer">
            <h1>{props.name}</h1>
            <section>{props.race} {props.class}</section>
            <Inventory slots={3} items={props.items} selectedSlotIndex={selectedSlotIndex} onSlotClicked={setSelectedSlotIndex}></Inventory>
            <div className="commands">
                {commands}
            </div>
        </div>
    );
}
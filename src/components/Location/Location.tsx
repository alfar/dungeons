import { useState } from "react";
import { Inventory } from "../Inventory/Inventory";
import { ActionData } from "../../resources/locations";
import { useAppDispatch, withSave } from "../../app/hooks";
import QRCode from "react-qr-code";
import { Roster } from "../Roster/Roster";
import { selectAdventurer } from "../../features/game/gameSlice";

interface LocationProps {
    locationId: number;
    name: string;
    description: string;
    items: number[];
    actions?: { [index: number]: ActionData };
    locked?: boolean;
    qr?: number;
    onPickUp: (index: number) => any;
}

export function Location(props: LocationProps) {
    const dispatch = useAppDispatch();
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

    const commands = [];

    if (!props.locked && props.items[selectedSlotIndex] > 0) {
        commands.push(<button key={-1} onClick={() => props.onPickUp(selectedSlotIndex)}>Saml op</button>);
        if (props.actions && props.actions[props.items[selectedSlotIndex]]) {
            const act = props.actions[props.items[selectedSlotIndex]].act;
            commands.push(<button key={0} onClick={() => dispatch(withSave(act))}>{props.actions[props.items[selectedSlotIndex]].text}</button>);
        }
    }

    const qr = props.qr ? (
        <QRCode value={"https://whee.dk/jul24/location/" + props.qr} />
    ) : null;

    const switchAdventurer = (id: number) => {
        dispatch(selectAdventurer(id));
    }

    return (
        <div className="card  location">
            <h1>{props.name}</h1>
            <section>{props.description}</section>
            {qr}
            {!props.locked && <div className="card">
                <h2>Ting</h2>
                <Inventory slots={props.items.length + 1} items={props.items} selectedSlotIndex={selectedSlotIndex} onSlotClicked={setSelectedSlotIndex} showDescriptions={true} />
                <div className="commands">
                    {commands}
                </div>
            </div>}
            {!props.locked && <Roster onAdventurerSwitch={switchAdventurer} locationId={props.locationId} />}
        </div>
    )
}
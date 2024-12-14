import { adventurers } from "../../resources/adventurers";
import { itemDescriptions } from "../../resources/itemDescriptions";
import { ItemSlot } from "../ItemSlot/ItemSlot";

import "./Inventory.scss";

interface InventoryProps {
    slots: number;
    selectedSlotIndex: number;
    items?: number[];
    onSlotClicked: (index: number) => any;
}

export function Inventory(props: InventoryProps){
    return (
        <div className="inventory">
            <div className="inventory__items">
            {Array.from({length: props.slots}, (_, i) => (
                <ItemSlot key={i} selected={i === props.selectedSlotIndex} onClick={() => props?.onSlotClicked(i)} itemIndex={props.items ? props.items[i] : 0}></ItemSlot>
            ))}
            </div>
            {props.items ? (props.items[props.selectedSlotIndex] > 0 ? <section>{itemDescriptions(props.items[props.selectedSlotIndex])}</section> : null ) : null}
        </div>
    )
}
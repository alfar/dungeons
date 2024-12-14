import React from 'react';

import "./ItemSlot.scss";
import { Item } from '../Item/Item';

interface ItemSlotProps {
    selected: boolean;
    onClick: () => any;
    itemIndex?: number;
}

/**
 * Component to hold an item
 */
export function ItemSlot(props: ItemSlotProps) 
{
    const item = props.itemIndex ? (
        <Item itemIndex={props.itemIndex} />
    ) : null;

    return (
        <div className={"item-slot" + (props.selected ? "  item-slot--selected" : "")} onClick={props.onClick}>
            {item}
        </div>
    );    
}

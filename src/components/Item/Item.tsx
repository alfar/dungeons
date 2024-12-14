import "./Item.scss";

interface ItemProps {
    itemIndex: number;
}

export function Item(props: ItemProps)
{
    return (
        <div className="item" style={{ "backgroundPosition": ((props.itemIndex % 16) * -64) + "px " + (Math.floor(props.itemIndex / 16) * -64) + "px" }}></div>
    );
}
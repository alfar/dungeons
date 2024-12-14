import { useParams } from "react-router-dom";
import { Situation } from "../Situation/Situation";
import { useEffect, useState } from "react";

export function SituationPage() {
    const { id } = useParams(); 
    const [adventurerId, setAdventurerId] = useState(parseInt(localStorage.getItem("adventurerId") ?? '1', 10));

    useEffect(() => {
        localStorage.setItem("adventurerId", adventurerId.toString());
    }, [adventurerId]);

    return (
        <Situation adventurerId={adventurerId} locationId={parseInt(id!)} onAdventurerSwitch={setAdventurerId} />
    )
}
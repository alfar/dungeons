import { useEffect } from "react";
import { Adventurer } from "../Adventurer/Adventurer";
import { Location } from "../Location/Location";

import "./Situation.scss";

import { locations } from "../../resources/locations";
import { adventurers } from "../../resources/adventurers";
import { Roster } from "../Roster/Roster";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changeLocation, dropItem, initializeLocation, pickUpItem, selectAdventurer } from "../../features/game/gameSlice";

interface SituationProps {
    adventurerId: number,
    locationId: number,
    onAdventurerSwitch: (id: number) => any
}

export function Situation(props: SituationProps) {
    const state = useAppSelector(state => state.game);
    const dispatch = useAppDispatch();

    const adventurer = adventurers[state.activeAdventurer];
    adventurer.items = state.adventurerItems[state.activeAdventurer] ?? [];
    adventurer.lastLocation = state.currentLocation;

    const location = locations[props.locationId](adventurer, state);

    useEffect(() => {
        if (!location.locked) {
            if (adventurer.lastLocation !== props.locationId) {
                dispatch(changeLocation(props.locationId));
            }
            if (state.locationItems[props.locationId] === undefined) {
                dispatch(initializeLocation(location.items ?? []))
            }
        }        
    });

    if (state.locationItems[props.locationId]) {
        location.items = state.locationItems[props.locationId];
    }

    const dropAction = (index: number) => {
        if (!location.locked) {
            dispatch(dropItem(index));
        }
    };

    const pickUpAction = (index: number) => {
        dispatch(pickUpItem({ locationId: props.locationId, itemIndex: index}));
    };

    const switchAdventurer = (id: number) => {
        dispatch(selectAdventurer(id));
    }

    const roster = props.locationId === 0 ? <Roster onAdventurerSwitch={switchAdventurer} /> : null;

    return (
        <div className="situation">
            {roster}
            <Adventurer {...adventurer} locked={location.locked} actions={location.actions} items={adventurer.items ?? []} onDrop={dropAction} />
            <Location {...location} items={location.items ?? []} onPickUp={pickUpAction} />
        </div>

    );
}
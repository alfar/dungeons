import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { createItem, GameState, setFlag, spendItem } from "../features/game/gameSlice";

export interface ActionData {
    text: string;
    act: any;
}

export interface AdventurerData {
    name: string;
    race: string;
    class: string;
    items: number[];
    lastLocation: number;
    icon: number;
}

interface LocationData {
    name: string,
    description: string,
    items?: number[];
    actions?: { [item: number]: ActionData },
    locked?: boolean;
}

const lockLocation = (validLocations: number[], location_func: (adventurer: AdventurerData, state: GameState) => LocationData) => {
    return (adventurer: AdventurerData, state: GameState) => {
        if (validLocations.indexOf(adventurer.lastLocation) === -1) {
            return {
                "name": "Gået forkert",
                "description": "Her kan du ikke komme hen fra der, du kommer fra.",
                "locked": true
            };
        }

        return location_func(adventurer, state);
    }
}

function location_inn(adventurer: AdventurerData, state: GameState) {
    if (state.flags.indexOf("potioned") > -1) {
        return {
            "name": "Krostue",
            "description": "Krostuen er pakket fuld. Landsbyens beboere og eventyrerne danser rundt på bordene og holder fest. Vi har reddet det syge barn!"            
        }
    }
    else {
        return {
            "name": "Krostue",
            "description": "Du står i en krostue. Eventyrere sidder rundt ved bordene og slapper af imellem deres eventyr. Ved baren står en kvinde med et sygt barn. Hvis bare nogen ville skaffe en helbredende trylledrik.",
            "items": [500],
            "actions": {
                275: { text: "Aflever", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("potioned")); dispatch(spendItem(275)); } }
            }
        };
    }
}

function location_entrance(adventurer: AdventurerData, state: GameState) {
    return {
        "name": "Indgang",
        "description": "Indgangen til den lokale dungeon er et ujævnt hul i klippen. Ingen har gjort noget for at gøre det nemmere at komme ind - eller ud.",
        "items": [396]
    };
}

function location_passage(adventurer: AdventurerData, state: GameState) {
    if (adventurer.items.indexOf(396) > -1 || (state.locationItems[2]?.indexOf(396) ?? -1) > -1) {
        return {
            "name": "Smal passage",
            "description": "Gangen bliver smallere og smallere til du til sidst må klemme dig forbi skarpe kanter, der stikker ud af væggene."
        };
    }
    else {
        return {
            "name": "Smal passage",
            "description": "Gangen bliver smallere og smallere til du til sidst må klemme dig forbi skarpe kanter, der stikker ud af væggene. Det sidste lys forsvinder bag dig, og det bliver for mørkt at fortsætte.",
            "locked": true
        };
    }
}

function location_crossing(adventurer: AdventurerData, state: GameState) {
    return {
        "id": 3,
        "name": "T-Kryds",
        "description": "Den let fugtige gang oplyses her af fakler, der hænger på væggene. Gangen deler sig, så der er to veje at fortsætte.",
        "items": [10]
    };
}

function location_trap(adventurer: AdventurerData, state: GameState) {
    if (state.flags.indexOf("trap1") > -1) {
        return {
            "id": 4,
            "name": "Gang",
            "description": "Gangen fortsætter ligeud et langt stykke. Væggene er fugtige og luften tung. Nogen har deaktiveret en fælde ved at sætte en mønt i klemme, så pladen over hullet ikke kan flytte sig.",
        };
    }
    else if (adventurer.class === "Tyv") {
        return {
            "id": 4,
            "name": "Fælde!",
            "description": "Gangen fortsætter ligeud et langt stykke. Fælden er ikke svær at få øje på - et dybt hul i gulvet med en plade over, men hvordan slår man den fra?",
            "actions": {
                10: { "text": "Klem mønten fast", "act": (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("trap1")); dispatch(spendItem(10)); } }
            }
        };
    }
    else {
        return {
            "id": 4,
            "name": "Gang",
            "description": "Gangen fortsætter ligeud et langt stykke. Væggene er fugtige og luften tung.",
        };
    }
}

function location_altar(adventurer: AdventurerData, state: GameState) {
    if (state.flags.indexOf("trap1") === -1) {
        return {
            id: 6,
            name: "Fælde!",
            description: "Da du fortsætter ad gangen, aktiverer du en fælde, og en plade i gulvet glider væk. Heldigvis når du netop at standse inden du falder i det dybe hul under pladen. Du må hellere vende tilbage, hvor du kom fra.",
            locked: true
        };
    }
    else {
        const actions = adventurer.class === 'Præst' ? {
            274: { text: "Velsign", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(spendItem(274)); dispatch(createItem(275)) } }
        } : undefined;
        return {
            "id": 6,
            "name": "Alterrum",
            "description": "Et stort firkantet rum med et alter midt for den fjerne væg.",
            items: [455],
            actions
        };
    }
}

function location_cave(adventurer: AdventurerData, state: GameState) {
    if (state.flags.indexOf("goblins") > 0) {
        return {
            id: 5,
            name: "Storhulen",
            description: "En stor hule fuld af døde gobliner."
        }
    }
    if (adventurer.class === "Berserker") {
        return {
            id: 5,
            name: "Storhulen",
            description: "En stor hule fuld af gobliner - en fair kamp, hvis man har et våben.",
            actions: {
                455: { text: "ANGRIB!", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("goblins")); dispatch(createItem(274)) } }
            }
        }
    }
    else {
        return {
            id: 5,
            name: "Storhulen",
            description: "En stor hule fuld af gobliner - alt for mange til at klare alene.",
            locked: true
        }
    }
}

export const locations: { [index: number]: (adventurer: AdventurerData, state: GameState) => LocationData } = {
    0: lockLocation([0, 1], location_inn),
    1: lockLocation([0, 1, 2], location_entrance),
    2: lockLocation([1, 2, 3], location_passage),
    3: lockLocation([2, 3, 4, 5], location_crossing),
    4: lockLocation([3, 4, 6], location_trap),
    5: lockLocation([3, 5], location_cave),
    6: lockLocation([4, 6], location_altar)
};
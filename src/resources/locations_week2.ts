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
    qr?: number;
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
    if (state.flags.indexOf("crowned") > -1) {
        return {
            "name": "Krostue",
            "description": "Krostuen er pakket fuld. Landsbyens beboere, kongen og eventyrerne danser rundt på bordene og holder fest. Vi har fundet kongens krone!"
        }
    }
    else {
        return {
            "name": "Krostue",
            "description": "Du står i en krostue. Eventyrere sidder rundt ved bordene og slapper af imellem deres eventyr. Ved baren står en forhenværende konge. Hvis bare nogen ville finde hans krone, så han kunne genvinde tronen.",
            "items": Object.values(state.adventurerItems).some(a => a.includes(455)) ? [500, 416] : [500, 455, 416],
            "actions": {
                733: { text: "Aflever", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("crowned")); dispatch(spendItem(733)); } }
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
        "items": []
    };
}

function location_trap(adventurer: AdventurerData, state: GameState) {
    if (state.flags.indexOf("trap2") > -1) {
        return {
            "id": 4,
            "name": "Gang",
            "description": "Gangen fortsætter ligeud et langt stykke. Væggene er fugtige og luften tung. Et spejl er sat op, så de reflekterer en lysstråle. Fælden er deaktiveret.",
        };
    }
    else if (adventurer.class === "Tyv") {
        return {
            "id": 4,
            "name": "Fælde!",
            "description": "Gangen fortsætter ligeud et langt stykke. Fælden er ikke svær at få øje på - en lysstråle aktiverer noget, der skyder ud af væggene i begge sider, når den bliver brudt, men hvordan slår man den fra?",
            "actions": {
                422: { "text": "Reflektér", "act": (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("trap2")); dispatch(spendItem(422)); } }
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
    if (state.flags.indexOf("trap2") === -1) {
        return {
            id: 6,
            name: "Fælde!",
            description: "Da du fortsætter ad gangen, aktiverer du en fælde, og tusindvis af spidse pigge skyder ud af væggene. Heldigvis når du netop at standse inden du bliver en nålepude. Du må hellere vende tilbage, hvor du kom fra.",
            locked: true
        };
    }
    else if (state.flags.indexOf("altar2") > 0) {
        return {
            "id": 6,
            "name": "Alterrum",
            "description": adventurer.race === "Ork" ? "Et stort firkantet rum med et alter midt for den fjerne væg. Alteret er løst, og med dine store kræfter løfter du den ene side af alteret og afslører en meget lille gang. Måske kender du en, der kan klemme sig igennem?" : "Et stort firkantet rum med et alter midt for den fjerne væg. Alteret er løsnet fra væggen, men alt for tungt at løfte.",
            "qr": adventurer.race === "Ork" ? 7 : undefined,
            items: []
        };
    }
    else {
        const actions = {
            500: { text: "Stik i hullet", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(spendItem(500)); dispatch(setFlag("altar2")) } }
        };

        return {
            "id": 6,
            "name": "Alterrum",
            "description": "Et stort firkantet rum med et alter midt for den fjerne væg. Ved nærmere eftersyn finder du et lille hul i siden af alteret, lidt mindre end en finger.",
            items: [],
            actions
        };
    }
}

function location_cave(adventurer: AdventurerData, state: GameState) {
    if (adventurer.class === "Præst") {
        if (state.flags.indexOf("skeleton") > -1) {
            return {
                id: 5,
                name: "Storhulen",
                description: "En stor hule. Et skelet står i et hjørne, skræmt af guddommelig vilje. Dit fokus er på at holde skelettet fanget.",
                qr: 8
            };
        }
        else {
            return {
                id: 5,
                name: "Storhulen",
                description: "En stor hule. Midt i hulen står et skelet klar til at angribe. Er din gud med dig?",
                actions: {
                    416: { text: "Bortman udøde", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("skeleton")); dispatch(spendItem(416)); } }
                }
            }
        }
    }
    else {
        return {
            id: 5,
            name: "Storhulen",
            description: "En stor hule. Midt i hulen står et skelet klar til at angribe. Magien, der animerer skelettet, fylder dig med afsky - og skræk. Må guderne være med os!",
            locked: true
        }
    }
}

function location_cave_turned(adventurer: AdventurerData, state: GameState) {
    if (state.flags.includes("skeleton")) {
        return {
            id: 8,
            name: "Storhulen",
            description: "En stor hule. En bunke knogler ligger i et hjørne.",
            items: [422],
            qr: 8
        };
    }
    else {
        return {
            id: 8,
            name: "Storhulen",
            description: "En stor hule. Et skelet står i et hjørne, skræmt af guddommelig vilje. Fuldstændig forsvarsløs.",
            actions: {
                455: { text: "ANGRIB!", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("skeleton2")); dispatch(createItem(422)) } }
            }
        };
    }
}

function location_hideyhole(adventurer: AdventurerData, state: GameState) {
    if (adventurer.race !== 'Halving') {
        return {
            id: 7,
            name: "Der er ikke plads.",
            description: "Du er for stor til at krybe ind i gangen",
            locked: true
        };
    }
    else {
        return {
            id: 7,
            name: "Lille gang",
            description: "Gangen er meget smal og lavloftet. Godt man ikke er større.",
            items: [733]
        }
    }
}

export const locations: { [index: number]: (adventurer: AdventurerData, state: GameState) => LocationData } = {
    0: lockLocation([0, 1], location_inn),
    1: lockLocation([0, 1, 2], location_entrance),
    2: lockLocation([1, 2, 3], location_passage),
    3: lockLocation([2, 3, 4, 5, 8], location_crossing),
    4: lockLocation([3, 4, 6], location_trap),
    5: lockLocation([3, 5], location_cave),
    6: lockLocation([4, 6, 7], location_altar),
    7: lockLocation([6, 7], location_hideyhole),
    8: lockLocation([3, 5, 8], location_cave_turned)
};
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { createItem, GameState, setFlag, spendItem } from "../features/game/gameSlice";

type ActionList = { [item: number]: ActionData };

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
    actions?: ActionList,
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
    return {
        "name": "Krostue",
        "description": "Du står i en krostue. Eventyrere sidder rundt ved bordene og slapper af imellem deres eventyr. Kongen har forbedret den lokale dungeon, men også indført en afgift - forhåbentlig kan man finde noget af værdi derinde.",
        "items": [450, 10]
    };
}

function location_entrance(adventurer: AdventurerData, state: GameState) {
    if (adventurer.name === "Inga") {
        return {
            "name": "Indgang",
            "description": "Indgangen til den lokale dungeon er markeret op med tykke bjælker. Ved indgangen står vagten Georg, der opkræver en guldmønt af enhver, der vil ind. Georg smiler til dig og vinker dig ind, selv om du ikke har betalt, og er måske ikke så optaget af, hvad der ellers sker omkring ham.",
            "items": []
        }
    }
    else {
        const entrance: LocationData = {
            "name": "Indgang",
            "description": "Indgangen til den lokale dungeon er markeret op med tykke bjælker.",
            actions: {}
        };

        if (!state.flags.includes("paid_" + state.activeAdventurer)) {
            entrance.description += " Ved indgangen står vagten Georg, der opkræver en guldmønt af enhver, der vil ind.";
            entrance.actions![10] = { text: "Betal", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("paid_" + state.activeAdventurer)); dispatch(spendItem(10)); } };
        }
        else {
            entrance.description += " Ved indgangen står vagten Georg, der vinker dig ind, nu hvor du har betalt.";
        }

        if (state.currentLocation[1] === 1) {
            entrance.description += " Lige nu virker han dog mest optaget af at se på Inga.";

            if (adventurer.class === "Tyv" && !state.flags.includes("cutpurse")) {
                entrance.actions![450] = { text: "\"Lån\"", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("cutpurse")); dispatch(createItem(10)); } };
            }
        }

        return entrance;
    }
}

function location_passage(adventurer: AdventurerData, state: GameState) {
    if (adventurer.name !== "Inga" && !state.flags.includes("paid_" + state.activeAdventurer)) {
        return {
            "name": "Holdt!",
            "description": "Vagten Georg standser dig før du kommer ind. Det koster en guldmønt at komme ind!",
            "locked": true
        };
    }

    if (Object.keys(state.currentLocation).map(id => parseInt(id, 10)).filter(id => state.activeAdventurer !== id).some(id => state.currentLocation[id] === 2)) {
        return {
            "name": "Smal passage",
            "description": "Gangen bliver hurtigt smallere. I gangen foran dig står en anden eventyrer, så du kan ikke komme forbi.",
            "locked": true
        };
    }

    if (adventurer.race === "Halving") {
        return {
            "name": "Smal passage",
            "description": "Gangen bliver hurtigt smallere, men ikke så meget at det bliver ubekvemt. Der er bare kun plads til en person ad gangen. Dit blik fanger en lille sidegang."
        };
    }

    return {
        "name": "Smal passage",
        "description": "Gangen bliver hurtigt smallere, men ikke så meget at det bliver ubekvemt. Der er bare kun plads til en person ad gangen."
    };
}

function location_crossing(adventurer: AdventurerData, state: GameState) {
    return {
        "id": 3,
        "name": "T-Kryds",
        "description": "Den let fugtige gang oplyses her af fakler, der hænger på væggene. Gangen deler sig, så der er to veje at fortsætte.",
        "items": [397]
    };
}

function location_trap(adventurer: AdventurerData, state: GameState) {
    if (state.flags.indexOf("trap3") > -1) {
        return {
            "id": 4,
            "name": "Kløft",
            "description": "Gangen fortsætter ligeud et stykke og ender så ved en dyb og bred kløft. Et reb hænger ned fra et klippefremspring højt oppe.",
        };
    }
    else if (adventurer.class === "Tyv") {
        return {
            "id": 4,
            "name": "Kløft",
            "description": "Gangen fortsætter ligeud et stykke og ender så ved en dyb og bred kløft. Højt oppe er der et klippefremspring, man måske kunne fæstne et reb til?",
            "actions": {
                397: { "text": "Kast", "act": (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("trap3")); dispatch(spendItem(397)); } }
            }
        };
    }
    else {
        return {
            "id": 4,
            "name": "Kløft",
            "description": "Gangen fortsætter ligeud et stykke og ender så ved en dyb og bred kløft.",
            "locked": true
        };
    }
}

function location_ledge(adventurer: AdventurerData, state: GameState) {
    if (!state.flags.includes("trap3")) {
        return {
            "name": "Gået forkert",
            "description": "Her kan du ikke komme hen fra der, du kommer fra.",
            "locked": true
        };
    }
    else {
        return {
            "name": "Klippeafsats",
            "description": "Højt over kløften er der en klippeafsats, der leder hele vejen over til den anden side."
        }
    }
}

function location_altar(adventurer: AdventurerData, state: GameState) {
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

function location_cave(adventurer: AdventurerData, state: GameState) {
    if (state.flags.includes("treasure")) {
        return {
            id: 5,
            name: "Storhulen",
            description: "En stor hule. Dragen ligger død for dine fødder. Bagest i hulen er en dør gledet til side og afslører et rum mere!",
        }
    }

    if (state.flags.includes("healed")) {
        if (adventurer.class === "Tyv") {
            return {
                id: 5,
                name: "Storhulen",
                description: "En stor hule. Dragen ligger død for dine fødder. Bagest i hulen finder du en smal sprække, der er usædvanligt lige og dørformet. Et kloformet hul ser ud til at være åbnemekanismen.",
                actions: {
                    887: { text: "Åbn dør", act: setFlag("treasure") }
                } as ActionList
            };
        }
        return {
            id: 5,
            name: "Storhulen",
            description: "En stor hule. Dragen ligger død for dine fødder."
        };
    }

    if (adventurer.class === "Berserker") {
        if (state.flags.includes("dragon")) {
            return {
                id: 5,
                name: "Storhulen",
                description: "En stor hule. Dragen ligger død for dine fødder, men du er selv for slemt såret til at kunne bevæge dig."
            };
        }
        else {
            return {
                id: 5,
                name: "Storhulen",
                description: "En stor hule. Midt i hulen står en kæmpestor drage. En værdig modstander!",
                actions: {
                    455: { text: "Angrib!", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("dragon")); dispatch(createItem(887)); } }
                } as ActionList
            }
        }
    }
    else {
        if (state.flags.includes("dragon")) {
            return {
                id: 5,
                name: "Storhulen",
                description: "En stor hule. Dragen er død, men Garrkh er hårdt såret og kan ikke bevæge sig. Du må hjælpe ham!",
                actions: {
                    275: { text: "Helbred Garrkh", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("healed")); dispatch(spendItem(275)); } }
                } as ActionList
            };
        }
        else {
            return {
                id: 5,
                name: "Storhulen",
                description: "En stor hule. Midt i hulen står en kæmpestor drage. Skynd dig væk!",
                locked: true
            };
        }
    }
}

function location_treasure_cave(adventurer: AdventurerData, state: GameState) {
    if (state.flags.includes("treasure")) {
        return {
            id: 8,
            name: "Drageskatten",
            description: "Dragens skat var gemt bag døren! Tillykke! I har klaret eventyret.",
            items: [262]
        };
    }
    else {
        return {
            "name": "Gået forkert",
            "description": "Her kan du ikke komme hen fra der, du kommer fra.",
            "locked": true
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
            description: "Gangen er meget smal og lavloftet. Godt man ikke er større. Der gror nogle sjove planter her.",
            items: [292]
        }
    }
}

function location_lake(adventurer: AdventurerData, state: GameState) {
    if (adventurer.race === "Ork") {
        if (state.flags.includes("smoked")) {
            return {
                name: "Underjordisk sø",
                description: "I denne hule er det meste af gulvet en sø med ulækkert vand - man kunne jo risikere at blive vasket! Ved kanten sidder en ork shaman og ryger glad på sin vandpibe.",
            };
        }
        return {
            name: "Underjordisk sø",
            description: "I denne hule er det meste af gulvet en sø med ulækkert vand - man kunne jo risikere at blive vasket! Ved kanten sidder en ork shaman og kigger trist på sin vandpibe.",
            actions: {
                292: { text: "Aflevér", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(setFlag("smoked")); dispatch(spendItem(292)); dispatch(createItem(280)); } }
            } as ActionList
        }
    }
    else {
        if (state.flags.includes("smoked")) {
            return {
                name: "Underjordisk sø",
                description: "I denne hule er det meste af gulvet en sø med rent og klart vand - man kunne drikke det! Ved kanten sidder en ork med maling på krop og ansigt og ryger glad på sin vandpibe.",
                actions: {
                    280: { text: "Fyld", act: (dispatch: ThunkDispatch<{ game: GameState }, undefined, UnknownAction>) => { dispatch(spendItem(280)); dispatch(createItem(274)); } }
                } as ActionList
            };
        }
        return {
            name: "Underjordisk sø",
            description: "I denne hule er det meste af gulvet en sø med rent og klart vand - man kunne drikke det, hvis det ikke var for den ork, der sidder ved kanten."
        };
    }
}

export const locations: { [index: number]: (adventurer: AdventurerData, state: GameState) => LocationData } = {
    0: lockLocation([0, 1], location_inn),
    1: lockLocation([0, 1, 2], location_entrance),
    2: lockLocation([1, 2, 3, 7], location_passage),
    3: lockLocation([2, 3, 4, 5, 10], location_crossing),
    4: lockLocation([3, 4, 9], location_trap),
    5: lockLocation([3, 5, 8], location_cave),
    6: lockLocation([9, 6], location_altar),
    7: lockLocation([2, 7], location_hideyhole),
    8: lockLocation([5, 8], location_treasure_cave),
    9: lockLocation([4, 6, 9], location_ledge),
    10: lockLocation([3, 10], location_lake)
};
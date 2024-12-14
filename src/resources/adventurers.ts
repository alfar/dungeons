import { AdventurerData } from "./locations";

const inga = {
    "name": "Inga",
    "race": "Menneske",
    "class": "Præst",
    "items": [],
    lastLocation: 0,
    icon: 484
};

const jarl = {
    "name": "Jarl",
    "race": "Halving",
    "class": "Tyv",
    "items": [],
    lastLocation: 0,
    icon: 360
};

const garrk = {
    "name": "Garrk",
    "race": "Ork",
    "class": "Berserker",
    "items": [],
    lastLocation: 0,
    icon: 455
};

export const adventurers: { [index: number]: AdventurerData } = {
    1: inga,
    2: jarl,
    3: garrk
};
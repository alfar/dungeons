import { GameState } from "../features/game/gameSlice";

export const itemDescriptions = (item: number, state: GameState) => {
    if (state.activeAdventurer === 3) {
        switch (item) {
            case 455: return 'Økse!!';
            case 450: return 'Lillebitte økse';
            case 292: return 'Shamanurt';
            default: return 'Ikke økse';
        }
    }
    switch (item) {
        case 10: return 'En guldmønt';
        case 397: return 'Et reb';
        case 280: return 'En tom flaske';
        case 274: return 'En flaske med søvand';
        case 275: return 'En helbredende trylledrik';
        case 292: return 'En sjov plante';
        case 500: return 'En tryllestav, meget tynd';
        case 416: return 'Et helligt symbol';
        case 450: return 'En kniv';
        case 455: return 'En økse';
        case 733: return 'En kongekrone';
        case 396: return 'En fakkel';
        case 422: return 'Et spejl';
        case 887: return 'En drageklo';
    };
    return undefined;
};
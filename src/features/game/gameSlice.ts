import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adventurers } from "../../resources/adventurers";

export interface GameState {
    activeAdventurer: number;
    currentLocation: number;
    locationItems: { [id: number]: number[] };
    adventurerItems: { [id: number]: number[] };
    flags: string[];
}

const initialState: GameState = {
    activeAdventurer: 1,
    currentLocation: 0,
    locationItems: {},
    adventurerItems: {},
    flags: []
};

interface PickupActionPayload {
    locationId: number;
    itemIndex: number;
}

export const gameSlice = createSlice({
    name: 'items',
    initialState: initialState,
    reducers: {
        changeLocation: (state, action: PayloadAction<number>) => {
            state.currentLocation = action.payload;
        },
        selectAdventurer: (state, action: PayloadAction<number>) => {
            state.activeAdventurer = action.payload;
            localStorage.setItem("adventurerId", action.payload.toString());
        },
        pickUpItem: (state, action: PayloadAction<PickupActionPayload>) => {
            if (state.adventurerItems[state.activeAdventurer] === undefined) {
                state.adventurerItems[state.activeAdventurer] = adventurers[state.activeAdventurer].items;
            }

            const emptyIndex = state.adventurerItems[state.activeAdventurer].indexOf(0);
            if (emptyIndex > -1) {
                state.adventurerItems[state.activeAdventurer][emptyIndex] = state.locationItems[action.payload.locationId][action.payload.itemIndex];
            }
            else if (state.adventurerItems[state.activeAdventurer].length < 3) {
                state.adventurerItems[state.activeAdventurer].push(state.locationItems[action.payload.locationId][action.payload.itemIndex]);
            }
            else {
                return;
            }
            state.locationItems[action.payload.locationId] = state.locationItems[action.payload.locationId].filter((_, i) => i !== action.payload.itemIndex);
        },
        dropItem: (state, action: PayloadAction<number>) => {
            state.locationItems[state.currentLocation].push(state.adventurerItems[state.activeAdventurer][action.payload]);
            state.adventurerItems[state.activeAdventurer] = state.adventurerItems[state.activeAdventurer].filter((_, i) => i !== action.payload);
        },
        initializeLocation: (state, action: PayloadAction<number[]>) => {
            state.locationItems[state.currentLocation] = action.payload;
        },
        setFlag: (state, action: PayloadAction<string>) => {
            state.flags.push(action.payload);
        },
        spendItem: (state, action: PayloadAction<number>) => {
            state.adventurerItems[state.activeAdventurer] = state.adventurerItems[state.activeAdventurer].map((v, i) => v === action.payload ? 0 : v);
        },
        createItem: (state, action: PayloadAction<number>) => {
            state.locationItems[state.currentLocation].push(action.payload);
        },
        resetGame: (state, action: Action) => {
            state.locationItems = {};
            state.adventurerItems = {};
            state.flags = [];
            state.activeAdventurer = 1;
        }
    }
});

export const { changeLocation, initializeLocation, selectAdventurer, pickUpItem, dropItem, setFlag, spendItem, createItem, resetGame } = gameSlice.actions;

export default gameSlice.reducer;

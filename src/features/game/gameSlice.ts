import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adventurers } from "../../resources/adventurers";
import { fetchUpdate } from "../updater/updaterSlice";

export interface GameState {
    activeAdventurer: number;
    currentLocation: { [id: number]: number };
    locationItems: { [id: number]: number[] };
    adventurerItems: { [id: number]: number[] };
    flags: string[];
}

const initialState: GameState = {
    activeAdventurer: 1,
    currentLocation: {},
    locationItems: {},
    adventurerItems: {},
    flags: []
};

interface ChangeLocationPayload {
    locationId: number;
    adventurerId: number;
}

interface PickupActionPayload {
    locationId: number;
    itemIndex: number;
}

export const gameSlice = createSlice({
    name: 'items',
    initialState: initialState,
    reducers: {
        changeLocation: (state: GameState, action: PayloadAction<ChangeLocationPayload>) => {
            state.currentLocation[action.payload.adventurerId] = action.payload.locationId;
        },
        selectAdventurer: (state: GameState, action: PayloadAction<number>) => {
            state.activeAdventurer = action.payload;
            localStorage.setItem("adventurerId", action.payload.toString());
        },
        pickUpItem: (state: GameState, action: PayloadAction<PickupActionPayload>) => {
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
        dropItem: (state: GameState, action: PayloadAction<number>) => {
            state.locationItems[state.currentLocation[state.activeAdventurer] ?? 0].push(state.adventurerItems[state.activeAdventurer][action.payload]);
            state.adventurerItems[state.activeAdventurer] = state.adventurerItems[state.activeAdventurer].filter((_, i) => i !== action.payload);
        },
        initializeLocation: (state: GameState, action: PayloadAction<number[]>) => {
            state.locationItems[state.currentLocation[state.activeAdventurer] ?? 0] = action.payload;
        },
        setFlag: (state: GameState, action: PayloadAction<string>) => {
            state.flags.push(action.payload);
        },
        spendItem: (state: GameState, action: PayloadAction<number>) => {
            state.adventurerItems[state.activeAdventurer] = state.adventurerItems[state.activeAdventurer].map((v, i) => v === action.payload ? 0 : v);
        },
        createItem: (state: GameState, action: PayloadAction<number>) => {
            state.locationItems[state.currentLocation[state.activeAdventurer] ?? 0].push(action.payload);
        },
        resetGame: (state: GameState, action: Action) => {
            state.locationItems = {};
            state.adventurerItems = {};
            state.flags = [];
            state.activeAdventurer = 1;
            state.currentLocation = {};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUpdate.fulfilled, (state, action) => {
            return {...state, ...action.payload, activeAdventurer: parseInt(localStorage.getItem("adventurerId") ?? "0", 10)};
        });
    }
});

export const { changeLocation, initializeLocation, selectAdventurer, pickUpItem, dropItem, setFlag, spendItem, createItem, resetGame } = gameSlice.actions;

export default gameSlice.reducer;

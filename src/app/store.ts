import { configureStore } from "@reduxjs/toolkit";

import gameReducer, { GameState } from '../features/game/gameSlice';
import updateReducer from '../features/updater/updaterSlice'

const persistedState : { game: GameState } = { ...(JSON.parse(localStorage.getItem('reduxState') ?? JSON.stringify({
    items: {
        currentLocation: {},
        selectedAdventurer: 1,
        adventurerItems: {},
        locationItems: {}
    }
}))), activeAdventurer: parseInt(localStorage.getItem("adventurerId") ?? "0", 10) };

const store = configureStore({
    reducer: {
        game: gameReducer,
        updater: updateReducer
    },
    preloadedState: persistedState
});

store.subscribe(() => {
    if (store.getState().updater.saving) {
        fetch("/jul24/storage.php", { body: JSON.stringify(store.getState().game), method: "POST" });
    }
    localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
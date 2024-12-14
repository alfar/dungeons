import { configureStore } from "@reduxjs/toolkit";

import gameReducer, { GameState } from '../features/game/gameSlice';

const persistedState : { game: GameState } = JSON.parse(localStorage.getItem('reduxState') ?? JSON.stringify({
    items: {
        currentLocation: 0,
        selectedAdventurer: 1,
        adventurerItems: {},
        locationItems: {}
    }
}));

const store = configureStore({
    reducer: {
        game: gameReducer
    },
    preloadedState: persistedState
});

store.subscribe(() => {
    localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
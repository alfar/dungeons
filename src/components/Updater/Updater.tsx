import useInterval from "react-useinterval";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUpdate } from "../../features/updater/updaterSlice";

export function Updater() {

    const state = useAppSelector(state => state.updater);
    const dispatch = useAppDispatch();
    useInterval(() => {
        dispatch(fetchUpdate());
    }, 5000);
    return <div></div>;
}
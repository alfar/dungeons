import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { markForSave } from '../features/updater/updaterSlice'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const withSave = (action: any) => (dispatch: any) => { dispatch(action); dispatch(markForSave()) };
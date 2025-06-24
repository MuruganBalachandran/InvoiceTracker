import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import userSlice from './userSlice';
import invoiceSlice from './invoiceSlice';
import expenseSlice from './expenseSlice';
import { RootState } from './types';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // We only really need to persist the user and theme.
  // Other data should be fetched from the API on load.
  whitelist: ['user'], 
};

const rootReducer = combineReducers({
  user: userSlice,
  invoices: invoiceSlice,
  expenses: expenseSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
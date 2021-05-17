import { applyMiddleware, createStore } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import { persistCombineReducers, persistStore } from 'redux-persist';
import { user } from './User';
import { appointmentesSchduled } from './AppointmentSchduled';
import { appointmentesCurrent } from './AppointmentsCurrent';
import { appointmentesPrevious } from './AppointmentsPrevious';
import { appointmentesAll } from './AllApointments';

export const ConfigureStore = () => {
    const config = {
        key: true,
        storage: AsyncStorage,
        debug: true
    };

    const store = createStore(
        persistCombineReducers(config, {
            user,
            appointmentesSchduled,
            appointmentesCurrent,
            appointmentesPrevious,
            appointmentesAll,
        }),
        applyMiddleware(thunk)
    );

    const persistor = persistStore(store);
    return { persistor, store };
}
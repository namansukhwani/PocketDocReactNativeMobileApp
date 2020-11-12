import {applyMiddleware,createStore} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import {persistCombineReducers,persistStore} from 'redux-persist';
import {user} from './User';

export const ConfigureStore=()=>{
    const config={
        key:true,
        storage:AsyncStorage,
        debug:true
    };

    const store=createStore(
        persistCombineReducers(config,{
            user,
        }),
        applyMiddleware(thunk)
    );

    const persistor=persistStore(store);
    return {persistor,store};
}
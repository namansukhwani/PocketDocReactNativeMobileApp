import * as ActionTypes from './ActionTypes';

export const appointmentesAll = (
    state = {
        isLoading: true,
        errMess: null,
        appointments: [],
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.ADD_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: null, appointments: action.payload };
        case ActionTypes.LOADING_APPOINTMENTS:
            return { ...state, isLoading: true };
        case ActionTypes.UPDATE_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: null, appointments: action.payload };;
        case ActionTypes.ERROR_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
}
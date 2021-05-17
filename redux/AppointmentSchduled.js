import * as ActionTypes from './ActionTypes';

export const appointmentesSchduled = (
    state = {
        isLoading: true,
        errMess: null,
        appointments: [],
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.ADD_SCHDULED_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: null, appointments: action.payload };
        case ActionTypes.LOADING_SCHDULED_APPOINTMENTS:
            return { ...state, isLoading: true };
        case ActionTypes.UPDATE_SCHDULED_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: null, appointments: action.payload };;
        case ActionTypes.ERROR_SCHDULED_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
}
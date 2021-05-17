import * as ActionTypes from './ActionTypes';

export const appointmentesCurrent = (
    state = {
        isLoading: true,
        errMess: null,
        appointments: [],
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.ADD_CURRENT_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: null, appointments: action.payload };
        case ActionTypes.LOADING_CURRENT_APPOINTMENTS:
            return { ...state, isLoading: true };
        case ActionTypes.UPDATE_CURRENT_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: null, appointments: action.payload };;
        case ActionTypes.ERROR_CURRENT_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
}
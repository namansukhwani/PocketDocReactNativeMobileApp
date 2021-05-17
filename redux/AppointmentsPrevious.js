import * as ActionTypes from './ActionTypes';

export const appointmentesPrevious = (
    state = {
        isLoading: true,
        errMess: null,
        appointments: [],
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.ADD_PREVIOUS_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: null, appointments: action.payload };
        case ActionTypes.LOADING_PREVIOUS_APPOINTMENTS:
            return { ...state, isLoading: true };
        case ActionTypes.UPDATE_PREVIOUS_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: null, appointments: action.payload };;
        case ActionTypes.ERROR_PREVIOUS_APPOINTMENTS:
            return { ...state, isLoading: false, errMess: action.payload };
        default:
            return state;
    }
}
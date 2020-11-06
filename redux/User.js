import * as ActionTypes from './ActionTypes';

export const user=(
    state={
        isLoading:true,
        errMess:null,
        user:{},
        available:false
    },
    action
)=>{
    switch(action.type)
    {
        case ActionTypes.ADD_USER:
            return null;
        case ActionTypes.LOADING_USER:
            return;
        case ActionTypes.UPDATE_USER:
            return;
        case ActionTypes.DELETE_USER:
            return;
        default:
            return state;
    }
}
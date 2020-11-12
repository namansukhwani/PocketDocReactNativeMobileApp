import * as ActionTypes from './ActionTypes';

export const user=(
    state={
        isLoading:false,
        errMess:null,
        user:{},
        available:false
    },
    action
)=>{
    switch(action.type)
    {
        case ActionTypes.ADD_USER:
            return {...state,isLoading:false,errMess:null,available:true,user:action.payload};
        case ActionTypes.LOADING_USER:
            return {...state,isLoading:true};
        case ActionTypes.UPDATE_USER:
            return;
        case ActionTypes.ERROR_USER:
            return {...state,isLoading:false,errMess:action.payload};
        case ActionTypes.DELETE_USER:
            return;
        default:
            return state;
    }
}
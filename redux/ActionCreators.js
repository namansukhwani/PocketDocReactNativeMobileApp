import * as ActionTypes from './ActionTypes';
import firestore from '@react-native-firebase/firestore';

const URL = "https://pdoc-api.herokuapp.com/";

//User Functions
export const getUserDetails = (uid) => dispatch => {
    dispatch(userLoading());
    return new Promise((resolve, reject) => {

        firestore().collection('users').doc(uid).get()
            .then(user => {
                if (user.exists) {
                    dispatch(userAdd(user.data()));
                    resolve();
                }
                else {
                    dispatch(userError("user does not exists"));
                    reject({ err: "user does not exists", status: true });
                }
            })
            .catch(err => {
                console.log(err);
                dispatch(userError(err));
                reject({ err: err, status: false });
            })
    })
    // return new Promise((resolve, reject) => {

    //     fetch(URL + `/users/${uid}`, {
    //         method: "GET",
    //         headers: new Headers({
    //             'Origin': 'https://PocketDocOnly.com',
    //             'Content-Type': 'application/json'
    //         }),
    //     })
    //         .then(res => res.json())
    //         .then(response => {
    //             if (!response.status) {
    //                 dispatch(userError(response.message));
    //                 reject({ err: response.message, status: true });
    //             }
    //             else {
    //                 dispatch(userAdd(response.data));
    //                 resolve();
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             dispatch(userError(err));
    //             reject({ err: err, status: false });
    //         })
    // })
}

export const addUserDetails = (uid, userData) => dispatch => {
    dispatch(userLoading());
    console.log("redux userLoading");

    return new Promise((resolve, reject) => {
        firestore().collection('users').doc(uid).set(userData)
            .then(() => {
                firestore().collection('users').doc(uid).get()
                    .then(user => {
                        if (user.exists) {
                            firestore().collection('users').doc(uid).collection("medicalHistory").doc().set({}).catch(err=>console.log(err))
                            firestore().collection('users').doc(uid).collection("paymentDetails").doc().set({}).catch(err=>console.log(err))
                            console.log("redux userAdd");
                            dispatch(userAdd(user.data()));
                            resolve();
                        }
                        else {
                            console.log("redux userError");
                            dispatch(userError("user not found"));
                            reject("user not found");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        dispatch(userError(err));
                        reject(err);
                    })
            })
            .catch(err => {
                console.log(err);
                dispatch(userError(err));
                reject(err);
            })
    })
    // return new Promise((resolve, reject) => {
    //     fetch(URL + `/users/${uid}`, {
    //         method: "POST",
    //         headers: new Headers({
    //             'Origin': 'https://PocketDocOnly.com',
    //             'Content-Type': 'application/json'
    //         }),
    //         body: userData
    //     })
    //         .then(res => res.json())
    //         .then(response => {
    //             if (!response.status) {
    //                 console.log("redux userError");
    //                 dispatch(userError(response.message));
    //                 reject(response.message);
    //             }
    //             else {
    //                 console.log("redux userAdd");
    //                 dispatch(userAdd(response.data));
    //                 resolve();
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             dispatch(userError(err));
    //             reject(err);
    //         })
    // })
}

export const updateUserDetails = (uid, updateData) => dispatch => {
    dispatch(userLoading());
    console.log("redux userLoading");

    return new Promise((resolve, reject) => {
        // console.log("inside user update promise");
       firestore().collection('users').doc(uid).update(updateData)
            .then(() => {
                // console.log("user profile updated");
                firestore().collection('users').doc(uid).get()
                .then(user => {
                    if (user.exists) {
                        console.log("redux userAdd");
                        dispatch(userAdd(user.data()));
                        resolve();
                    }
                    else {
                        console.log("redux userError");
                        dispatch(userError("user not found"));
                        reject("user not found");
                    }
                })
                .catch(err => {
                    console.log("this is the error",err);
                    dispatch(userError(err));
                    reject(err);
                })
                
            })
            .catch(err => {
                console.log("this is the error",err);
                dispatch(userError(err));
                reject(err);
            })
    })

    // return new Promise((resolve, reject) => {
    //     fetch(URL + `/users/${uid}`, {
    //         method: "PUT",
    //         headers: new Headers({
    //             'Origin': 'https://PocketDocOnly.com',
    //             'Content-Type': 'application/json'
    //         }),
    //         body: updateData
    //     })
    //         .then(res => res.json())
    //         .then(response => {
    //             if (!response.status) {
    //                 console.log("redux userError");
    //                 dispatch(userError(response.message));
    //                 reject(response.message);
    //             }
    //             else {
    //                 console.log("redux userUpdated");
    //                 dispatch(userAdd(response.data));
    //                 resolve();
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             dispatch(userError(err));
    //             reject(err);
    //         })
    // })
}

const userLoading = () => ({
    type: ActionTypes.LOADING_USER
})

const userAdd = (userData) => ({
    type: ActionTypes.ADD_USER,
    payload: userData
})

const userError = (err) => ({
    type: ActionTypes.ERROR_USER,
    payload: err
})

//Chats
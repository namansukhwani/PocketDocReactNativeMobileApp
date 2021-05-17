import * as ActionTypes from './ActionTypes';
import firestore from '@react-native-firebase/firestore';

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
                            firestore().collection('users').doc(uid).collection("medicalHistory").doc().set({
                                url: 'https://firebasestorage.googleapis.com/v0/b/pocketdoc-f1700.appspot.com/o/reports%2FNAMAN-SUKHWANI-Participant-Certificate.pdf?alt=media&token=e87156d3-b171-43cf-9f4e-975ac53dfb52',
                                name: "Sample Report",
                                dateCreated: firestore.Timestamp.now(),
                                appointments: []
                            }).catch(err => console.log(err))
                            firestore().collection('users').doc(uid).collection("paymentDetails").doc().set({}).catch(err => console.log(err))
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
                        console.log("this is the error", err);
                        dispatch(userError(err));
                        reject(err);
                    })

            })
            .catch(err => {
                console.log("this is the error", err);
                dispatch(userError(err));
                reject(err);
            })
    })
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

//Appointments

export const addAppointments = (appointments) => dispatch => {

    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)

    var appointmentsCurrent = appointments.filter((appointment) => {
        return appointment.time.toDate() >= dayStart
    })

    var appointmentsPrevious = appointments.filter((appointment) => {
        return appointment.time.toDate() <= dayStart
    })

    var appointmentsSchduled = appointments.filter((appointment) => {
        return appointment.time.toDate() >= dayStart && (appointment.status == "accepted")
    })

    settlePreviousPendingAppointments(appointmentsPrevious);

    dispatch(addAppointmentsCurrent(appointmentsCurrent.reverse()))
    dispatch(addAppointmentsPrevious(appointmentsPrevious))
    dispatch(addAppointmentsSchduled(appointmentsSchduled.reverse()))
    dispatch(addAppointmentsAll(appointments));
}

export const updateAppointments = (appointments) => dispatch => {

    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)

    var appointmentsCurrent = appointments.filter((appointment) => {
        return appointment.time.toDate() >= dayStart
    })

    var appointmentsPrevious = appointments.filter((appointment) => {
        return appointment.time.toDate() <= dayStart
    })

    var appointmentsSchduled = appointments.filter((appointment) => {
        return appointment.time.toDate() >= dayStart && (appointment.status == "accepted")
    })
    settlePreviousPendingAppointments(appointmentsPrevious);

    dispatch(updateAppointmentsCurrent(appointmentsCurrent))
    dispatch(updateAppointmentsPrevious(appointmentsPrevious))
    dispatch(updateAppointmentsSchduled(appointmentsSchduled.reverse()))
    dispatch(updateAppointmentsAll(appointments))
}

const settlePreviousPendingAppointments = (list) => {
    const filteredAppointments = list.filter(app => (app.status == 'pending'));
    if (filteredAppointments.length > 0) {
        const batchUpdate = firestore().batch();

        filteredAppointments.forEach(app => {
            const ref = firestore().collection('appointments').doc(app.id);
            batchUpdate.update(ref, {
                status: 'declined'
            })
        })

        batchUpdate.commit().then(() => {
            console.log("previous appointmnets setteled");
        })
            .catch(err => { console.log("unable to settel previous appointmnets ", err); });
    }
}

export const errorsAppointments = (err) => dispatch => {
    dispatch(errAppointmentsCurrent(err))
    dispatch(errAppointmentsPrevious(err))
    dispatch(errAppointmentsSchduled(err))
    dispatch(errAppointmentsAll(err))
}

const addAppointmentsAll = (apps) => ({
    type: ActionTypes.ADD_APPOINTMENTS,
    payload: apps
})

const addAppointmentsCurrent = (apps) => ({
    type: ActionTypes.ADD_CURRENT_APPOINTMENTS,
    payload: apps
})

const addAppointmentsPrevious = (apps) => ({
    type: ActionTypes.ADD_PREVIOUS_APPOINTMENTS,
    payload: apps
})

const addAppointmentsSchduled = (apps) => ({
    type: ActionTypes.ADD_SCHDULED_APPOINTMENTS,
    payload: apps
})

export const loadingAppointmentsAll = () => ({
    type: ActionTypes.LOADING_APPOINTMENTS,
})

export const loadingAppointmentsCurrent = () => ({
    type: ActionTypes.LOADING_CURRENT_APPOINTMENTS,
})

export const loadingAppointmentsPrevious = () => ({
    type: ActionTypes.LOADING_PREVIOUS_APPOINTMENTS,

})

export const loadingAppointmentsSchduled = () => ({
    type: ActionTypes.LOADING_SCHDULED_APPOINTMENTS,
})

const updateAppointmentsAll = (apps) => ({
    type: ActionTypes.UPDATE_APPOINTMENTS,
    payload: apps
})

const updateAppointmentsCurrent = (apps) => ({
    type: ActionTypes.UPDATE_CURRENT_APPOINTMENTS,
    payload: apps
})

const updateAppointmentsPrevious = (apps) => ({
    type: ActionTypes.UPDATE_PREVIOUS_APPOINTMENTS,
    payload: apps
})

const updateAppointmentsSchduled = (apps) => ({
    type: ActionTypes.UPDATE_SCHDULED_APPOINTMENTS,
    payload: apps
})

const errAppointmentsAll = (err) => ({
    type: ActionTypes.ERROR_APPOINTMENTS,
    payload: err
})

const errAppointmentsCurrent = (err) => ({
    type: ActionTypes.ERROR_CURRENT_APPOINTMENTS,
    payload: err
})

const errAppointmentsPrevious = (err) => ({
    type: ActionTypes.ERROR_PREVIOUS_APPOINTMENTS,
    payload: err
})

const errAppointmentsSchduled = (err) => ({
    type: ActionTypes.ERROR_SCHDULED_APPOINTMENTS,
    payload: err
})
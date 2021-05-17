import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StatusBar, BackHandler, ToastAndroid, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Card, Paragraph, RadioButton, Subheading, Title, Caption } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux';
import { Utility } from '../utility/utility';
import { HomeHeader } from '../utility/ViewUtility';
import { addAppointments, updateAppointments, errorsAppointments, loadingAppointmentsCurrent, loadingAppointmentsPrevious, loadingAppointmentsSchduled, loadingAppointmentsAll } from '../redux/ActionCreators';
import { useFocusEffect, NavigationAction } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import ComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import ConnectyCube from 'react-native-connectycube';
import { CallService } from '../Services/videoCalling/CallService';
import { EventRegister } from 'react-native-event-listeners';
import Spinner from 'react-native-spinkit';
import moment from 'moment';
import Fontisto from 'react-native-vector-icons/Fontisto';

const todayDate = new Date();

//redux
const mapStateToProps = state => {
    return {
        user: state.user,
        appointments: state.appointmentesPrevious,
    };
};

const mapDispatchToProps = (dispatch) => ({
    addAppointments: (apps) => dispatch(addAppointments(apps)),
    updateAppointments: (apps) => dispatch(updateAppointments(apps)),
    errorsAppointments: (err) => dispatch(errorsAppointments(err)),
    loadingAppointmentsCurrent: () => dispatch(loadingAppointmentsCurrent()),
    loadingAppointmentsPrevious: () => dispatch(loadingAppointmentsPrevious()),
    loadingAppointmentsSchduled: () => dispatch(loadingAppointmentsSchduled()),
    loadingAppointmentsAll: () => dispatch(loadingAppointmentsAll())
})

function Home(props) {

    //refs
    const animatedView = useRef(0);
    //states
    const userData = auth().currentUser.providerData;
    const [backCount, setBackCount] = useState(0);
    const [firstAppointmentFetch, setfirstAppointmentFetch] = useState(true)

    //lifecycle
    useEffect(() => {
        if (firstAppointmentFetch) {
            props.loadingAppointmentsCurrent();
            props.loadingAppointmentsPrevious();
            props.loadingAppointmentsSchduled();
        }

        setUpCallListeners();

        const logout = EventRegister.addEventListener('logout', () => {
            unsbscribeAppointments();
        })

        const unsbscribeAppointments = firestore().collection('appointments')
            .where('userId', '==', auth().currentUser.uid)
            .orderBy('time', 'desc')
            .onSnapshot(querySnapshot => {
                return Promise.all(querySnapshot.docs.map(async appointment => {
                    return {
                        id: appointment.id,
                        doctorData: await getDoctorData(appointment.data().doctorId),
                        ...appointment.data()
                    }
                }))
                    .then(list => {
                        if (firstAppointmentFetch) {
                            setfirstAppointmentFetch(false)
                            props.addAppointments(list)
                        }
                        else {
                            props.updateAppointments(list)
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        props.errorsAppointments(err.message);
                        ToastAndroid.show("Unable to fetch the appointment data.", ToastAndroid.LONG)
                    })

            },
                errors => {
                    props.errorsAppointments(errors.message);
                    console.log(errors);
                });

        return () => {
            unsbscribeAppointments();
            EventRegister.removeEventListener(logout)
        }
    }, []);

    useFocusEffect(

        useCallback(() => {
            // console.log(props.appointments.appointments);

            StatusBar.setBackgroundColor('#fff');
            animatedView.current.slideInUp(500);
            const backhandler = BackHandler.addEventListener("hardwareBackPress", () => {
                backCount === 0 ? ToastAndroid.show('Press back to exit', ToastAndroid.SHORT) : BackHandler.exitApp();
                setBackCount(1);
                setTimeout(() => { setBackCount(0) }, 3000)
                return true;
            })

            return () => {
                backhandler.remove();
            }
        }, [])
    );

    //methods

    const getDoctorData = (uid) => {
        return firestore().collection('doctors').doc(uid).get()
            .then(data => {
                return data.data();
            })
            .catch(err => {
                console.log(err);
            })
    }

    function setUpCallListeners() {
        ConnectyCube.videochat.onCallListener = (session, extension) => onIncomingCall(session, extension);
        ConnectyCube.videochat.onRemoteStreamListener = (session, userId, stream) => {
            //console.log("remote stream from home.");
            EventRegister.emit('onRemoteStreamListener', { session: session, userId: userId, stream: stream })
        };
        ConnectyCube.videochat.onAcceptCallListener = (session, userId, extension) => {
            console.log("CALLER ACCEPTED YOUR CALL");
            EventRegister.emit('onAcceptCallListener', { session: session, userId: userId, extension: extension })
        };
        ConnectyCube.videochat.onUserNotAnswerListener = (session, userId) => {
            console.log("user not answered listner");
            EventRegister.emit('onUserNotAnswerListener', { session: session, userId: userId })
        };

    }

    function onIncomingCall(session, extraData) {
        CallService.processOnCallListener(session)
            .then(() => {
                props.navigation.navigate("VideoCall", { type: 'incoming', dataIncoming: extraData, session: session })
            })
            .catch(err => {

            })
        // console.log("userId::",userId);
        // console.log("sessionId::",sessionId);
        //console.log("data::",extraData);

    }
    //component

    const CardView = ({ item, index }) => {

        var color;
        var time;
        var appointmentDate = new Date(item.time.toDate());
        const yesterday = new Date(Date.now() - 86400000);
        if (todayDate.getDate() === appointmentDate.getDate()) {
            var time = "Today " + moment(appointmentDate).format("hh:mm a");
        }
        else if (yesterday.getDate() === appointmentDate.getDate()) {
            var time = "Yesterday " + moment(appointmentDate).format("hh:mm a");
        }
        else if (todayDate.getFullYear() === appointmentDate.getFullYear()) {
            var time = moment(appointmentDate).format("Do MMM hh:mm a");
        }
        else {
            var time = moment(appointmentDate).format("DD/MM/YYYY hh:mm a");
        }

        if (item.status === "approved") {
            color = "#53D769";
        }
        else if (item.status === "declined") {
            color = "#FC3D39";
        }
        else if (item.status === 'pending') {
            color = "#FECB2E";
        }
        else {
            color = "#147efb";
        }

        return (
            <Animatable.View key={index.toString()} animation="slideInUp" duration={500} delay={100} useNativeDriver={true}>
                <Card style={styles.card} onPress={() => { props.navigation.navigate('AppointmentDetails', { data: item }) }} >
                    <Card.Content style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Fontisto name="doctor" size={30} style={{ margin: 5, marginRight: 10, alignSelf: "center" }} color="#147efb" />
                            <Title style={{ paddingVertical: 0, alignSelf: "center", marginVertical: 0, flex: 1 }}>{item.doctorData.name}</Title>

                        </View>
                        <Caption style={{ marginVertical: 0, padding: 0, textTransform: "capitalize" }}>{item.doctorId.specializations}</Caption>
                        <View style={{ width: '60%' }}>
                            <Paragraph numberOfLines={1} style={{ overflow: "hidden", }}>{item.problem}</Paragraph>
                        </View>
                        <Subheading style={styles.date}>{time}</Subheading>
                        <View style={styles.status}>
                            <Text style={{
                                textTransform: "uppercase", fontSize: 14
                                , fontWeight: "bold", alignSelf: 'center', color: color
                            }}>{item.status}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </Animatable.View>
        )
    }


    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <HomeHeader profilePic={props.user.user.profilePictureUrl} name={props.user.user.name} phoneNo={props.user.user.phoneNo} onPress={() => { props.navigation.navigate("Settings") }} />
                <ScrollView contentContainerStyle={{ paddingBottom: '15%' }}>
                    <Animatable.View animation="slideInUp" ref={ref => animatedView.current = ref} duration={500} useNativeDriver={true}>
                        {props.appointments.isLoading ?
                            <View style={{ height: 220, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Spinner
                                    type="Wave"
                                    color="#147efb"
                                    isVisible={true}
                                    size={50}
                                />
                            </View>
                            :
                            <Animatable.View animation="bounceIn" duration={600} useNativeDriver={true} style={{ backgroundColor: "#147efb", borderRadius: 20, elevation: 10, marginHorizontal: 15 }}>
                                <LottieView
                                    source={require('../assets/doctor_animation.json')}
                                    autoPlay={true}
                                    resizeMode="contain"
                                    loop={true}
                                    style={{ flex: 1, width: '100%', height: 200, alignSelf: 'center', }}
                                    speed={1.5}
                                />
                            </Animatable.View>
                            // props.appointments.appointments.length == 0 ?

                            //     <Animatable.View animation="bounceIn" duration={600} useNativeDriver={true} style={{ backgroundColor: "#147efb", borderRadius: 20, elevation: 10 }}>
                            //         <LottieView
                            //             source={require('../assets/doctor_animation.json')}
                            //             autoPlay={true}
                            //             resizeMode="contain"
                            //             loop={true}
                            //             style={{ flex: 1, width: '100%', height: 200, alignSelf: 'center', }}
                            //             speed={1.5}
                            //         />
                            //     </Animatable.View>
                            //     :
                            //     <View style={{ flex: 1 }}>
                            //         <Title style={{ fontSize: 17, marginLeft: 15, marginTop: 10 }}>Scheduled Appointments</Title>
                            //         <FlatList
                            //             data={props.appointments.appointments}
                            //             renderItem={CardView}
                            //             keyExtractor={(item, index) => index.toString()}
                            //             contentContainerStyle={{ paddingHorizontal: 20, marginTop: 10, paddingBottom: 10 }}
                            //             horizontal={true}
                            //             showsHorizontalScrollIndicator={false}
                            //             nestedScrollEnabled={true}
                            //             keyboardShouldPersistTaps='handled'
                            //         />
                            //     </View>
                        }

                        <View style={{ flex: 1, flexDirection: 'row', flexGrow: 1, flexWrap: 'wrap', marginTop: 20, justifyContent: "space-evenly", paddingHorizontal: 15, paddingBottom: 15 }}>
                            <TouchableOpacity style={styles.item} onPress={() => { }}>
                                <ComunityIcon name="hospital-building" size={35} style={{ alignSelf: 'center' }} />
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", alignSelf: "center", marginVertical: 5 }}>New OPD</Text>
                                <Paragraph style={{ textAlign: "center", alignSelf: 'center', fontSize: 12 }}>Book an OPD for any Hospital now.</Paragraph>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item} onPress={() => { props.navigation.navigate("NewAppointment") }} >
                                <ComunityIcon name="calendar-plus" size={40} style={{ alignSelf: 'center' }} />
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", alignSelf: "center", marginVertical: 5 }}>New Appointment</Text>
                                <Paragraph style={{ textAlign: "center", alignSelf: 'center', fontSize: 12 }}>Book an appointment with a Doctor.</Paragraph>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                                <ComunityIcon name="test-tube" size={40} style={{ alignSelf: 'center' }} />
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", alignSelf: "center", marginVertical: 5 }}>New Test</Text>
                                <Paragraph style={{ textAlign: "center", alignSelf: 'center', fontSize: 12 }}>Book a medical test.</Paragraph>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.item} onPress={() => { }}>
                                <Icon name="file-tray-full" size={40} style={{ alignSelf: 'center' }} />
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", alignSelf: "center", marginVertical: 5 }}>Previous Test Results</Text>
                                <Paragraph style={{ textAlign: "center", alignSelf: 'center', fontSize: 12 }}>View all your previous test results.</Paragraph>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate("MedicalRecords")}>
                                <ComunityIcon name="file-multiple" size={35} style={{ alignSelf: 'center' }} />
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", alignSelf: "center", marginVertical: 5 }}>Medical Records</Text>
                                <Paragraph style={{ textAlign: "center", alignSelf: 'center', fontSize: 12 }}>View your medical Records and Reports.</Paragraph>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('AllPrescription')}>
                                <ComunityIcon name="file-certificate-outline" size={45} style={{ alignSelf: 'center' }} />
                                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", alignSelf: "center", marginVertical: 5 }}>Prescriptions</Text>
                                <Paragraph style={{ textAlign: "center", alignSelf: 'center', fontSize: 12 }}>View all your smart prescriptions</Paragraph>
                            </TouchableOpacity>

                        </View>
                    </Animatable.View>
                </ScrollView>
                {/* <View style={styles.userInfo}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => }>
                        <Subheading style={{ fontWeight: 'bold', alignSelf: 'center' }}>{props.user.user.name}</Subheading>
                        {props.user.user.profilePictureUrl === '' ?
                            <Avatar.Image style={{ elevation: 2, alignSelf: 'center', marginLeft: 10 }} size={30} source={require('../assets/user_avatar.png')} />
                            :
                            <Avatar.Image style={{ elevation: 2, alignSelf: 'center', marginLeft: 10 }} size={30} source={{ uri: props.user.user.profilePictureUrl }} />
                        }
                    </TouchableOpacity>
                </View> */}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    userInfo: {
        flex: 1,
        position: 'absolute',
        top: 15,
        right: 15,
    },
    item: {
        backgroundColor: "#e3f2fd",
        width: '42%',
        height: '34%',
        margin: 10,
        justifyContent: 'center',
        borderRadius: 20,
        elevation: 10,
        padding: 10
    },
    card: {
        elevation: 2,
        borderRadius: 20,
        height: 200,
        width: 600,
        flex: 1
    },
    date: {
        backgroundColor: "#147efb",
        paddingHorizontal: 20,
        borderRadius: 25,
        paddingVertical: 8,
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
        color: '#fff',
        marginVertical: 10
    },
    status: {
        // position: 'absolute',
        // right: 15,
        // top: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 40,
        elevation: 6,
        paddingHorizontal: 10,
        height: 40,
        alignSelf: "center",
        justifyContent: "center",
        padding: 5
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
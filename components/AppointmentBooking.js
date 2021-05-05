import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Image, ToastAndroid } from 'react-native';
import { Headline, Paragraph, Button, Avatar, Caption, Subheading, TextInput, RadioButton, Modal, HelperText } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-spinkit';

const allDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const date14days = new Date();
date14days.setDate(date14days.getDate() + 14)

function AppointmentBooking(props) {
    //const
    const data = props.route.params.data;
    const address = data.address + ', ' + (data.city === '' ? '' : data.city + ', ') + (data.state === '' ? '' : data.state + ', ') + data.pincode + (data.landmark === '' ? '' : ', near ' + data.landmark);

    //refs

    //state
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [yourProblem, setyourProblem] = useState('');
    const [yourProblemError, setyourProblemError] = useState(false)
    const [appointmentMode, setappointmentMode] = useState('online');
    const [isSlotModalOpen, setisSlotModalOpen] = useState(false)
    const [selectedTimeSlot, setselectedTimeSlot] = useState(0)
    const [inBooking, setinBooking] = useState(false);
    const [booked, setbooked] = useState(false)
    const [bookedAppointmentId, setbookedAppointmentId] = useState('')

    //lifecycle
    useEffect(() => {
        // fetchSlotsForDate()
    }, [])
    //methods

    const bookAppointment = () => {
        if(data.schedule.days.includes(appointmentDate.getDay())){
            if(yourProblem.length===0 || yourProblem.length>240){
                setyourProblemError(true)
                return;
            }

            setinBooking(true)

            const appointmentData={
                dateCreated:firestore.Timestamp.now(),
                dateUpdated:firestore.Timestamp.now(),
                doctorId:data.doctorId,
                appointmentDocs:[],
                prescription:[],
                problem:yourProblem,
                status:'pending',
                time:firestore.Timestamp.fromDate(new Date(`${appointmentDate.toLocaleDateString()} ${data.schedule.slots[selectedTimeSlot].start.toDate().toLocaleTimeString()}`)),
                type:appointmentMode,
                userId:auth().currentUser.uid
            }

            firestore().collection('appointments').add(appointmentData)
            .then(value=>{
                setbookedAppointmentId(value.id);

                setinBooking(false);
                setbooked(true);
            })
            .catch(err=>{
                console.log(err);
                setinBooking(false)
                ToastAndroid.show("Unable to book appointment at the moment due to some err");
            })

        }
        else{
            ToastAndroid.show(`${data.name} is not available on ${allDays[appointmentDate.getDay()]}. See available days for booking.`,ToastAndroid.LONG)
        }
        
    }

    const fetchSlotsForDate = () => {
        const startTime = data.schedule.slots[0].start.toDate().toLocaleTimeString()
        const endTime = data.schedule.slots[0].end.toDate().toLocaleTimeString()

        const todayDate = new Date().toLocaleDateString();

        // console.log(new Date(`${todayDate} ${startTime}`));
        console.log(endTime);
        firestore().collection('appointments')
            .where('doctorId', '==', data.doctorId)
            .where('status', '==', 'accepted')
            .where('time', '>=', firestore.Timestamp.fromDate(new Date(`${todayDate} ${startTime}`)))
            .where('time', '<=', firestore.Timestamp.fromDate(new Date(`${todayDate} ${endTime}`)))
            .get()
            .then(queryData => {
                console.log(queryData.size)
            })
    }

    if (inBooking) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <Spinner
                    type="Wave"
                    color="#147efb"
                    style={{ alignSelf: "center" }}
                    isVisible={true}
                    size={70}
                />
                <Subheading style={{ color: '#147efb', alignSelf: "center", fontSize: 20, marginTop: 10 }}>Booking...</Subheading>
            </View>
        )
    }
    else if (booked) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView>
                    <Animatable.View style={{ flex: 1, padding: 15, }} animation="slideInUp" duration={500} useNativeDriver={true}>
                        <Animatable.View style={{ marginTop: 10, marginBottom: 15 }} animation="bounceIn" duration={600} delay={600} useNativeDriver={true}>
                            <Image source={require('../assets/tick.png')} style={{ alignSelf: 'center', width: 70, height: 70 }} resizeMode="contain" />
                            <Subheading style={{ alignSelf: 'center', color: "#0aa056", fontSize: 22, fontWeight: "bold", marginTop: 15 }}>Booking Confirmed</Subheading>
                        </Animatable.View>
                        <View style={{ display: "flex", flexDirection: 'row' }}>
                            {data.profilePictureUrl === '' ?
                                <Avatar.Image style={{ elevation: 2, alignSelf: 'flex-start', marginBottom: 5, marginTop: 0 }} size={80} source={require('../assets/user_avatar.png')} />
                                :
                                <Avatar.Image style={{ elevation: 2, alignSelf: 'flex-start', marginBottom: 5, marginTop: 0 }} size={80} source={{ uri: data.profilePictureUrl }} />
                            }
                            <View style={{ flex: 1, display: 'flex', justifyContent: "flex-start", alignItems: 'center', flexDirection: "column", marginLeft: 5 }}>
                                <Headline style={{ alignSelf: 'flex-start', fontWeight: "bold", paddingBottom: 0, marginBottom: 0 }}>{data.name}</Headline>
                                <Subheading style={styles.sep}>{data.specializations}</Subheading>
                            </View>
                        </View>
                        
                        <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Appointment ID</Subheading>
                        <View style={styles.textBox}><Paragraph style={{ color: '#757575', fontWeight: 'bold' }}>{bookedAppointmentId}</Paragraph></View>

                        <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Address</Subheading>

                        <View style={styles.address}>
                            <MaterialIcon name="location-on" size={20} color="#757575" />
                            <Paragraph style={{ color: '#757575' }} >{address}</Paragraph>
                        </View>
                        <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Date</Subheading>
                        <View style={styles.textBox}><Paragraph style={{ color: '#757575', fontWeight: 'bold' }}>{moment(appointmentDate).format('Do MMMM YYYY')}</Paragraph></View>
                        <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Time</Subheading>
                        <View style={styles.textBox}><Paragraph style={{ color: '#757575', fontWeight: 'bold' }}>{moment(data.schedule.slots[selectedTimeSlot].start.toDate()).format('hh:mm a')+" - "+moment(data.schedule.slots[selectedTimeSlot].end.toDate()).format('hh:mm a')}</Paragraph></View>
                        <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Mode</Subheading>
                        <View style={styles.textBox}><Paragraph style={{ color: '#757575', fontWeight: 'bold' }}>{appointmentMode}</Paragraph></View>
                        <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Issue</Subheading>
                        <View style={styles.textBox}><Paragraph style={{ color: '#757575' }}>{yourProblem}</Paragraph></View>
                    </Animatable.View>
                </ScrollView>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
            <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={100} keyboardShouldPersistTaps="handled">
                <Animatable.View style={{ flex: 1, padding: 15, }} animation="slideInDown" duration={500} useNativeDriver={true}>
                    <View style={{ display: "flex", flexDirection: 'row' }}>
                        {data.profilePictureUrl === '' ?
                            <Avatar.Image style={{ elevation: 2, alignSelf: 'flex-start', marginBottom: 5, marginTop: 0 }} size={80} source={require('../assets/user_avatar.png')} />
                            :
                            <Avatar.Image style={{ elevation: 2, alignSelf: 'flex-start', marginBottom: 5, marginTop: 0 }} size={80} source={{ uri: data.profilePictureUrl }} />
                        }
                        <View style={{ flex: 1, display: 'flex', justifyContent: "flex-start", alignItems: 'center', flexDirection: "column", marginLeft: 5 }}>
                            <Headline style={{ alignSelf: 'flex-start', fontWeight: "bold", paddingBottom: 0, marginBottom: 0 }}>{data.name}</Headline>
                            <Subheading style={styles.sep}>{data.specializations}</Subheading>
                        </View>
                    </View>
                    <View style={styles.address}>
                        <MaterialIcon name="location-on" size={20} color="#757575" />
                        <Paragraph style={{ color: '#757575' }} >{address}</Paragraph>
                    </View>
                </Animatable.View>
                <Animatable.View style={{ flex: 1, paddingHorizontal: 15 }} animation="slideInUp" duration={500} useNativeDriver={true}>
                    <Subheading style={{ fontWeight: "bold" }}>Select Date<Subheading style={{ color: 'red' }}></Subheading></Subheading>
                    <Button mode='outlined' style={{ justifyContent: 'center', borderRadius: 15 }} labelStyle={{ color: '#147efb' }} contentStyle={{ height: 45 }} color="#000" onPress={() => { setShowDatePicker(true) }}>{moment(appointmentDate).format('Do MMMM YYYY')}</Button>

                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Available Days & Slots<Subheading style={{ color: 'red' }}></Subheading></Subheading>
                    <View style={styles.days}>
                        {data.schedule.days.map(dayNo => {
                            return (
                                <View key={dayNo.toString()} style={{ flex: 1, justifyContent: 'center', padding: 10, }}>
                                    <Paragraph style={{ alignSelf: 'center', color: '#147efb', fontWeight: 'bold' }}>{allDays[dayNo]}</Paragraph>
                                </View>
                            )
                        })}
                    </View>
                    <Button mode='outlined' style={{ justifyContent: 'center', borderRadius: 15, marginTop: 10 }} labelStyle={{ color: '#147efb' }} contentStyle={{ height: 45 }} color="#000" onPress={() => { setisSlotModalOpen(true) }}>{moment(data.schedule.slots[selectedTimeSlot].start.toDate()).format('hh:mm a')+" - "+moment(data.schedule.slots[selectedTimeSlot].end.toDate()).format('hh:mm a')}</Button>

                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Mode Of Appointment<Subheading style={{ color: 'red' }}></Subheading></Subheading>
                    <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                        <TouchableOpacity style={appointmentMode === "online" ? styles.radioModeSelected : styles.radioModeUnselected} onPress={() => { if (appointmentMode === "online") { return } setappointmentMode("online") }}>
                            <Paragraph style={{ ...styles.radioText }}>Online</Paragraph>
                            {appointmentMode == "online" && <Avatar.Image style={styles.radioTick} size={25} source={require('../assets/tick.png')} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={appointmentMode === "offline" ? styles.radioModeSelected : styles.radioModeUnselected} onPress={() => { if (appointmentMode === "offline") { return } setappointmentMode("offline") }}>
                            <Paragraph style={{ ...styles.radioText }}>Offline</Paragraph>
                            {appointmentMode === "offline" && <Avatar.Image style={styles.radioTick} size={25} source={require('../assets/tick.png')} />}
                        </TouchableOpacity>
                    </View>
                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Your Problem in Brief<Subheading style={{ color: 'red' }}>*</Subheading><Caption>{"  " + yourProblem.length + "/240"}</Caption></Subheading>
                    <TextInput
                        mode="outlined"
                        value={yourProblem}
                        error={yourProblemError}
                        placeholder="Write Your problem here..."
                        style={{ backgroundColor: "#fff", maxHeight: 180 }}
                        theme={{ colors: { primary: "#147EFB" } }}
                        numberOfLines={6}
                        label="Problem"
                        multiline={true}
                        onChangeText={text => {
                            if (yourProblemError) {
                                setyourProblemError(false)
                            }
                            if (text.length <= 240) {
                                setyourProblem(text)
                            }
                            else {
                                setyourProblemError(true)
                            }
                        }}
                        onBlur={()=>{
                            if(yourProblem.length===0){
                                setyourProblemError(true)
                            }
                        }}
                    />
                    <HelperText type="error" visible={yourProblemError}>Problem can't be empty or more than 240 characters</HelperText>
                </Animatable.View>
                <View style={{ height: 68 }} />
            </KeyboardAwareScrollView>

            <Button mode="contained" style={styles.button} contentStyle={{ height: 48 }} color="#147EFB" onPress={() => { bookAppointment() }}>Confirm Appointment</Button>

            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={appointmentDate}
                    mode="date"
                    display='calendar'
                    onChange={(event, selectedDate) => {
                        if (event.type == 'set') {
                            setShowDatePicker(false);
                            setAppointmentDate(selectedDate);
                        }
                        else {
                            setShowDatePicker(false);
                            return;
                        }
                    }}
                    onTouchCancel={() => setShowDatePicker(false)}
                    minimumDate={new Date()}
                    maximumDate={date14days}
                />
            )}

            <Modal
                visible={isSlotModalOpen}
                onDismiss={() => {
                    setisSlotModalOpen(false)
                }}
                contentContainerStyle={styles.modal}
            >
                <Subheading style={{ fontSize: 20, fontWeight: "bold", alignSelf: 'center', marginBottom: 10 }}>Available Slots</Subheading>
                <ScrollView>
                    <RadioButton.Group value={selectedTimeSlot.toString()} onValueChange={value => { if (selectedTimeSlot === value) { return } setselectedTimeSlot(parseInt(value)) }}>
                        {data.schedule.slots.map((slot, index) => {
                            return (
                                <RadioButton.Item
                                    label={moment(slot.start.toDate()).format('hh:mm a')+" - "+moment(slot.end.toDate()).format('hh:mm a')}
                                    value={index.toString()}
                                    labelStyle={{ color: '#147efb', fontWeight: 'bold' }}
                                    uncheckedColor="#147efb"
                                    style={{ ...styles.slotAvailable, ...(selectedTimeSlot === index? { borderWidth: 1 } : { borderWidth: 0 }) }}
                                    mode="ios"
                                    key={index}
                                />
                            )
                        })
                        }

                        {/* <RadioButton.Item
                            label="4:30 PM - 6:30 PM"
                            value={2}
                            labelStyle={{ color: '#147efb', fontWeight: 'bold' }}
                            uncheckedColor="#147efb"
                            style={{ ...styles.slotAvailable, ...(selectedTimeSlot === 2 ? { borderWidth: 1 } : { borderWidth: 0 }) }}
                            mode="ios"
                        />
                        <RadioButton.Item
                            label="7:30 PM - 9:30 PM"
                            value={3}
                            labelStyle={{ color: '#147efb', fontWeight: 'bold' }}
                            uncheckedColor="#147efb"
                            style={{ ...styles.slotAvailable, ...(selectedTimeSlot === 3 ? { borderWidth: 1 } : { borderWidth: 0 }) }}
                            mode="ios"
                        /> */}
                    </RadioButton.Group>
                </ScrollView>
                <View style={{ marginTop: 10, display: "flex", justifyContent: 'flex-end', alignItems: "center", flexDirection: 'row' }}>
                    <Button style={{ marginRight: 5 }} onPress={() => setisSlotModalOpen(false)} theme={{ colors: { primary: '#147efb' } }}>CANCEL</Button>
                    <Button onPress={() => {setisSlotModalOpen(false) }} theme={{ colors: { primary: '#147efb' } }}>OK</Button>
                </View>
            </Modal>
        </View>
    )
}

export default AppointmentBooking;

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 10,
        left: 12,
        right: 12,
        justifyContent: 'center',
        borderRadius: 15,
        elevation: 5
    },
    sep: {
        alignSelf: 'flex-start',
        marginBottom: 7,
        textTransform: 'capitalize',
        fontSize: 18,
        color: "#147efb",
        marginTop: 0,
        paddingHorizontal: 20,
        paddingVertical: 2,
        backgroundColor: '#e3f2fd',
        justifyContent: "center",
        borderRadius: 20
    },
    address: {
        backgroundColor: '#eee',
        borderRadius: 20,
        padding: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        display: 'flex',
        flexDirection: "row",
    },
    days: {
        flexDirection: 'row',
        backgroundColor: '#e3f2fd',
        // borderWidth: 1,
        // borderColor: '#b6b6b6',
        borderRadius: 15
    },
    daysItem: {
        elevation: 2,
        backgroundColor: '#fff',
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#b6b6b6'
    },
    radioModeSelected: {
        margin: 3,
        backgroundColor: '#e3f2fd',
        borderRadius: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        borderColor: '#147efb',
        borderWidth: 2,
    },
    radioModeUnselected: {
        margin: 3,
        backgroundColor: '#e3f2fd',
        borderRadius: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioText: {
        marginVertical: 17,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#147efb'
    },
    radioTick: {
        position: "absolute",
        top: -8,
        right: -8
    },
    slotAvailable: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#e3f2fd",
        borderRadius: 15,
        margin: 5,
        display: 'flex',
        borderColor: '#147efb',
        borderWidth: 1
    },
    modal: {
        width: 330,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 10,
        padding: 10,
        display: 'flex',
        justifyContent: 'flex-start',
        maxHeight: '80%'
    },
    textBox: {
        backgroundColor: '#eee',
        borderRadius: 20,
        padding: 10,
        justifyContent: "flex-start",
    },
})
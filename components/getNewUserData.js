import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Image, ToastAndroid, Keyboard, BackHandler, Alert } from 'react-native';
import { Button, Headline, Paragraph, RadioButton, Subheading, TextInput, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import Spinner from 'react-native-spinkit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Utility } from '../utility/utility';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import { addUserDetails } from '../redux/ActionCreators';
import firestore from '@react-native-firebase/firestore';

//redux 
const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => ({
    addUserDetails: (uid, userData) => dispatch(addUserDetails(uid, userData)),
})

//component
function GetNewUserData(props) {

    const userAuthData = auth().currentUser;

    const [name, setName] = useState(userAuthData.providerData[0].displayName);
    const [email, setEmail] = useState(userAuthData.providerData[0].email);
    const [phoneNo, setPhoneNo] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState(new Date());
    const [address, setAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [pincode, setPincode] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [error4, setError4] = useState(false);
    const [loading, setLoading] = useState(false);
    const [backCount, setBackCount] = useState(0);

    //lifecycle

    useFocusEffect(
        useCallback(() => {
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

    //regex
    const onlyNo = /^[0-9]*$/;

    function getAge() {
        var today = new Date();
        var age = today.getFullYear() - dob.getFullYear();
        var m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    function completeRegistration() {

        if (phoneNo.length < 10 || phoneNo.length > 10) {
            setError1(true);
            ToastAndroid.show("Mobile no can't be less or more than 10 digits", ToastAndroid.LONG);
        }
        else if (!onlyNo.test(phoneNo)) {
            setError1(true)
            ToastAndroid.show("Mobile no can't have alphabets.", ToastAndroid.LONG);
        }
        else if (gender === '') {
            ToastAndroid.show("Please Fill in your gender to Continue", ToastAndroid.LONG);
        }
        else if (getAge() <= 13) {
            ToastAndroid.show("Minimum age to register is 14 years.", ToastAndroid.LONG);
        }
        else if (address.length < 10) {
            setError2(true)
            ToastAndroid.show("Address can\'t be less than 10 letters.", ToastAndroid.LONG);
        }
        else if (pincode.length < 6 || pincode.length > 6 || !onlyNo.test(pincode)) {
            setError3(true)
            ToastAndroid.show("Enter a correct Pincode", ToastAndroid.LONG);
        }
        else {
            setLoading(true);
            const utility = new Utility();
            utility.checkNetwork()
                .then(() => {

                    const userData = {
                        userId: userAuthData.uid,
                        email: email,
                        phoneNo: phoneNo.trim(),
                        name: name.trim(),
                        gender: gender,
                        dob: dob.toISOString(),
                        profilePictureUrl: "",
                        address: address.trim(),
                        landmark: landmark.trim(),
                        state: state.trim(),
                        city: city.trim(),
                        country: country.trim(),
                        pincode: pincode.trim(),
                        verificationType: "",
                        verificatonDocUrl: "",
                        //medicalHistory: [],
                        userCreateTimestamp:firestore.Timestamp.now()
                    }

                    props.addUserDetails(userAuthData.uid, userData)
                        .then(() => {
                            setLoading(false);
                            ToastAndroid.show("Registration Sucessfull", ToastAndroid.LONG);
                            props.navigation.navigate("SetProfilePic");
                        })
                        .catch((err) => {
                            Alert.alert("Unable to register right now please try again later.")
                            setLoading(false);
                        });
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
        }
        Keyboard.dismiss();

    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Animatable.View style={styles.container} animation="slideInUp" duration={700} useNativeDriver={true}>
                <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={100} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                    <Paragraph style={{ marginTop: 20 }}>Please fill the below information to complete your account registration.</Paragraph>
                    <Title style={{ fontWeight: 'bold' }}>Account Info</Title>
                    <TextInput
                        mode="outlined"
                        label="Full Name*"
                        value={name}
                        onChangeText={(text) => { setName(text); }}
                        placeholder="Full name"
                        style={{ backgroundColor: "#fff", marginTop: 10 }}
                        theme={{ colors: { primary: "#147EFB" } }}
                        left={<TextInput.Icon name="account" color="#147EFB" />}
                        editable={false}
                    />
                    <TextInput
                        mode="outlined"
                        label="Email Address*"
                        value={email}
                        onChangeText={(text) => { setEmail(text); }}
                        placeholder="example@some.com"
                        style={{ backgroundColor: "#fff", marginTop: 10 }}
                        theme={{ colors: { primary: "#147EFB" } }}
                        left={<TextInput.Icon name="email" color="#147EFB" />}
                        editable={false}
                    />

                    <Title style={{ fontWeight: 'bold', marginTop: 10 }}>Personal Info</Title>

                    <TextInput
                        mode="outlined"
                        label="Mobile Number*"
                        value={phoneNo}
                        onChangeText={(text) => {
                            if (error1) {
                                setError1(false);
                            }
                            setPhoneNo(text);
                        }}
                        onBlur={() => {
                            if (phoneNo.length < 10 || phoneNo.length > 10) {
                                setError1(true);
                                ToastAndroid.show("Mobile no can't be less or more than 10 digits", ToastAndroid.LONG);
                            }
                            if (!onlyNo.test(phoneNo)) {
                                setError1(true)
                                ToastAndroid.show("Mobile no can't have alphabets.", ToastAndroid.LONG);
                            }
                        }}
                        error={error1}
                        placeholder="Mobile Number here"
                        style={{ backgroundColor: "#fff", marginTop: 10 }}
                        theme={{ colors: { primary: "#147EFB" } }}
                        left={<TextInput.Icon name="phone" color="#147EFB" />}
                    />
                    <Subheading style={{ marginTop: 10, fontWeight: 'bold' }}>Gender</Subheading>
                    <View style={{ flexDirection: "row" }}>
                        <RadioButton.Group value={gender} onValueChange={(value) => setGender(value)}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Item
                                    label="Male"
                                    value="male"
                                    uncheckedColor="#000"
                                    color="#147efb"
                                    style={styles.radio}
                                />
                                <RadioButton.Item
                                    label="Female"
                                    value="female"
                                    uncheckedColor="#000"
                                    color="#147efb"
                                    style={styles.radio}
                                />
                                <RadioButton.Item
                                    label="Others"
                                    value="others"
                                    uncheckedColor="#000"
                                    color="#147efb"
                                    style={styles.radio}
                                />
                            </View>
                        </RadioButton.Group>
                    </View>

                    <Subheading style={{ marginTop: 10, fontWeight: 'bold' }}>DOB*</Subheading>
                    <Button mode='outlined' style={{ justifyContent: 'center' }} color="#000" onPress={() => { setShowDatePicker(true) }}>{moment(dob).format('Do MMMM YYYY')}</Button>

                    <Subheading style={{ marginTop: 10, fontWeight: 'bold' }}>Address</Subheading>
                    <TextInput
                        mode="outlined"
                        label="Address*"
                        value={address}
                        onChangeText={(text) => {
                            if (error2) {
                                setError2(false);
                            }
                            setAddress(text);
                        }}
                        onBlur={() => {
                            if (address.length < 10) {
                                setError2(true)
                                ToastAndroid.show("Address can\'t be less than 10 letters.", ToastAndroid.LONG);
                            }
                        }}
                        error={error2}
                        placeholder="House No./Street Name"
                        style={{ backgroundColor: "#fff", marginTop: 10 }}
                        theme={{ colors: { primary: "#147EFB" } }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Landmark"
                        value={landmark}
                        onChangeText={(text) => {
                            setLandmark(text);
                        }}
                        placeholder="Landmark near by(optional)"
                        style={{ backgroundColor: "#fff", marginTop: 10 }}
                        theme={{ colors: { primary: "#147EFB" } }}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            mode="outlined"
                            label="City"
                            value={city}
                            onChangeText={(text) => {
                                setCity(text);
                            }}
                            placeholder="Your city"
                            style={{ flex: 1, backgroundColor: "#fff", marginTop: 10, marginRight: 5 }}
                            theme={{ colors: { primary: "#147EFB" } }}
                        />
                        <TextInput
                            mode="outlined"
                            label="State"
                            value={state}
                            onChangeText={(text) => {
                                setState(text);
                            }}
                            placeholder="Your State"
                            style={{ flex: 1, backgroundColor: "#fff", marginTop: 10, marginLeft: 5 }}
                            theme={{ colors: { primary: "#147EFB" } }}
                        />
                    </View>
                    <TextInput
                        mode="outlined"
                        label="Country"
                        value={country}
                        onChangeText={(text) => {
                            setCountry(text);
                        }}
                        placeholder="Your Country"
                        style={{ flex: 1, backgroundColor: "#fff", marginTop: 10, }}
                        theme={{ colors: { primary: "#147EFB" } }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Area Pincode*"
                        value={pincode}
                        onChangeText={(text) => {
                            if (error3) {
                                setError3(false);
                            }
                            setPincode(text);
                        }}
                        error={error3}
                        onBlur={() => {
                            if (pincode.length < 6 || pincode.length > 6 || !onlyNo.test(pincode)) {
                                setError3(true)
                                ToastAndroid.show("Enter a correct Pincode", ToastAndroid.LONG);
                            }
                        }}
                        placeholder="Your Area Pincode"
                        style={{ flex: 1, backgroundColor: "#fff", marginTop: 10, }}
                        theme={{ colors: { primary: "#147EFB" } }}
                    />

                    {/* <Subheading style={{marginTop:10,fontWeight:'bold'}}>User verification</Subheading> */}
                    <View style={{ marginBottom: 70 }} />
                </KeyboardAwareScrollView>
            </Animatable.View>
            <Button mode="contained" loading={loading} style={styles.button} color="#147EFB" onPress={() => { completeRegistration() }}>Complete Registration</Button>
            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={dob}
                    mode="date"
                    display='calendar'
                    onChange={(event, selectedDate) => {
                        if (event.type == 'set') {
                            setShowDatePicker(false);
                            setDob(selectedDate);
                        }
                        else {
                            setShowDatePicker(false);
                            return;
                        }
                    }}
                    onTouchCancel={() => setShowDatePicker(false)}


                />
            )}
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    radio: {
        margin: 3,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1
    },
    button: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        height: 45,
        justifyContent: 'center'
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(GetNewUserData);
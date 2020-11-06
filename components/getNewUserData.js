import React,{useEffect, useState} from 'react';
import {View,StyleSheet,StatusBar,Image,ToastAndroid} from 'react-native';
import {Button, Headline, Paragraph, RadioButton, Subheading,TextInput, Title} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import Spinner from 'react-native-spinkit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default function GetNewUserData(props){
    
    const userData=auth().currentUser.providerData[0];

    const [name, setName] = useState(userData.displayName);
    const [email, setEmail] = useState(userData.email);
    const [password, setPassword] = useState('123456213');
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

    return(
        <View style={{flex:1,backgroundColor:"#fff"}}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Animatable.View style={styles.container} animation="slideInUp" duration={700} useNativeDriver={true}> 
                <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={100} showsVerticalScrollIndicator={false}>
                    <Paragraph style={{marginTop:20}}>Please fill the below information to complete your account registration.</Paragraph>
                    <Title style={{fontWeight:'bold'}}>Account Info</Title>
                    <TextInput
                        mode="outlined"
                        label="Full Name*"
                        value={name}
                        onChangeText={(text)=>{setName(text);}}
                        placeholder="Full name"
                        style={{backgroundColor:"#fff",marginTop:10}}
                        theme={{colors:{primary:"#147EFB"}}}
                        left={<TextInput.Icon name="account" color="#147EFB"/>}
                        editable={false}
                    />
                    <TextInput
                        mode="outlined"
                        label="Email Address*"
                        value={email}
                        onChangeText={(text)=>{setEmail(text);}}
                        placeholder="example@some.com"
                        style={{backgroundColor:"#fff",marginTop:10}}
                        theme={{colors:{primary:"#147EFB"}}}
                        left={<TextInput.Icon name="email" color="#147EFB"/>}
                        editable={false}
                    />
                    <TextInput
                        mode="outlined"
                        label="Password*"
                        value={password}
                        onChangeText={(text)=>{setPassword(text);}}
                        placeholder="Password"
                        style={{backgroundColor:"#fff",marginTop:10}}
                        theme={{colors:{primary:"#147EFB"}}}
                        left={<TextInput.Icon name="lock" color="#147EFB"/>}
                        //right={<TextInput.Icon name={showPass1 ? "eye" : "eye-off"} color="#147EFB" onPress={()=>setShowPass1(!showPass1)} />}
                        secureTextEntry={true}
                        editable={false}
                    />
                    
                    <Title style={{fontWeight:'bold',marginTop:10}}>Personal Info</Title>
                    
                    <TextInput
                        mode="outlined"
                        label="Mobile Number*"
                        value={phoneNo}
                        onChangeText={(text)=>{
                            if(error1){
                                setError1(false);
                            }
                            setPhoneNo(text);
                        }}
                        placeholder="Mobile Number here"
                        style={{backgroundColor:"#fff",marginTop:10}}
                        theme={{colors:{primary:"#147EFB"}}}
                        left={<TextInput.Icon name="phone" color="#147EFB"/>}
                    />
                    <Subheading style={{marginTop:10,fontWeight:'bold'}}>Gender</Subheading>
                    <View style={{flexDirection:"row"}}>
                        <RadioButton.Group value={gender} onValueChange={(value)=>setGender(value)}>
                            <View style={{flexDirection:'row'}}>
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
                    
                    <Subheading style={{marginTop:10,fontWeight:'bold'}}>DOB*</Subheading>
                    <Button mode='outlined' style={{justifyContent:'center'}} color="#000" onPress={()=>{setShowDatePicker(true)}}>{moment(dob).format('Do MMMM YYYY')}</Button>
                    
                    <Subheading style={{marginTop:10,fontWeight:'bold'}}>Address</Subheading>
                    <TextInput
                        mode="outlined"
                        label="Address*"
                        value={address}
                        onChangeText={(text)=>{
                            if(error1){
                                setError1(false);
                            }
                            setPhoneNo(text);
                        }}
                        placeholder="House No./Street Name"
                        style={{backgroundColor:"#fff",marginTop:10}}
                        theme={{colors:{primary:"#147EFB"}}}
                    />
                     <TextInput
                        mode="outlined"
                        label="Landmark"
                        value={landmark}
                        onChangeText={(text)=>{
                            if(error1){
                                setError1(false);
                            }
                            setPhoneNo(text);
                        }}
                        placeholder="Landmark near by(optional)"
                        style={{backgroundColor:"#fff",marginTop:10}}
                        theme={{colors:{primary:"#147EFB"}}}
                    />
                    <View style={{flexDirection:'row'}}>
                    <TextInput
                        mode="outlined"
                        label="City"
                        value={city}
                        onChangeText={(text)=>{
                            if(error1){
                                setError1(false);
                            }
                            setPhoneNo(text);
                        }}
                        placeholder="Your city"
                        style={{flex:1,backgroundColor:"#fff",marginTop:10,marginRight:5}}
                        theme={{colors:{primary:"#147EFB"}}}
                    />
                    <TextInput
                        mode="outlined"
                        label="State"
                        value={state}
                        onChangeText={(text)=>{
                            if(error1){
                                setError1(false);
                            }
                            setPhoneNo(text);
                        }}
                        placeholder="Your State"
                        style={{flex:1,backgroundColor:"#fff",marginTop:10,marginLeft:5}}
                        theme={{colors:{primary:"#147EFB"}}}
                    />
                    </View>
                    <TextInput
                        mode="outlined"
                        label="Country"
                        value={country}
                        onChangeText={(text)=>{
                            if(error1){
                                setError1(false);
                            }
                            setPhoneNo(text);
                        }}
                        placeholder="Your Country"
                        style={{flex:1,backgroundColor:"#fff",marginTop:10,}}
                        theme={{colors:{primary:"#147EFB"}}}
                    />
                    <TextInput
                        mode="outlined"
                        label="Area Pincode*"
                        value={pincode}
                        onChangeText={(text)=>{
                            if(error1){
                                setError1(false);
                            }
                            setPhoneNo(text);
                        }}
                        placeholder="Your Area Pincode"
                        style={{flex:1,backgroundColor:"#fff",marginTop:10,}}
                        theme={{colors:{primary:"#147EFB"}}}
                    />

                    <Subheading style={{marginTop:10,fontWeight:'bold'}}>User verification</Subheading>
                    <View style={{marginBottom:65}} />
                </KeyboardAwareScrollView>
            </Animatable.View>
            <Button mode="contained" loading={loading} style={styles.button} color="#147EFB" onPress={()=>{props.navigation.navigate("SetProfilePic")}}>Complete Registration</Button>
            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={dob}
                    mode="date"
                    display='calendar'
                    onChange={(event,selectedDate)=>{
                        if(event.type=='set'){
                            setShowDatePicker(false);
                            setDob(selectedDate);
                        }
                        else{
                            setShowDatePicker(false);
                            return;
                        }
                    }}
                    onTouchCancel={()=>setShowDatePicker(false)}
                    
                    
                />
            )}
         </View>

    )

} 

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        justifyContent:'center',
        paddingHorizontal:20
    },
    radio:{
        margin:3,
        backgroundColor:'#f2f2f2',
        borderRadius:10,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        elevation:1
    },
    button:{
        position:'absolute',
        bottom:10,
        left:20,
        right:20,
        height:45,
        justifyContent:'center'
    },
})
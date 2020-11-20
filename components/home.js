import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StatusBar, BackHandler, ToastAndroid, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Button, Headline, Paragraph, RadioButton, Subheading, TextInput, Title, } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { Utility } from '../utility/utility';
import {HomeHeader} from '../utility/ViewUtility';
import { } from '../redux/ActionCreators';
import { useFocusEffect ,NavigationAction} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import AntIcons from 'react-native-vector-icons/AntDesign';
import ComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';

//redux
const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => ({

})

function Home(props) {

    const userData = auth().currentUser.providerData;
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

    //methods

    //component

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar backgroundColor="#fff" barStyle='dark-content' />
                <HomeHeader profilePic={props.user.user.profilePictureUrl} name={props.user.user.name} phoneNo={props.user.user.phoneNo} onPress={()=>{props.navigation.navigate("Settings")}}/>
                <ScrollView contentContainerStyle={{paddingBottom:'15%'}}>
                    <Animatable.View animation="slideInUp" style={{ padding: 15 }} duration={500} delay={50} useNativeDriver={true}>
                        <View style={{backgroundColor:"#147efb",borderRadius:20,elevation:10}}>
                            <LottieView
                                source={require('../assets/doctor_animation.json')}
                                autoPlay={true}
                                resizeMode="contain"
                                loop={true}
                                style={{ flex: 1, width: '100%', height: 200, alignSelf: 'center',}}
                                speed={1.5}
                            />
                        </View>

                        <View style={{flex:1,flexDirection:'row',flexGrow:1,flexWrap:'wrap',marginTop:20,justifyContent:"space-evenly"}}>
                            <TouchableOpacity style={styles.item}>
                                <ComunityIcon name="hospital-building" size={35} style={{alignSelf:'center'}}/>
                                <Text style={{textAlign:"center",fontSize:18,fontWeight:"bold",alignSelf:"center",marginVertical:5}}>New OPD</Text>
                                <Paragraph style={{textAlign:"center",alignSelf:'center',fontSize:12}}>Book an OPD for any Hospital now.</Paragraph>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                                <ComunityIcon name="calendar-plus" size={40} style={{alignSelf:'center'}}/>
                                <Text style={{textAlign:"center",fontSize:18,fontWeight:"bold",alignSelf:"center",marginVertical:5}}>New Appointment</Text>
                                <Paragraph style={{textAlign:"center",alignSelf:'center',fontSize:12}}>Book an appointment with a Doctor.</Paragraph>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                                <ComunityIcon name="test-tube" size={40} style={{alignSelf:'center'}}/>
                                <Text style={{textAlign:"center",fontSize:18,fontWeight:"bold",alignSelf:"center",marginVertical:5}}>New Test</Text>
                                <Paragraph style={{textAlign:"center",alignSelf:'center',fontSize:12}}>Book a medical test.</Paragraph>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.item}>
                            <ComunityIcon name="file-multiple" size={35} style={{alignSelf:'center'}}/>
                                <Text style={{textAlign:"center",fontSize:18,fontWeight:"bold",alignSelf:"center",marginVertical:5}}>Medical Records</Text>
                                <Paragraph style={{textAlign:"center",alignSelf:'center',fontSize:12}}>View your medical records.</Paragraph>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.item} onPress={()=>props.navigation.navigate("Appointments")}>
                                <Icon name="file-tray-full" size={40} style={{alignSelf:'center'}}/>
                                <Text style={{textAlign:"center",fontSize:18,fontWeight:"bold",alignSelf:"center",marginVertical:5}}>Previous Appointments</Text>
                                <Paragraph style={{textAlign:"center",alignSelf:'center',fontSize:12}}>View all your previous Appointments.</Paragraph>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.item}>
                            <ComunityIcon name="file-certificate-outline" size={45} style={{alignSelf:'center'}}/>
                                <Text style={{textAlign:"center",fontSize:18,fontWeight:"bold",alignSelf:"center",marginVertical:5}}>Prescriptions</Text>
                                <Paragraph style={{textAlign:"center",alignSelf:'center',fontSize:12}}>View all your smart prescriptions</Paragraph>
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
    item:{
        backgroundColor:"#e3f2fd",
        width:'42%',
        height:'34%',
        margin:10,
        justifyContent:'center',
        borderRadius:20,
        elevation:10,
        padding:10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
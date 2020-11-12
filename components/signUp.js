import React,{useEffect, useState} from 'react';
import {View,StyleSheet,StatusBar,Image,ToastAndroid} from 'react-native';
import {Button, Headline, Subheading,TextInput} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import {Utility} from '../utility/utility';

export default function SignUp(props){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error1, setError1] = useState(false)
    const [error2, setError2] = useState(false)
    const [error3, setError3] = useState(false)
    const [error4, setError4] = useState(false)
    const [showPass1, setShowPass1] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [loading, setLoading] = useState(false);

    const handelSignUp=()=>{
        setLoading(true);
        const regexEmail=/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

        if(name.length < 4 || name.length > 20 ){
            setError3(true);
            ToastAndroid.show("Name must be minimum 4 and maximum 20 characters.",ToastAndroid.LONG);
            setLoading(false);
            return;
        }
        if(email===''){
            setError1(true);
            ToastAndroid.show("Email field can\'t be empty.",ToastAndroid.LONG);
            setLoading(false);
            return;
        }
        if(!regexEmail.test(email)){
            setError1(true);
            ToastAndroid.show("Invalid email address.",ToastAndroid.LONG);
            setLoading(false);
            return;
        }
        if(password.length < 4 || password.length > 14){
            setError2(true);
            ToastAndroid.show("Password must be minimum 4 and maximum 14 characters.",ToastAndroid.LONG);
            setLoading(false);
            return;
        } 
        if(password!==confirmPass){
            setError4(true);
            ToastAndroid.show("Re-enterd password doesn\'t match.",ToastAndroid.LONG);
            setLoading(false);
            return;
        }
        
        const utility=new Utility();
        utility.checkNetwork()
        .then(()=>{
            auth()
            .createUserWithEmailAndPassword(email,password)
            .then((user) => {
                
                user.user.updateProfile({
                    displayName:name,
                    photoURL:"user"
                })
                .then(user=>{
                    setLoading(false);
                    global.userAuthData=auth().currentUser;
                    props.navigation.navigate("emailVerification");
                })
                .catch(err=>{
                    setLoading(false);
                    console.log(err);
                })
                console.log('User account created & signed in!');
                console.log("User :",user.user.email);
                //props.navigation.navigate("home",{user:user.user.providerData});
            })
            .catch(error => {
                setLoading(false);
                if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                ToastAndroid.show("That email address is already in use!",ToastAndroid.LONG);
                }
    
                if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                ToastAndroid.show("That email address is invalid!",ToastAndroid.LONG);
                }
    
                
    
                console.log("error",error);
            });
        })
        .catch(err=>console.log(err))
        
    };

    return(
        <View style={styles.container} keyboardShouldPersistTaps={true}>
            <View style={styles.background} />
            <StatusBar backgroundColor="#147EFB" barStyle="light-content" />
            <View style={styles.con} >
                <Headline style={styles.heading}>Hello 👋 </Headline>
                <Subheading style={{color:'#fff'}}>Welocome to Pocket Doc a complete solution for your personal health.</Subheading>
                <Subheading style={{color:'#fff',fontWeight:'bold'}}>Register below to continue.</Subheading>
                <Animatable.View style={styles.card} animation="slideInUp" duration={700} delay={70} useNativeDriver={true}>
                    <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={58} style={{backgroundColor:"#fff"}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                        <Headline style={styles.loginText}>Register</Headline>
                        <TextInput
                            mode="outlined"
                            label="Full Name*"
                            value={name}
                            onChangeText={(text)=>{
                                if(error3){
                                    setError3(false);
                                }
                                setName(text);
                            }}
                            placeholder="Full name"
                            style={{backgroundColor:"#fff",marginTop:10}}
                            theme={{colors:{primary:"#147EFB"}}}
                            left={<TextInput.Icon name="account" color="#147EFB"/>}
                            error={error3}
                        />
                        <TextInput
                            mode="outlined"
                            label="Email Address*"
                            value={email}
                            onChangeText={(text)=>{
                                if(error1){
                                    setError1(false);
                                }
                                setEmail(text);
                            }}
                            placeholder="example@some.com"
                            style={{backgroundColor:"#fff",marginTop:10}}
                            theme={{colors:{primary:"#147EFB"}}}
                            left={<TextInput.Icon name="email" color="#147EFB"/>}
                            error={error1}
                            textContentType="emailAddress"
                        />
                        <TextInput
                            mode="outlined"
                            label="Password*"
                            value={password}
                            onChangeText={(text)=>{
                                if(error2){
                                    setError2(false);
                                }
                                setPassword(text);
                            }}
                            placeholder="Password"
                            style={{backgroundColor:"#fff",marginTop:10}}
                            theme={{colors:{primary:"#147EFB"}}}
                            left={<TextInput.Icon name="lock" color="#147EFB"/>}
                            right={<TextInput.Icon name={showPass1 ? "eye" : "eye-off"} color="#147EFB" onPress={()=>setShowPass1(!showPass1)} />}
                            secureTextEntry={!showPass1}
                            error={error2}
                            textContentType="password"
                        />
                        <TextInput
                            mode="outlined"
                            label="Re-enter Password*"
                            value={confirmPass}
                            onChangeText={(text)=>{
                                if(error4){
                                    setError4(false);
                                }
                                setConfirmPass(text);
                            }}
                            placeholder="Re-enter Password"
                            style={{backgroundColor:"#fff",marginTop:10}}
                            theme={{colors:{primary:"#147EFB"}}}
                            left={<TextInput.Icon name="lock" color="#147EFB"/>}
                            right={<TextInput.Icon name={showPass2 ? "eye" : "eye-off"} color="#147EFB" onPress={()=>setShowPass2(!showPass2)} />}
                            secureTextEntry={!showPass2}
                            error={error4}
                            textContentType="password"
                        />
                        <Button mode="contained" loading={loading} icon="account-plus" style={{marginTop:35}} color="#147EFB" onPress={()=>handelSignUp()}>Register</Button>
                    </KeyboardAwareScrollView>
                    {/*<View style={styles.loginButton}>
                        <IconButton
                            icon="arrow-right-circle"
                            color="#fff"
                            size={55}
                            style={{alignSelf:'center'}}
                            onPress={()=>console.log("hello")}
                        />
                    </View>*/}
                    
                </Animatable.View>
                <View style={styles.footer}>
                    <Subheading style={{alignSelf:"center",margin:10}} >Already have an account ?</Subheading>
                    <Button mode="text" style={{width:90,alignSelf:"center",marginBottom:10}} color="#147EFB" compact={true} onPress={()=>props.navigation.navigate("login")}>LOGIN</Button>
                    
                </View>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    card:{
        backgroundColor:"#fff",
        height:450,
        marginTop:20,
        elevation:10,
        borderRadius:10,
        zIndex:10,
        padding:10
    },
    con:{
        flex:1,
        padding:20
    },
    background:{
        position:'absolute',
        elevation:-10,
        zIndex:-10,
        backgroundColor:"#147EFB",
        top:0,
        left:0,
        right:0,
        width:"100%",
        height:300
    },
    heading:{
        color:"#fff",
        fontSize:30,
        marginTop:"2%",
        fontWeight:'bold'
    },
    loginText:{
        color:"#147EFB",
        alignSelf:'center',
        padding:5,
        fontWeight:'bold',
        borderColor:"#147EFB",
        borderBottomWidth:3
    },
    footer:{
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
    },
    loginButton:{
        position:'absolute',
        bottom:-40,
        width:100,
        height:100,
        alignSelf:'center',
        backgroundColor:'#147efb',
        borderWidth:4,
        borderColor:'#FFF',
        borderRadius:50,
        elevation:10,
        zIndex:10,
        justifyContent:'center'
    }
})
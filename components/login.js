import React,{useState} from 'react';
import {View,StyleSheet,StatusBar,Image} from 'react-native';
import {Button, Headline, Subheading,TextInput} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';

export default function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        <View style={styles.container} keyboardShouldPersistTaps={true}>
            <View style={styles.background} />
            <StatusBar backgroundColor="#147EFB" barStyle="light-content" />
            <View style={styles.con} >
                <Headline style={styles.heading}>Welcome to Pocket Doc!</Headline>
                <Subheading style={{color:'#fff'}}>Pocket Doc is a complete solution for ons's personal health.</Subheading>
                <Animatable.View style={styles.card} animation="slideInUp" duration={700} delay={100} useNativeDriver={true}>
                    <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={40} style={{backgroundColor:"#fff"}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                        <Image source={require('../assets/login_icon.png')} style={{width:120,height:120,resizeMode:"contain",alignSelf:'center'}} />
                        <Headline style={styles.loginText}>Login</Headline>
                        <TextInput
                            mode="outlined"
                            label="Email Address*"
                            value={email}
                            onChangeText={(text)=>setEmail(text)}
                            placeholder="example@some.com"
                            style={{backgroundColor:"#fff",marginTop:10}}
                            theme={{colors:{primary:"#147EFB"}}}
                            left={<TextInput.Icon name="account" color="#147EFB"/>}
                        />

                        <TextInput
                            mode="outlined"
                            label="Password*"
                            value={password}
                            onChangeText={(text)=>setPassword(text)}
                            placeholder="Password"
                            style={{backgroundColor:"#fff",marginTop:10}}
                            theme={{colors:{primary:"#147EFB"}}}
                            left={<TextInput.Icon name="lock" color="#147EFB"/>}
                            secureTextEntry={true}
                        />
                        <Button mode="text" style={{width:190,alignSelf:'center'}} color="#147EFB" compact={true} onPress={()=>console.log("forgot pass")}>Forgot Password?</Button>
                        <Button mode="contained" icon="login" style={{marginTop:35}} color="#147EFB" onPress={()=>console.log("Login")}>LOGIN</Button>
                    </KeyboardAwareScrollView>
                </Animatable.View>
                <View style={styles.footer}>
                    <Subheading style={{alignSelf:"center",margin:10}} >Don't have an account ?</Subheading>
                    <Button mode="text" style={{width:90,alignSelf:"center",marginBottom:10}} color="#147EFB" compact={true} onPress={()=>console.log("Sign Up")}>Sign Up</Button>
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
        elevation:14,
        borderRadius:10,
        zIndex:14,
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
        marginTop:"6%",
        fontWeight:'bold'
    },
    loginText:{
        color:"#147EFB",
        alignSelf:'center',
        padding:5,
        fontWeight:'bold'
    },
    footer:{
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
    }
})
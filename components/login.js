import React,{useState} from 'react';
import {View,StyleSheet,StatusBar,Image} from 'react-native';
import {Button, Headline, Subheading,TextInput,IconButton} from 'react-native-paper';
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
                <Headline style={styles.heading}>Welcome!!</Headline>
                <Subheading style={{color:'#fff'}}><Subheading style={{color:'#fff',fontWeight:'bold'}}>Pocket Doc </Subheading>is a complete solution for ons's personal health.</Subheading>
                <Animatable.View style={styles.card} animation="slideInUp" duration={700} delay={150} useNativeDriver={true}>
                    <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={57} style={{backgroundColor:"#fff"}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
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
                        <Button mode="contained" icon="arrow-right-circle" style={{marginTop:35}} color="#147EFB" onPress={()=>console.log("Login")}>LOGIN</Button>
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
        marginTop:"6%",
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
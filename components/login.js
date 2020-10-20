import React from 'react';
import {View,StyleSheet,StatusBar} from 'react-native';
import {Headline} from 'react-native-paper';

export default function Login(){
    return(
        <View style={styles.container} >
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Headline>Login</Headline>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
    }
})
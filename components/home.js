import React from 'react';
import {View,Text,StatusBar,Button} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Home(props){

    const userData=props.route.params.user;

    console.log(userData);

    return(
        <View>
            <StatusBar backgroundColor="#fff" barStyle='dark-content' />
            <Text>{"Name : "+userData[0].displayName}</Text>
            <Text>{"Email : "+userData[0].email}</Text>
            <Button title="Sign out" onPress={()=>{auth().signOut();props.navigation.navigate("login")}} />
        </View>
    )
}
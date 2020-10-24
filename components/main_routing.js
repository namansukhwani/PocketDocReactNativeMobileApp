import React from 'react';
import {} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {} from '@react-navigation/bottom-tabs';
import Login from './login';
import Home from './home';
import SignUp from './signUp';

const Stack=createStackNavigator();

export default function Main(){
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="login"
                    options={{
                        title:'Login',
                        headerTitleAlign:'center',
                        headerShown:false
                    }}
                    component={Login}
                />
                <Stack.Screen
                    name="signUp"
                    options={({route,navigation})=>({
                        title:"Home",
                        headerTitleAlign:'center',
                        headerShown:false
                    })}
                    component={SignUp}
                />
                <Stack.Screen
                    name="home"
                    options={({route,navigation})=>({
                        title:"Home",
                        headerTitleAlign:'center',
                    })}
                    component={Home}
                />
                
            </Stack.Navigator>
        </NavigationContainer>
    )
}
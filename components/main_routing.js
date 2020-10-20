import React from 'react';
import {} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {} from '@react-navigation/bottom-tabs';
import Login from './login';

const Stack=createStackNavigator();

export default function Main(){
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="login"
                    options={{
                        title:'Login',
                        headerTitleAlign:'center'
                    }}
                    component={Login}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
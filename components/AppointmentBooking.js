import React from 'react'
import {View,StatusBar} from 'react-native';
import { Headline, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function AppointmentBooking(props){
    //const
    const data = props.route.params.data;
    const address = data.address + ', ' + (data.city === '' ? '' : data.city + ', ') + (data.state === '' ? '' : data.state + ', ') + data.pincode + (data.landmark === '' ? '' : ', near ' + data.landmark);

    //refs

    //state

    //lifecycle

    //methods

    return(
        <View>
            <Headline>Booking Page</Headline>
            <Paragraph>{JSON.stringify(data)}</Paragraph>
        </View>
    )
}

export default AppointmentBooking;
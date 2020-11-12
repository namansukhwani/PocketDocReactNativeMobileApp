import React,{useState,useEffect,useCallback} from 'react';
import {View,Text,StatusBar, BackHandler, ToastAndroid,StyleSheet} from 'react-native';
import {Avatar, Button, Headline, Paragraph, RadioButton, Subheading,TextInput, Title,} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';
import {Utility} from '../utility/utility';
import {} from '../redux/ActionCreators';
import {useFocusEffect} from '@react-navigation/native';

//redux
const mapStateToProps=state =>{
    return{
        user:state.user
    };
};

const mapDispatchToProps=(dispatch) => ({

})

//component
function Appointments(props){
    return(
        <View>
            
        </View>
    )
}

//styles
const styles=StyleSheet.create({

});

export default connect(mapStateToProps,mapDispatchToProps)(Appointments);
import React,{useState,useEffect,useCallback} from 'react';
import {View,Text,StatusBar, BackHandler, ToastAndroid,} from 'react-native';
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

function Home(props){

    const userData=auth().currentUser.providerData;
    const [backCount, setBackCount] = useState(0);
    
    //lifecycle

    useFocusEffect(
        useCallback(() => {
            const backhandler=BackHandler.addEventListener("hardwareBackPress",()=>{
                backCount===0 ? ToastAndroid.show('Press back to exit',ToastAndroid.SHORT) : BackHandler.exitApp();
                setBackCount(1);
                setTimeout(()=>{setBackCount(0)},3000)
                return true;
            })

            return ()=>{
                backhandler.remove();
            }
        },[])
    );

    //methods
    //console.log(userData);


    //component

    return(
        <View style={{flex:1,backgroundColor:'#fff',justifyContent:"center"}}>
            <StatusBar backgroundColor="#fff" barStyle='dark-content' />
            
            <Text style={{alignSelf:'center',padding:10}}>{JSON.stringify( props.user.user)}</Text>
            
        </View>
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);
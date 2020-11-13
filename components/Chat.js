import React,{useState,useEffect,useCallback} from 'react';
import {View,Text,StatusBar, BackHandler, ToastAndroid,StyleSheet,TouchableOpacity} from 'react-native';
import {IconButton} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';
import {Utility} from '../utility/utility';
import {ChatHeader} from '../utility/ViewUtility';
import {GiftedChat,Send} from 'react-native-gifted-chat';
import {} from '../redux/ActionCreators';
import firestore from '@react-native-firebase/firestore';

//redux
const mapStateToProps=state =>{
    return{
        user:state.user
    };
};

const mapDispatchToProps=(dispatch) => ({

})


//component
function Chat(props){

    //values
    const [messages, setMessages] = useState([]);
    
    //lifecycles
    useEffect(() => {
        
        //getMessagesData();

        const unsubscribe=firestore().collection("chatRooms").doc(props.route.params.data.roomId).collection("messages")
        .orderBy('createdDate','desc')
        .onSnapshot(querySnapshot=>{
            const threads=querySnapshot.docChanges().map(documentSnapshot=>{
                const message=documentSnapshot.doc.data()
                return{
                    _id:documentSnapshot.doc.id,
                    text:message.body,
                    createdAt:message.createdDate.toDate(),
                    user:message.senderId===props.user.user.userId ? 
                        {
                            _id:message.senderId,
                            name:props.user.user.name,
                            avatar:props.user.user.profilePictureUrl
                        }
                        :
                        {
                            _id:message.senderId,
                            name:props.route.params.data.doctorName,
                            avatar:props.route.params.data.doctorProfilePicUrl
                        },
                    sent:true,
                    received:message.status
                    
                }
            })
            setMessages(messages=>GiftedChat.append(messages,threads)) 
            //setMessages(threads);
            console.log(threads);
        })

        

        // setMessages([
        //     {
        //       _id: 1,
        //       text: 'Hello developer',
        //       createdAt: new Date(),
        //       user: {
        //         _id: 2,
        //         name: 'React Native',
        //         avatar: 'https://placeimg.com/140/140/any',
        //       },
        //     },
        // ])
        
        return ()=>unsubscribe();
    }, [])

    //methods
    const onSend=useCallback((message=[])=>{
        const messageDic=message[0];

        //setMessages(messages=>GiftedChat.append(messages,message)) 
        firestore()
        .collection("chatRooms")
        .doc(props.route.params.data.roomId)
        .collection("messages")
        .add({
            body:messageDic.text,
            createdDate:firestore.Timestamp.fromDate(messageDic.createdAt),
            mediaUrl:'',
            senderId:props.user.user.userId,
            status:false,
            type:'text'
        })
        .then(res=>{
            console.log("message sent",res)
            
            firestore()
            .collection("chatRooms")
            .doc(props.route.params.data.roomId)
            .update({
                lastMessage:messageDic.text,
                lastUpdatedDate:firestore.Timestamp.fromDate(messageDic.createdAt)
            })
        })
        .catch(err=>console.log("message sent err"));
    },[])

    function getMessagesData(){
        firestore()
        .collection("chatRooms")
        .doc(props.route.params.data.roomId)
        .collection("messages")
        .orderBy('createdDate','desc')
        .get()
        .then(querySnapshot=>{
            const threads=querySnapshot.docs.map(documentSnapshot=>{
                return{
                    _id:documentSnapshot.id,
                    text:documentSnapshot.data().body,
                    createdAt:documentSnapshot.data().createdDate.toDate(),
                    user:documentSnapshot.data().senderId===props.user.user.userId ? 
                        {
                            _id:documentSnapshot.data().senderId,
                            name:props.user.user.name,
                            avatar:props.user.user.profilePictureUrl
                        }
                        :
                        {
                            _id:documentSnapshot.data().senderId,
                            name:props.route.params.data.doctorName,
                            avatar:props.route.params.data.doctorProfilePicUrl
                        }
                    
                    
                }
            })
            setMessages(threads);
            console.log(threads);
        })
    }

    function SendButton(props){
        return(
            <Send {...props}>
                <MaterialIcon name="send-circle" size={45} color="#147efb"/>
            </Send>
        )
    }

    function Attachments(){
        return(
            <MaterialIcon style={{marginLeft:5,alignSelf:'center'}} onPress={()=>console.log("attach")} name="attachment" size={40} color="#147efb"/>
        )
    }

    return(
        <View style={{flex:1,backgroundColor:'#fff'}}>
            <StatusBar backgroundColor="#fff" barStyle='dark-content' />
            <ChatHeader backAction={()=>{props.navigation.goBack()}} videoCall={()=>{}} title={props.route.params.data.doctorName} profilePicUrl={props.route.params.data.doctorProfilePicUrl} />
            <View style={{flex:1}}>
                <GiftedChat
                    messages={messages}
                    user={{
                        _id:props.user.user.userId,
                        name:props.user.user.name
                    }}
                    onSend={message=>onSend(message)}
                    renderAvatarOnTop={true}
                    scrollToBottom={true}
                    renderSend={(props)=>SendButton(props)}
                    renderActions={()=>Attachments()}
                />
            </View>
        </View>
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(Chat);
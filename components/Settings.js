import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StatusBar, BackHandler, ToastAndroid, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Button, Headline, Paragraph, List, Title, } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { Utility } from '../utility/utility';
import { } from '../redux/ActionCreators';
import { useFocusEffect } from '@react-navigation/native';
import ComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

//redux
const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => ({

})

//component 
function Settings(props) {
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#e3f2fd" barStyle="dark-content" translucent={false} />
            <ScrollView >
                <Animatable.View animation="slideInUp" style={{backgroundColor:'#e3f2fd'}} duration={500} delay={50} useNativeDriver={true}>
                    <View style={{ paddingHorizontal: 15, }}>
                        {props.user.user.profilePictureUrl === '' ?
                            <Avatar.Image style={{ elevation: 2, alignSelf: 'center', marginBottom: 15, marginTop: 10 }} size={130} source={require('../assets/user_avatar.png')} />
                            :
                            <Avatar.Image style={{ elevation: 2, alignSelf: 'center', marginBottom: 15, marginTop: 10 }} size={130} source={{ uri: props.user.user.profilePictureUrl }} />
                        }
                        <Headline style={{ alignSelf: 'center', fontWeight: "bold" }}>{props.user.user.name}</Headline>
                        <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                            <ComunityIcon style={{ alignSelf: 'center', marginRight: 3 }} name="email" size={20} color="#147efb" />
                            <Paragraph style={{ alignSelf: 'center' }}>{props.user.user.email}</Paragraph>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: 'center', marginBottom: 10 }}>
                            <ComunityIcon style={{ alignSelf: 'center', marginRight: 3 }} name="phone" size={20} color="#147efb" />
                            <Paragraph style={{ alignSelf: 'center' }}>{props.user.user.phoneNo}</Paragraph>
                        </View>
                        <LottieView
                            source={require('../assets/bubbles_animation.json')}
                            autoPlay={true}
                            resizeMode='contain'
                            loop={true}
                            style={{ flex: 1,zIndex:-10,position:'absolute',width:'100%',height:'100%',opacity:0.6}}
                            speed={0.5}
                        />
                    </View>

                    <View style={{ flex: 1, padding: 15, elevation: 6, backgroundColor: '#fff', borderTopRightRadius: 30, borderTopLeftRadius: 30 }}>
                        <List.Section>
                            <List.Item
                                onPress={() => { props.navigation.navigate("EditProfile") }}
                                style={styles.listItem}
                                title="Edit Profile"
                                right={() => <List.Icon icon="chevron-right-circle" color="#147efb" />}
                                left={() => <List.Icon icon="account" color="#147efb" />}
                            />
                            <List.Item
                                onPress={() => { props.navigation.navigate("ChangePassword") }}
                                style={styles.listItem}
                                title="Change Password"
                                right={() => <List.Icon icon="chevron-right-circle" color="#147efb" />}
                                left={() => <List.Icon icon="lock-open-check" color="#147efb" />}
                            />
                            <List.Item
                                onPress={() => { props.navigation.navigate("ChangeEmail") }}
                                style={styles.listItem}
                                title="Change Email"
                                right={() => <List.Icon icon="chevron-right-circle" color="#147efb" />}
                                left={() => <List.Icon icon="at" color="#147efb" />}
                            />
                            <List.Item
                                onPress={() => { }}
                                style={styles.listItem}
                                title="Medical History"
                                right={() => <List.Icon icon="chevron-right-circle" color="#147efb" />}
                                left={() => <List.Icon icon="medical-bag" color="#147efb" />}
                            />
                            <List.Item
                                onPress={() => { }}
                                style={styles.listItem}
                                title="Payment Options"
                                right={() => <List.Icon icon="chevron-right-circle" color="#147efb" />}
                                left={() => <List.Icon icon="credit-card-settings-outline" color="#147efb" />}
                            />

                        </List.Section>

                        <Button mode="contained" color="#147efb" style={{ marginTop: 15 }} onPress={() => { auth().signOut(); props.navigation.navigate("login") }} >logout</Button>
                    </View>
                </Animatable.View>
            </ScrollView>
        </View>
    )
}

//styles
const styles = StyleSheet.create({
    listItem: {
        elevation: 2,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 0,
        marginBottom: 12
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
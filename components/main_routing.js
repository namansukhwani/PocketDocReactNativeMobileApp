import React, { useEffect } from 'react';
import { Alert, TouchableOpacity, ToastAndroid, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators, } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from './login';
import Home from './home';
import SignUp from './signUp';
import ForgotPassword from './forgotPassword';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import GetNewUserData from './getNewUserData';
import EmailVerification from './emailVerification';
import auth from '@react-native-firebase/auth';
import SetProfilePic from './SetProfilePic';
import AllChats from './AllChats';
import Chat from './Chat';
import AppointmentsCurrent from './AppointmentsCurrent';
import Settings from './Settings';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';
import OPDsCurrent from './OPDsCurrent';
import OPDsPrevious from './OPDsPrevious';
import AppointmentsPrevious from './AppointmentsPrevious';
import { HeaderTitle } from '../utility/ViewUtility';
import VideoCall from './VideoCall';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function TopTabLable(focused, color, title) {
    return (
        <View style={{ ...styles.topTabLable, backgroundColor: (!focused ? "#fff" : "#147efb"), }}>
            <Text style={{ fontSize: 15, textTransform: 'uppercase', color: (focused ? "#fff" : "#147efb") }}>{title}</Text>
        </View>
    )
}

function OPDsTab(props) {
    return (
        <>
            <HeaderTitle title="OPD" />
            <TopTab.Navigator
                tabBarOptions={{
                    style: styles.topTabBar,
                    tabStyle: styles.topTab,
                    renderIndicator: () => null,
                    activeTintColor: "#147efb",
                    inactiveTintColor: '#fff',
                }}
                sceneContainerStyle={{ backgroundColor: '#fff' }}
                backBehavior="none"
                keyboardDismissMode="auto"
                style={{ backgroundColor: '#fff' }}
            >
                <TopTab.Screen
                    name="OPDsCurrent"
                    component={OPDsCurrent}
                    options={{
                        tabBarLabel: ({ focused, color }) => TopTabLable(focused, color, "CURRENT"),
                    }}
                />
                <TopTab.Screen
                    name="OPDsPrevious"
                    component={OPDsPrevious}
                    options={{
                        tabBarLabel: ({ focused, color }) => TopTabLable(focused, color, "previous"),
                    }}
                />
            </TopTab.Navigator>
        </>
    )
}

function AppointmentsTab(props) {

    const initialRouteName = "AppointmentsCurrent";

    return (
        <>
            <HeaderTitle title="Appointments" />
            <TopTab.Navigator
                tabBarOptions={{
                    style: styles.topTabBar,
                    tabStyle: styles.topTab,
                    renderIndicator: () => null,
                    activeTintColor: "#147efb",
                    inactiveTintColor: '#fff',
                }}
                sceneContainerStyle={{ backgroundColor: '#fff' }}
                backBehavior="none"
                keyboardDismissMode="auto"
                style={{ backgroundColor: '#fff' }}
                initialRouteName={initialRouteName}
            >
                <TopTab.Screen
                    name="AppointmentsCurrent"
                    component={AppointmentsCurrent}
                    options={{
                        tabBarLabel: ({ focused, color }) => TopTabLable(focused, color, "CURRENT"),
                    }}
                />
                <TopTab.Screen
                    name="AppointmentsPrevious"
                    component={AppointmentsPrevious}
                    options={{
                        tabBarLabel: ({ focused, color }) => TopTabLable(focused, color, "previous"),
                    }}
                />
            </TopTab.Navigator>
        </>
    )
}

function BottomDrawer(props) {

    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#147efb',
                keyboardHidesTabBar: true,

            }}
            screenOptions={{
                unmountOnBlur: false
            }}
            initialRouteName="userHome"
        >
            <Tab.Screen
                name="userHome"
                component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => <AntIcon name="home" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Appointments"
                component={AppointmentsTab}
                options={({ route, navigation }) => ({
                    tabBarLabel: 'Appointments',
                    tabBarIcon: ({ color, size }) => <ComunityIcon name="calendar-multiple-check" color={color} size={size} />,
                })}
            />
            <Tab.Screen
                name="OPDs"
                component={OPDsTab}
                options={({ route, navigation }) => ({
                    tabBarLabel: 'OPDs',
                    tabBarIcon: ({ color, size }) => <ComunityIcon name="hospital-building" color={color} size={size} />,
                })}
            />
            <Tab.Screen
                name="AllChats"
                component={AllChats}
                options={({ route, navigation }) => ({
                    tabBarLabel: 'Chats',
                    tabBarIcon: ({ color, size }) => <MaterialIcon name="chat" color={color} size={size} />,
                })}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={({ route, navigation }) => ({
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => <MaterialIcon name="settings" color={color} size={size} />,
                })}
            />
        </Tab.Navigator>
    )
}

export default function Main() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="login" screenOptions={{ detachPreviousScreen: true }}>
                <Stack.Screen
                    name="login"
                    options={{
                        title: 'Login',
                        headerTitleAlign: 'center',
                        headerShown: false
                    }}
                    component={Login}
                />
                <Stack.Screen
                    name="signUp"
                    options={({ route, navigation }) => ({
                        title: "Home",
                        headerTitleAlign: 'center',
                        headerShown: false
                    })}
                    component={SignUp}
                />
                <Stack.Screen
                    name="getNewUserData"
                    options={({ route, navigation }) => ({
                        //headerShown:false,
                        headerTitle: 'User Information',
                        //headerTransparent:true,

                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} onPress={() => navigation.goBack()}>
                                <Icon
                                    name="chevron-back"
                                    size={30}
                                    onPress={() => {
                                        Alert.alert(
                                            "Go Back",
                                            "Are you sure you want to sign out.",
                                            [
                                                {
                                                    text: "Cancel", style: "cancel"
                                                },
                                                { text: "GO BACK", onPress: () => { auth().signOut().then(() => console.log("singed out")).catch(err => console.log(err)); navigation.goBack() } }
                                            ],
                                            { cancelable: false });
                                        //ToastAndroid.show("You can verify your mail anytime.")
                                    }}
                                />
                            </TouchableOpacity>
                        ),
                    })}
                    component={GetNewUserData}
                />
                <Stack.Screen
                    name="emailVerification"
                    options={({ route, navigation }) => ({
                        //headerShown:false,
                        headerTitle: 'Verification',
                        headerTransparent: true,
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} onPress={() => navigation.goBack()}>
                                <Icon
                                    name="chevron-back"
                                    size={30}
                                    onPress={() => {
                                        Alert.alert(
                                            "Go Back",
                                            "Are you sure you want to sign out.",
                                            [
                                                {
                                                    text: "Cancel", style: "cancel"
                                                },
                                                { text: "GO BACK", onPress: () => { auth().signOut().then(() => console.log("singed out")).catch(err => console.log(err)); navigation.goBack() } }
                                            ],
                                            { cancelable: false });
                                        //ToastAndroid.show("You can verify your mail anytime.")
                                    }}
                                />
                            </TouchableOpacity>
                        ),
                    })}
                    component={EmailVerification}
                />
                <Stack.Screen
                    name="SetProfilePic"
                    options={({ route, navigation }) => ({
                        headerTitle: 'Profile Picture',
                        headerTitleAlign: 'center',
                        headerLeft: () => (null),
                        headerStyle: {
                            elevation: 0
                        }
                    })}
                    component={SetProfilePic}
                />
                <Stack.Screen
                    name="forgotPassword"
                    options={({ route, navigation }) => ({
                        headerTitle: '',
                        headerTransparent: true,
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} onPress={() => navigation.goBack()}>
                                <Icon name="chevron-back" size={30} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>
                        ),
                    })}
                    component={ForgotPassword}
                />


                <Stack.Screen
                    name="home"
                    options={({ route, navigation }) => ({
                        headerShown: false
                    })}
                    component={BottomDrawer}
                />


                <Stack.Screen
                    name="Chat"
                    options={({ route, navigation }) => ({
                        headerShown: false
                    })}
                    component={Chat}
                />

                <Stack.Screen
                    name="EditProfile"
                    options={({ route, navigation }) => ({
                        headerTitle: 'Edit Profile',
                        headerTitleAlign: 'center',
                        headerStyle: { elevation: 0, height: 45, },
                        headerLeft: () => (
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} onPress={() => navigation.goBack()}>
                                <Icon name="chevron-down-outline" size={35} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>
                        ),
                        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
                    })}
                    component={EditProfile}
                />

                <Stack.Screen
                    name="ChangePassword"
                    options={({ route, navigation }) => ({
                        headerTitle: 'Change Password',
                        headerTitleAlign: 'center',
                        headerStyle: { elevation: 0, height: 45, },
                        headerLeft: () => (
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} onPress={() => navigation.goBack()}>
                                <Icon name="chevron-down-outline" size={35} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>
                        ),
                        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
                    })}
                    component={ChangePassword}
                />

                <Stack.Screen
                    name="ChangeEmail"
                    options={({ route, navigation }) => ({
                        headerTitle: 'Change Email',
                        headerTitleAlign: 'center',
                        headerStyle: { elevation: 0, height: 45, },
                        headerLeft: () => (
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} onPress={() => navigation.goBack()}>
                                <Icon name="chevron-down-outline" size={35} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>
                        ),
                        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
                    })}
                    component={ChangeEmail}
                />

                <Stack.Screen
                    name="VideoCall"
                    options={({ route, navigation }) => ({
                        headerShown: false
                    })}
                    component={VideoCall}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    topTabBar: {
        margin: 10,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#147efb',
        padding: 0,
    },
    topTabLable: {
        flex: 1,
        height: 33,
        borderRadius: 16.5,
        justifyContent: "center",
        alignItems: "center",
    },
    topTab: {
        padding: 0,
        borderRadius: 25,
        justifyContent: "space-between",
        alignItems: 'stretch'
    }
})
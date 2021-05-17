import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Dimensions, StatusBar, BackHandler, ToastAndroid, StyleSheet, FlatList, Animated } from 'react-native';
import { Avatar, Button, Headline, Paragraph, RadioButton, FAB, Subheading, TextInput, Title, Card, Caption } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { Utility } from '../utility/utility';
import { } from '../redux/ActionCreators';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Spinner from 'react-native-spinkit';
import ComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const height = Dimensions.get('screen').height;
const todayDate = new Date();

//redux
const mapStateToProps = state => {
    return {
        user: state.user,
        appointments: state.appointmentesCurrent,
    };
};

const mapDispatchToProps = (dispatch) => ({

})

//component
function AppointmentsCurrent(props) {

    //ref

    //Animated 
    const scrollY = new Animated.Value(0);
    const diffClapScrollY = Animated.diffClamp(scrollY, 0, 100);
    const FabY = diffClapScrollY.interpolate({
        inputRange: [0, height - 35],
        outputRange: [0, height + 35],
    })

    //states

    //lifecycles
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('#fff');
        }, [])
    )

    useEffect(() => {

        // console.log(props.appointments.appointments);

    }, []);

    //methods

    const CardView = ({ item, index }) => {

        var color;
        var time;
        var appointmentDate = new Date(item.time.toDate());
        const yesterday = new Date(Date.now() - 86400000);
        if (todayDate.getDate() === appointmentDate.getDate()) {
            var time = "Today " + moment(appointmentDate).format("hh:mm a");
        }
        else if (yesterday.getDate() === appointmentDate.getDate()) {
            var time = "Yesterday " + moment(appointmentDate).format("hh:mm a");
        }
        else if (todayDate.getFullYear() === appointmentDate.getFullYear()) {
            var time = moment(appointmentDate).format("Do MMM hh:mm a");
        }
        else {
            var time = moment(appointmentDate).format("DD/MM/YYYY hh:mm a");
        }

        if (item.status === "approved") {
            color = "#53D769";
        }
        else if (item.status === "declined") {
            color = "#FC3D39";
        }
        else if (item.status === 'pending') {
            color = "#FECB2E";
        }
        else {
            color = "#147efb";
        }

        return (
            <Animatable.View key={index.toString()} animation="slideInUp" style={{ marginBottom: 10 }} duration={500} delay={100} useNativeDriver={true}>
                <Card style={styles.card} onPress={() => { props.navigation.navigate('AppointmentDetails', { data: item }) }} >
                    <Card.Content style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Fontisto name="doctor" size={30} style={{ margin: 5, marginRight: 10, alignSelf: "center" }} color="#147efb" />
                            <Title style={{ paddingVertical: 0, alignSelf: "center", marginVertical: 0, flex: 1 }}>{item.doctorData.name}</Title>

                        </View>
                        <Caption style={{ marginVertical: 0, padding: 0, textTransform: "capitalize" }}>{item.doctorId.specializations}</Caption>
                        <View style={{ width: '60%' }}>
                            <Paragraph numberOfLines={1} style={{ overflow: "hidden", }}>{item.problem}</Paragraph>
                        </View>
                        <Subheading style={styles.date}>{time}</Subheading>
                        <View style={styles.status}>
                            <Text style={{
                                textTransform: "uppercase", fontSize: 14
                                , fontWeight: "bold", alignSelf: 'center', color: color
                            }}>{item.status}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </Animatable.View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", }}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {props.appointments.isLoading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner
                        type="Wave"
                        color="#147efb"
                        isVisible={true}
                        size={50}
                    />
                </View>
                :
                (props.appointments.appointments.length === 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ComunityIcon name='calendar-alert' size={80} color="#147efb" />
                        <Subheading style={{}}>No Current Appointments.</Subheading>
                    </View>
                    :
                    <>
                        <Animated.FlatList
                            data={props.appointments.appointments}
                            renderItem={CardView}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingHorizontal: 15, marginTop: 10, paddingBottom: 24 }}
                            onScroll={Animated.event([
                                {
                                    nativeEvent: { contentOffset: { y: scrollY } }
                                }
                            ], { useNativeDriver: true })}
                            scrollEventThrottle={16}
                            alwaysBounceVertical={false}
                        />
                        <FAB
                            label="filters"
                            icon='filter-plus'
                            small={true}
                            style={{ ...styles.fab, transform: [{ translateY: FabY }] }}
                            onPress={() => console.log("Filters")}
                            color="#147efb"
                            animated={true}

                        />
                    </>
                )
            }



        </View>
    )
}

//styles
const styles = StyleSheet.create({
    card: {
        elevation: 3,
        borderRadius: 10,
    },
    date: {
        backgroundColor: "#147efb",
        paddingHorizontal: 20,
        borderRadius: 25,
        paddingVertical: 8,
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
        color: '#fff',
        marginVertical: 10
    },
    status: {
        position: 'absolute',
        right: 15,
        top: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 40,
        elevation: 6,
        paddingHorizontal: 10,
        height: 40,
        alignSelf: "center",
        justifyContent: "center",
        padding: 5
    },
    fab: {
        position: 'absolute',
        alignSelf: "center",
        bottom: 5,
        backgroundColor: "#fff",
        elevation: 10,
        borderWidth: 2,
        borderColor: '#147efb'
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentsCurrent);
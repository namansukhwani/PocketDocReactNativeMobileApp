import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StatusBar, Dimensions, BackHandler, ToastAndroid, StyleSheet, Animated } from 'react-native';
import { Avatar, Button, Headline, Paragraph, RadioButton, Subheading, TextInput, Title, Card, Caption, FAB } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { Utility } from '../utility/utility';
import { } from '../redux/ActionCreators';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const height = Dimensions.get('screen').height;

const DATA = [
    {
        name: "Chirayu Health and Medicare Pvt. Ltd.",
        add: '6, Hawa Mahal Road, Peergate, Opposite Nirmal Meera School, Near Sadar Manzil Malipura, Bhopal - 462001',
        dep: 'UROLOGY',
        status: "pending",
        date: new Date()
    },
    {
        name: "Shekhar Hospital",
        add: 'A/69, Near Manisha Market Shahapura, Bhopal - 462011',
        dep: 'ORTHOLOGY',
        status: "approved",
        date: new Date("09/20/2019 02:45 PM")
    },
    {
        name: "Akshaya Heart and ulti Speciality Hospital",
        add: '11, Link Road No 3, Opposite Ekanth Park, Rishi Nagar Char Imli, Bhopal - 462016',
        dep: 'MEDCINE',
        status: "declined",
        date: new Date("11/18/2020 05:00 pm")
    },
    {
        name: "Venus Hospital and Medical Research Center",
        add: 'Berasia Road, Pipal Chauraha Karond, Bhopal - 462038',
        dep: 'RADIOLOGY',
        status: "approved",
        date: new Date("11/25/2020 05:00 pm")
    },
    {
        name: "Noble Multispeciality Hospital",
        add: 'Plot No. 269/1 Opp. Misrod Police Station Misrod, Bhopal - 462026',
        dep: 'UROLOGY',
        status: "approved",
        date: new Date("09/20/2019 02:45 PM")
    },
    {
        name: "Akshaya Heart and ulti Speciality Hospital",
        add: '11, Link Road No 3, Opposite Ekanth Park, Rishi Nagar Char Imli, Bhopal - 462016',
        dep: 'MEDCINE',
        status: "declined",
        date: new Date("11/18/2020 05:00 pm")
    },
    {
        name: "Chirayu Health and Medicare Pvt. Ltd.",
        add: '6, Hawa Mahal Road, Peergate, Opposite Nirmal Meera School, Near Sadar Manzil Malipura, Bhopal - 462001',
        dep: 'UROLOGY',
        status: "pending",
        date: new Date("09/20/2019 02:45 PM")
    },
]

//redux
const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => ({

})

//component
function OPDsCurrent(props) {

    //Animated 
    const scrollY = new Animated.Value(0);
    const diffClapScrollY = Animated.diffClamp(scrollY, 0, 100);
    const FabY = diffClapScrollY.interpolate({
        inputRange: [0, height - 35],
        outputRange: [0, height + 35],
    })

    //refs


    //states
    const todayDate = new Date();

    //lifecycle
    //useEffect()
    useFocusEffect(
        useCallback(() => {
        StatusBar.setBackgroundColor('#fff');
    },[])
    )

    //methods

    const CardView = ({ item, index }) => {

        var color;
        var time;
        var appointmentDate = new Date(item.date);
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
            <Animatable.View animation="slideInUp" style={{ marginBottom: 10 }} duration={500} delay={50} useNativeDriver={true}>
                <Card style={styles.card} onPress={() => { console.log("hello"); }}>
                    <Card.Content style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                            <FontAwesome name="hospital" size={38} style={{ margin: 5, marginRight: 10, alignSelf: "center" }} color="#147efb" />
                            <Title style={{ paddingVertical: 0, alignSelf: "center", marginVertical: 0, flex: 1 }}>{item.name}</Title>
                        </View>
                        <View style={{ width: '100%' }}>
                            <Caption numberOfLines={1} style={{ overflow: "hidden", }}>{item.add}</Caption>
                        </View>
                        <Subheading style={{ marginVertical: 0, padding: 0 }}><Subheading style={{ fontWeight: 'bold' }}>Department: </Subheading>{item.dep}</Subheading>
                        <Subheading style={{ marginVertical: 0, padding: 0, fontWeight: 'bold' }}>Vist Date:</Subheading>
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
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Animated.FlatList
                data={DATA}
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
        right: 0,
        bottom: 0,
        backgroundColor: '#f9f9f9',
        borderTopLeftRadius: 21.5,
        borderBottomRightRadius: 10,
        paddingHorizontal: 20,
        height: 43,
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 5,
        borderLeftWidth: 0.3,
        borderTopWidth: 0.3,
        borderColor: '#b6b6b6'
    },
    fab: {
        position: 'absolute',
        alignSelf: "center",
        bottom: 5,
        backgroundColor: "#fff",
        elevation: 10,
        borderWidth: 2,
        borderColor: '#147efb'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(OPDsCurrent);
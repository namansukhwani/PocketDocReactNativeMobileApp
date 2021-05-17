import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, StatusBar, Linking, ScrollView, FlatList, Text, Image, Alert, TouchableOpacity, ToastAndroid, Keyboard, PermissionsAndroid } from 'react-native';
import { Paragraph, IconButton, Subheading, Button, Caption, Searchbar, ActivityIndicator, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Spinner from 'react-native-spinkit';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


//redux
const mapStateToProps = state => {
    return {
        appointments: state.appointmentesAll
    };
};

const mapDispatchToProps = (dispatch) => ({

})

const AllPrescriptions = props => {

    //refs

    //states
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    //lifecycle

    useEffect(() => {
        setFilteredData(
            props.appointments.appointments.filter(doc => {
                return doc.doctorData.name.toLowerCase().includes(search.toLowerCase()) && doc.prescription.length !== 0
            })
        )
    }, [search, props.appointments.appointments])

    //methods

    const PrescriptionView = ({ item, index }) => {
        return (
            <Animatable.View style={styles.preView} animation="slideInRight" duration={500} useNativeDriver={true}>
                <Title>{item.doctorData.name}</Title>
                <Caption numberOfLines={1}>{item.problem}</Caption>
                {item.prescription.map((prescription, index) => {
                    return (
                        <TouchableOpacity

                            key={index.toString()}
                            style={{
                                elevation: 0,
                                padding: 10,
                                borderRadius: 15,
                                marginVertical: 5,
                                backgroundColor: '#e3f2fd',
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row"
                            }}
                            onPress={() => { props.navigation.navigate('PrescriptionView', { data: item, pre: prescription }) }}

                        >
                            <View style={{
                                justifyContent: "flex-start",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "flex-start"
                            }}>
                                <MaterialCommunityIcons name="file-plus" size={35} color="red" />
                                <Paragraph style={{ color: '#147efb', textTransform: 'capitalize', fontSize: 18 }}>{prescription.id}</Paragraph>
                            </View>
                            <View style={{}}>
                                <Caption>{moment(prescription.date.toDate()).format('Do MMMM YYYY')}</Caption>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </Animatable.View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#fff" barStyle='dark-content' />
            <Animatable.View style={{ paddingHorizontal: 15, }} animation="slideInDown" duration={500} useNativeDriver={true}>
                <Searchbar
                    placeholder="Search doctor name "
                    value={search}
                    onChangeText={(value) => {
                        setSearch(value)
                        if (value === '') {
                            Keyboard.dismiss()
                        }
                    }}
                    theme={{ colors: { primary: "#147efb" } }}
                    style={{
                        marginTop: 5,
                        borderRadius: 10
                    }}
                    iconColor="#147efb"
                />
            </Animatable.View>
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
                filteredData.length === 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcon name='error-outline' size={80} color="#147efb" />
                        <Subheading style={{}}>No Prescriptions available.</Subheading>
                    </View>
                    :
                    <FlatList
                        data={filteredData}
                        renderItem={PrescriptionView}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 18, paddingBottom: 24 }}
                    />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    preView: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 18,
        elevation: 4,
        marginBottom: 15
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AllPrescriptions);
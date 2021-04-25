import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StatusBar, Dimensions, BackHandler, ToastAndroid, FlatList, StyleSheet, Image, Animated, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { Avatar, Button, Headline, Paragraph, RadioButton, Subheading, TextInput, Title, Card, Caption, FAB, Searchbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { Utility } from '../utility/utility';
import { } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-spinkit';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IconicsIcon from 'react-native-vector-icons/Ionicons';

const height = Dimensions.get('screen').height;

//redux
const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => ({

})

//Component
function NewAppointment(props) {

    //refs
    const searchBox = useRef(0);

    //states
    const [search, setSearch] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [searchFilter, setSearchFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendation, setrecommendation] = useState(true);

    //lifecycles
    useEffect(() => {
        getAllDoctors();
    }, [])

    useEffect(() => {
        setSearchFilter(
            searchData.filter(doc => {
                return doc.name.toLowerCase().includes(search.toLowerCase())
            })
        )
    }, [search, searchData]);


    //methods
    function getAllDoctors() {
        firestore().collection('doctors').get()
            .then(querySnapshot => {
                const allData = querySnapshot.docs.map(docSnapshot => {
                    return docSnapshot.data()
                })
                //console.log(allData);
                setSearchData(allData);
                if (loading) { setLoading(false) }
            })
            .catch(err => console.log(err))
    }

    function SearchItem({ item, index }) {

        const lable = item.name.split(' ')[1][0] + item.name.split(' ')[2][0]
        const color = index % 2 === 0 ? "#147efb" : "#3f51b5";
        const address = item.address + ' ' + (item.city === '' ? '' : item.city + ' ') + (item.state === '' ? '' : item.state + ' ') + item.pincode;

        return (
            <Animatable.View animation="slideInRight" duration={500} useNativeDriver={true}>
                <TouchableOpacity style={styles.listItem} onPress={() => { Keyboard.dismiss(); props.navigation.navigate('DocDetails', { data: item }) }}>
                    {item.profilePictureUrl === '' ?
                        <Avatar.Text style={{ alignSelf: 'center' }} theme={{ colors: { primary: color } }} size={45} label={lable} />
                        :
                        <Avatar.Image source={{ uri: item.profilePictureUrl }} style={{ alignSelf: 'center' }} theme={{ colors: { primary: '#147efb' } }} size={45} />
                    }
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Title style={{ marginBottom: 0 }}>{item.name}</Title>
                        <Text style={styles.time}>{"ORTOPADIC"}</Text>
                        <View style={{ justifyContent: "flex-start", alignItems: "center", display: "flex", flexDirection: "row" }}>
                            <MaterialIcon name="location-on" size={15} />
                            <Paragraph numberOfLines={1} style={{ overflow: 'hidden', fontSize: 13 }}>{address}</Paragraph>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        );
    }

    function RecommendedView({ item, index }) {

        const lable = item.name.split(' ')[1][0] + item.name.split(' ')[2][0]
        const color = index % 2 === 0 ? "#147" : "#3f51b5";
        const address = item.address + ', ' + (item.city === '' ? '' : item.city + ', ') + (item.state === '' ? '' : item.state + ', ') + item.pincode + (item.landmark === '' ? '' : ', near ' + item.landmark);

        return (
            <Animatable.View animation="slideInRight" duration={500} useNativeDriver={true}>
                <TouchableOpacity style={{ ...styles.dr, width: 250, backgroundColor: "#fff", height: 162 }} onPress={() => { Keyboard.dismiss(); props.navigation.navigate('DocDetails', { data: item }) }}>
                    <View style={{ flexDirection: 'row' }}>
                        {item.profilePictureUrl === '' ?
                            <Avatar.Text style={{ ...styles.avatar, width: 70, height: 70 }} theme={{ colors: { primary: color } }} label={lable} />
                            :
                            <Image source={{ uri: item.profilePictureUrl }} style={{ ...styles.avatar, width: 70, height: 70, }} resizeMode='cover' />
                        }
                        <View style={{ flex: 1, paddingRight: 10, padding: 5 }}>
                            <Title style={{ marginVertical: 0, paddingVertical: 0 }}>{item.name}</Title>
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", paddingHorizontal: 8, paddingVertical: 8 }}>
                        <View style={{ justifyContent: "flex-start", alignItems: "center", display: "flex", flexDirection: "row" }}>
                            <MaterialIcon name="location-on" size={16} />
                            <Paragraph style={{ overflow: "hidden", justifyContent: "center",width:'90%', alignItems: "center", display: "flex" }} numberOfLines={1}>{address}</Paragraph>
                        </View>

                        <Text style={{ ...styles.spe, backgroundColor: "#e3f2fd", marginTop: 5,}}>{'ORTOPeADIst'}</Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        )
    }

    function DocView({ item, index }) {

        const lable = item.name.split(' ')[1][0] + item.name.split(' ')[2][0]
        const color = index % 2 === 0 ? "#147" : "#3f51b5";
        const address = item.address + ', ' + (item.city === '' ? '' : item.city + ', ') + (item.state === '' ? '' : item.state + ', ') + item.pincode + (item.landmark === '' ? '' : ', near ' + item.landmark);

        return (
            <Animatable.View animation="slideInUp" duration={500} useNativeDriver={true}>
                <TouchableOpacity style={styles.dr} onPress={() => { Keyboard.dismiss(); props.navigation.navigate('DocDetails', { data: item }) }}>
                    <View style={{ flexDirection: 'row' }}>
                        {item.profilePictureUrl === '' ?
                            <Avatar.Text style={styles.avatar} theme={{ colors: { primary: color } }} label={lable} />
                            :
                            <Image source={{ uri: item.profilePictureUrl }} style={styles.avatar} resizeMode='cover' />
                        }
                        <View style={{ flex: 1, paddingRight: 10, padding: 5 }}>
                            <Title style={{ marginVertical: 0, paddingVertical: 0 }}>Dr. Naman Sukhwani</Title>
                            <View style={{ justifyContent: "flex-start", alignItems: "center", display: "flex", flexDirection: "row" }}>
                                <MaterialIcon name="location-on" size={16} />
                                <Paragraph style={{ overflow: "hidden", marginVertical: 0,width:'90%'}} numberOfLines={1}>{address}</Paragraph>
                            </View>
                        </View>
                    </View>
                    <View style={{ justifyContent: "center", paddingHorizontal: 8, paddingVertical: 8 }}>
                        <Text style={styles.spe}>{'ORTOPeADIst'}</Text>
                    </View>
                    <View style={styles.rightArrow}>
                        <IconicsIcon name="ios-arrow-forward-circle-sharp" size={40}/>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        )
    }

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <StatusBar backgroundColor='#fff' barStyle="dark-content" />
            <View style={{ paddingHorizontal: 15, paddingTop: 10, }}>
                <Searchbar
                    placeholder="Search Doctor for Appointment"
                    value={search}
                    onChangeText={(value) => {
                        setSearch(value)
                        if (value === '') {
                            Keyboard.dismiss()
                        }
                    }}
                    iconColor="#147efb"
                    theme={{ colors: { primary: "#147efb" } }}
                    // ref={ref => searchBox.current = ref}
                    style={{ borderRadius: 10 }}
                // onIconPress={()=>{searchBox.current.focus()}}
                />
                {search !== '' &&
                    <View style={styles.searchResults}>
                        {searchFilter.length === 0 ?
                            <View>
                                <Paragraph style={{ alignSelf: 'center' }}>No Search result Available</Paragraph>
                            </View>
                            :
                            <View>
                                <FlatList
                                    data={searchFilter}
                                    renderItem={SearchItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    keyboardShouldPersistTaps='handled'
                                />
                            </View>
                        }
                    </View>
                }
            </View>
            {loading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner
                        type="Wave"
                        color="#147efb"
                        isVisible={loading}
                        size={50}
                    />
                </View>
                :
                <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps='handled'>

                    <View style={{ flex: 1 }}>
                        {recommendation &&
                            <>
                                <Title style={{ fontSize: 18, marginLeft: 15, marginTop: 10 }}>Recommended Doctors</Title>
                                <FlatList
                                    data={searchData}
                                    renderItem={RecommendedView}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                    keyboardShouldPersistTaps='handled'
                                />
                            </>
                        }
                        <Title style={{ fontSize: 18, marginLeft: 15, marginTop: 10 }}>Available Doctors</Title>
                        <FlatList
                            data={searchData}
                            renderItem={DocView}
                            keyExtractor={(item, index) => index.toString()}
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps='handled'
                        />
                    </View>
                </ScrollView>

            }

        </View>
    )
}

//styles
const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        height: 77,
        borderBottomWidth: 0.4,
        borderBottomColor: '#75757570',
        marginTop: 0
    },
    time: {
        color: "#147efb",
        fontSize: 14
    },
    searchResults: {
        backgroundColor: '#eeeeee',
        marginTop: 10,
        borderRadius: 10,
        padding: 10,
        maxHeight: height - 60
    },
    dr: {
        marginHorizontal: 15,
        backgroundColor: "#e3f2fd",
        elevation: 5,
        borderRadius: 10,
        marginBottom: 10,
        overflow:'hidden'
    },
    avatar: {
        alignSelf: 'flex-start',
        borderRadius: 10,
        width: 90,
        height: 90,
        // elevation: 0
    },
    spe: {
        color: "#147efb",
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 2,
        borderRadius: 20,
        backgroundColor: '#ffffff95',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        textTransform:'uppercase'
    },
    rightArrow:{
        position:"absolute",
        right:0,
        bottom:0,
        // backgroundColor:"#f9f9f9",
        paddingHorizontal: 10,
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 5,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAppointment);
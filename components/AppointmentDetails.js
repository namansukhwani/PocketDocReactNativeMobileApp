import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, StatusBar, Linking, ScrollView, FlatList, Text, Image, Alert, TouchableOpacity, ToastAndroid, Keyboard, PermissionsAndroid } from 'react-native';
import { Paragraph, IconButton, Subheading, Button, Caption, Searchbar, ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import FontAws5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modalize } from 'react-native-modalize';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import { Utility } from '../utility/utility';
import Spinner from 'react-native-spinkit';

const AppointmentDetails = (props) => {

    //consts
    const data = props.route.params.data;
    const address = data.doctorData.address + ', ' + (data.doctorData.city === '' ? '' : data.doctorData.city + ', ') + (data.doctorData.state === '' ? '' : data.doctorData.state + ', ') + data.doctorData.pincode + (data.doctorData.landmark === '' ? '' : ', near ' + data.doctorData.landmark);

    //refs
    const giveReviewModal = useRef(null);

    //states
    const [reportsData, setreportsData] = useState([])
    const [reportsLoading, setreportsLoading] = useState(true);
    const [allReportsData, setallReportsData] = useState([]);
    const [filteredAllReportsData, setfilteredAllReportsData] = useState([])
    const [allReportsLoading, setallReportsLoading] = useState(true);
    const [newReportOption, setnewReportOption] = useState(0);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);
    const [newPickedReportFile, setnewPickedReportFile] = useState({ name: "", path: '' })

    //lifecycles
    useEffect(() => {
        const unsbscribeReports = firestore().collection('users').doc(auth().currentUser.uid).collection('medicalHistory')
            .where('appointments', 'array-contains', data.id)
            .onSnapshot(querySnapshot => {
                const list = querySnapshot.docs.map(report => {
                    return {
                        id: report.id,
                        ...report.data()
                    }
                })

                if (reportsLoading) {
                    setreportsLoading(false)
                }
                setreportsData(list)
            },
                err => {
                    console.log(err);
                })

        const unsbscribeReportsAll = firestore().collection('users').doc(auth().currentUser.uid).collection('medicalHistory')
            .onSnapshot(queryData => {
                const list = queryData.docs.map(report => {
                    return {
                        id: report.id,
                        ...report.data()
                    }
                })

                if (allReportsLoading) {
                    setallReportsLoading(false)
                }
                setallReportsData(list)
            },
                err => {
                    ToastAndroid.show("Unable to fetch previous reports", ToastAndroid.LONG);
                    console.log(err);
                })


        return () => {
            unsbscribeReports();
            unsbscribeReportsAll();
        }
    }, []);

    useEffect(() => {
        setfilteredAllReportsData(
            allReportsData.filter(doc => {
                return doc.name.toLowerCase().includes(search.toLowerCase()) && !doc.appointments.includes(data.id)
            })
        )
    }, [search, allReportsData])

    //methods

    const getColor = () => {
        if (data.status === "pending") {
            return "#ffd740"
        }
        else if (data.status === "accepted") {
            return "#147efb"
        }
        else if (data.status === "completed") {
            return "#4caf50"
        }
        else {
            return "#d32f2f"
        }
    }

    const removeReport = (report) => {
        var a = report.appointments
        const index = a.indexOf(data.id)
        a.splice(index, 1)

        firestore().collection('users').doc(auth().currentUser.uid).collection('medicalHistory').doc(report.id).update({ appointments: a })
            .then(() => {
                return
            })
            .catch(err => {
                console.log(err);
                ToastAndroid.show("Unable to remove report", ToastAndroid.LONG);
            })
    }

    const addReport = (report) => {
        var a = report.appointments
        a.push(data.id)

        console.log(a);

        firestore().collection('users').doc(auth().currentUser.uid).collection('medicalHistory').doc(report.id).update({ appointments: a })
            .then(() => {
                return
            })
            .catch(err => {
                console.log(err);
                ToastAndroid.show("Unable to add report", ToastAndroid.LONG);
            })
    }

    const askExternalStorangePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                pickNewReport()
            } else {
                console.log("Storage Permission is denied.");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const pickNewReport = async () => {
        try {
            var res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                copyTo: 'documentDirectory'
            });
            console.log(res);
            setnewReportOption(2);
            setnewPickedReportFile({ name: res.name, path: res.fileCopyUri })
        }
        catch (err) {
            if (DocumentPicker.isCancel(err)) {
                giveReviewModal.current.close()
            }
            else {
                console.log(err);
            }
        }
    }

    const uploadReport = () => {
        const utility = new Utility();
        utility.checkNetwork()
            .then(() => {
                setUploading(true);
                const task = storage().ref().child('reports/' + newPickedReportFile.name).putFile(newPickedReportFile.path);
                task.on('state_changed', snapshot => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                }, (error) => {
                    setnewPickedReportFile({ name: '', path: "" })
                    setUploading(false);
                    giveReviewModal.current.close()
                    ToastAndroid.show("Unable to Upload report now", ToastAndroid.LONG);
                    console.log(error);
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                    return
                }, () => {
                    task.snapshot.ref.getDownloadURL()
                        .then(url => {

                            const newReport = {
                                appointments: [data.id],
                                dateCreated: firestore.Timestamp.now(),
                                name: newPickedReportFile.name,
                                url: url
                            }

                            firestore().collection('users').doc(auth().currentUser.uid).collection('medicalHistory').add(newReport)
                                .then(() => {
                                    console.log("Report added sucessfully");
                                    giveReviewModal.current.close()
                                    ToastAndroid.show("Report added sucessfully", ToastAndroid.LONG);
                                    setUploading(false);
                                    setnewPickedReportFile({ name: '', path: "" })
                                })
                                .catch(err => {
                                    console.log(err);
                                    setUploading(false);
                                    ToastAndroid.show("Unable to add report now", ToastAndroid.LONG);
                                    setnewPickedReportFile({ name: '', path: "" })
                                    giveReviewModal.current.close()
                                })

                        })
                        .catch(err => {
                            console.log("url ::", err);
                            ToastAndroid.show("Unable to upload report now", ToastAndroid.LONG);
                            setUploading(false);
                            setnewPickedReportFile({ name: '', path: "" })
                            giveReviewModal.current.close()
                        })

                })

            })
            .catch(err => {
                console.log(err);
                setUploading(false);
                setnewPickedReportFile({ name: '', path: "" })
                giveReviewModal.current.close()
            });
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#147efb" barStyle="dark-content" />
            <ScrollView>
                <Animatable.View animation="slideInDown" duration={500} useNativeDriver={true}>
                    <View style={styles.topTimeAccepted} >
                        <Paragraph style={{ ...styles.topTagAccepted, color: getColor() }}>{data.status === "accepted" ? "Scheduled" : data.status}</Paragraph>
                        <Text style={{ fontWeight: 'bold', color: "#fff", fontSize: 34 }}>{moment(data.time.toDate()).format('Do MMMM YYYY')},</Text>
                        <Text style={{ fontWeight: 'bold', color: "#fff", fontSize: 30 }}>{moment(data.time.toDate()).format('h:mm a')}</Text>
                    </View>
                    <View style={styles.avatarDiv}>
                        <View style={styles.avatar}>
                            {data.doctorData.profilePictureUrl === '' ?
                                <Image style={{ height: 90, width: 90, borderRadius: 45, }} size={85} source={require('../assets/user_avatar.png')} />
                                :
                                <Image style={{ height: 90, width: 90, borderRadius: 45, }} resizeMode="cover" source={{ uri: data.doctorData.profilePictureUrl }} />
                            }
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 50, backgroundColor: "#fff", marginLeft: 12 }}>
                            <IconButton
                                icon="phone"
                                style={{ backgroundColor: "#e3f2fd", elevation: 2 }}
                                color="#147efb"
                                size={35}
                                onPress={() => { Linking.openURL(`tel:+91${data.doctorData.phoneNo}`) }}
                            />
                        </View>
                        {/* <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 50, backgroundColor: "#fff", marginLeft: 12 }}> */}
                        <IconButton
                            icon="email"
                            style={{ backgroundColor: "#e3f2fd", elevation: 2 }}
                            color="#147efb"
                            size={35}
                            onPress={() => { Linking.openURL(`mailto:${data.doctorData.email}`) }}
                        />
                        {/* </View> */}
                    </View>
                </Animatable.View>
                <Animatable.View style={{ paddingHorizontal: 15, paddingBottom: 15 }} animation="slideInUp" duration={500} useNativeDriver={true}>
                    <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 5 }}>{data.doctorData.name}</Text>
                    <Subheading style={styles.sep}>{data.doctorData.specializations}</Subheading>
                    {/* <View style={{ flexDirection: 'row' }}> */}
                    <View style={styles.address}>
                        <MaterialIcon name="location-on" size={20} color="#147efb" />
                        <Paragraph style={{ color: '#147efb' }} >{address}</Paragraph>
                        <IconButton
                            icon="directions"
                            style={{ backgroundColor: "#e3f2fd", elevation: 2 }}
                            color="#147efb"
                            size={45}
                            onPress={() => { Linking.openURL(`geo:0,0?q=${address}`) }}
                        />
                    </View>

                    {/* </View> */}

                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Appointment ID</Subheading>
                    <Paragraph>{data.id}</Paragraph>
                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Your Problem</Subheading>
                    <Paragraph>{data.problem}</Paragraph>
                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Appointment Mode</Subheading>
                    <Subheading style={styles.sep}>{data.type}</Subheading>
                    <View style={{ backgroundColor: "#e3f2fd", height: 1, marginTop: 10 }} />
                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Attached Reports</Subheading>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 10 }}>
                        <IconButton
                            icon="plus-thick"
                            size={40}
                            style={{ backgroundColor: "#e3f2fd", elevation: 2, alignSelf: "center" }}
                            onPress={() => { giveReviewModal.current.open() }}
                            color={"#147efb"}
                            disabled={data.status == "completed" || data.status == "declined"}
                        />
                        <View style={{ justifyContent: "flex-start", alignItems: "flex-start", marginLeft: 10, alignSelf: "center" }}>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-start" }}>
                                <Subheading style={{ fontSize: 24, fontWeight: 'bold' }}>Reports</Subheading>
                                <FontAws5 name="file-medical" size={25} style={{ marginLeft: 5, color: "#000" }} />
                            </View>
                            <Caption>Click to add a new report for the doctor.</Caption>
                        </View>
                    </View>
                    {reportsLoading ?
                        <ActivityIndicator animating={true} size="small" color="#147efb" />
                        :
                        reportsData.length === 0 ?
                            <Caption style={{ alignSelf: "center", textAlign: 'center', width: '70%' }}>No reports are added</Caption>
                            :
                            <>
                                {reportsData.map((report, index) => {
                                    return <TouchableOpacity

                                        key={index.toString()}
                                        style={{
                                            elevation: 0,
                                            padding: 10,
                                            borderRadius: 15,
                                            marginVertical: 5,
                                            backgroundColor: "#e3f2fd",
                                            justifyContent: "flex-start",
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                        onPress={() => Linking.openURL(report.url)}
                                        onLongPress={() => {
                                            if (data.status == "completed" || data.status == "canceled") {
                                                return
                                            }
                                            console.log("long press");
                                            Alert.alert(
                                                "Remove report",
                                                "Are you sure you want to remove this report.",
                                                [
                                                    {
                                                        text: "Cancel", style: "cancel"
                                                    },
                                                    { text: "OK", onPress: () => { removeReport(report) } }
                                                ],
                                                { cancelable: false });
                                        }}
                                    >
                                        <MaterialCommunityIcons name="pdf-box" size={35} color="red" />
                                        <Paragraph style={{ color: '#147efb', textTransform: 'capitalize', fontSize: 18 }}>{report.name}</Paragraph>
                                    </TouchableOpacity>
                                })}
                                <Caption>Long Press to remove report.</Caption>
                            </>

                    }
                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Prescriptions</Subheading>
                    {data.prescription.length === 0 ?
                        <Caption style={{ alignSelf: "center", textAlign: 'center', width: '70%' }}>{data.status == "pending" ? "No priscriptions as your appointment is in pending state." : "No priscriptions available yet. "}</Caption>
                        :
                        <>
                            {data.prescription.map((prescription, index) => {
                                return (
                                    <TouchableOpacity

                                        key={index.toString()}
                                        style={{
                                            elevation: 0,
                                            padding: 10,
                                            borderRadius: 15,
                                            marginVertical: 5,
                                            backgroundColor: '#e3f2fd',
                                        }}
                                        onPress={() => { props.navigation.navigate('PrescriptionView', { data: data, pre: prescription }) }}

                                    >
                                        <View style={{
                                            justifyContent: "flex-start",
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}>
                                            <MaterialCommunityIcons name="file-plus" size={35} color="red" />
                                            <Paragraph style={{ color: '#147efb', textTransform: 'capitalize', fontSize: 18 }}>{prescription.id}</Paragraph>
                                        </View>
                                        <View style={{ flexDirection: 'row-reverse' }}>
                                            <Caption>{moment(prescription.date.toDate()).format('Do MMMM YYYY')}</Caption>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }
                    {!(data.status == "completed" || data.status == "declined") &&
                        <>
                            <View style={{ backgroundColor: "#e3f2fd", height: 1, marginTop: 10, marginBottom: 10 }} />

                            <Button mode="outlined" style={{ borderRadius: 15, marginBottom: 10 }} contentStyle={{ height: 48 }} color="#147EFB" onPress={() => { }}>Reschedule Appointment</Button>
                            <Button mode="outlined" style={{ borderRadius: 15 }} contentStyle={{ height: 48 }} color="red" onPress={() => { }}>Cancel Appointment</Button>
                        </>
                    }

                </Animatable.View>
            </ScrollView>
            <Modalize
                ref={giveReviewModal}
                adjustToContentHeight={true}
                modalStyle={styles.modal}
                handleStyle={{ backgroundColor: '#147efb' }}
                rootStyle={{ elevation: 10 }}
                onClose={() => {
                    setnewReportOption(0);
                    setnewPickedReportFile({ name: '', path: "" })
                }}
                panGestureEnabled={!uploading}
                closeOnOverlayTap={!uploading}

            >
                <View>
                    {newReportOption === 0 &&
                        <>
                            <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Add new report</Subheading>

                            <TouchableOpacity style={styles.options} onPress={() => setnewReportOption(1)}>
                                <Paragraph style={{ color: '#147efb', fontSize: 18 }}>From Privous reports</Paragraph>
                                <MaterialCommunityIcons name="arrow-right" size={20} color="#147efb" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.options} onPress={() => { askExternalStorangePermission(); }}>
                                <Paragraph style={{ color: '#147efb', fontSize: 18 }}>Add a new report</Paragraph>
                                <MaterialCommunityIcons name="arrow-right" size={20} color="#147efb" />
                            </TouchableOpacity>
                        </>
                    }
                    {newReportOption === 1 &&
                        <View style={{ flex: 1, height: 620 }}>
                            <Button mode="contained" icon="arrow-left" theme={{ colors: { primary: '#147efb' } }} onPress={() => setnewReportOption(0)} style={{ borderRadius: 15 }} labelStyle={{ color: '#147efb' }} theme={{ colors: { primary: '#e3f2fd' } }}>BACK</Button>
                            <Searchbar
                                placeholder="Search"
                                value={search}
                                onChangeText={(value) => {
                                    setSearch(value)
                                    if (value === '') {
                                        Keyboard.dismiss()
                                    }
                                }}
                                theme={{ colors: { primary: "#147efb" } }}
                                style={{
                                    marginTop: 10,
                                    borderRadius: 15,
                                    marginBottom: 15
                                }}
                                iconColor="#147efb"
                            />
                            {filteredAllReportsData.length == 0 ?
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Caption>No previous reports to add</Caption>
                                </View>
                                :
                                <FlatList
                                    data={filteredAllReportsData}
                                    renderItem={({ item, index }) => <TouchableOpacity
                                        key={index.toString()}
                                        style={{
                                            elevation: 0,
                                            padding: 10,
                                            borderRadius: 15,
                                            marginVertical: 5,
                                            backgroundColor: "#f5f5f5",
                                            justifyContent: "flex-start",
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                        onPress={() => { addReport(item); giveReviewModal.current.close() }}

                                    >
                                        <MaterialCommunityIcons name="pdf-box" size={35} color="red" />
                                        <Paragraph noOfLines={1} style={{ color: '#147efb', textTransform: 'capitalize', fontSize: 18 }}>{item.name}</Paragraph>
                                    </TouchableOpacity>}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 15 }}
                                />}
                        </View>
                    }
                    {newReportOption === 2 &&
                        <>
                            {uploading ?
                                <View style={{ padding: 25, justifyContent: 'center', alignItems: "center" }}>
                                    <Spinner
                                        type="Wave"
                                        color="#147efb"
                                        isVisible={true}
                                        size={50}
                                    />
                                    <Paragraph>Uploading</Paragraph>
                                </View>
                                :
                                <View>
                                    <Subheading style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Add this new report ?</Subheading>

                                    <View
                                        style={{
                                            elevation: 0,
                                            padding: 10,
                                            borderRadius: 15,
                                            marginVertical: 5,
                                            backgroundColor: "#f5f5f5",
                                            justifyContent: "flex-start",
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                    >
                                        <MaterialCommunityIcons name="pdf-box" size={35} color="red" />
                                        <Paragraph noOfLines={1} style={{ color: '#147efb', textTransform: 'capitalize', fontSize: 18 }}>{newPickedReportFile.name}</Paragraph>
                                    </View>
                                    <View style={{ display: 'flex', justifyContent: "space-evenly", alignItems: 'center', flexDirection: 'row', marginBottom: 15 }}>
                                        <Button mode="contained" icon="cancel" style={{ borderRadius: 10, marginTop: 10, flex: 1, marginRight: 5 }} contentStyle={{ height: 40 }} labelStyle={{ color: 'red', }} color="#f5f5f5" onPress={() => { giveReviewModal.current.close() }}>Cancel</Button>
                                        <Button mode="contained" icon="send" style={{ borderRadius: 10, marginTop: 10, flex: 1, marginLeft: 5 }} contentStyle={{ height: 40 }} color="#147efb" onPress={() => uploadReport()}>Add</Button>
                                    </View>
                                </View>
                            }
                        </>
                    }
                </View>
            </Modalize>
        </View >
    )
}

export default AppointmentDetails;

const styles = StyleSheet.create({
    topTimeAccepted: {
        flex: 1,
        height: 270,
        backgroundColor: "#147efb",
        borderBottomRightRadius: 135,
        // borderBottomLeftRadius:40,
        // paddingTop:60,
        justifyContent: "center",
        alignItems: "center",
        zIndex: -10
    },
    topTagAccepted: {
        textTransform: 'capitalize',
        backgroundColor: "#fff",
        color: "#147efb",
        elevation: 2,
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 25,
        fontWeight: "bold",
        fontSize: 18
    },
    avatarDiv: {
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: -52.5,
        paddingHorizontal: 15,
        display: "flex",
        flexDirection: "row"
    },
    avatar: {
        // marginLeft: '4%',
        alignSelf: 'flex-start',
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "#fff",
        // height:100,
        // width:100,
        borderRadius: 60,
        padding: 7
    },
    sep: {
        alignSelf: 'flex-start',
        marginBottom: 7,
        textTransform: 'capitalize',
        fontSize: 18,
        color: "#147efb",
        marginTop: 0,
        paddingHorizontal: 20,
        paddingVertical: 2,
        backgroundColor: '#e3f2fd',
        justifyContent: "center",
        borderRadius: 20
    },
    address: {
        backgroundColor: '#e3f2fd',
        borderRadius: 20,
        padding: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        // flex: 10
    },
    modal: {
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 15
    },
    options: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#e3f2fd',
        borderRadius: 20,
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 2,
        flexDirection: "row"
    }
});
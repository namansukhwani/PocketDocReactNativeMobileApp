import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, StatusBar, Linking, ScrollView, FlatList, Text, Image, Alert, TouchableOpacity, ToastAndroid, Keyboard, PermissionsAndroid } from 'react-native';
import { Paragraph, IconButton, Subheading, Button, Caption, Searchbar, FAB } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modalize } from 'react-native-modalize';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import { Utility } from '../utility/utility';
import Spinner from 'react-native-spinkit';
import FontAws5 from 'react-native-vector-icons/FontAwesome5';

const MedicalRecords = (props) => {

    //refs
    const giveReviewModal = useRef(null);

    //states
    const [search, setSearch] = useState('');
    const [allReportsData, setallReportsData] = useState([]);
    const [filteredAllReportsData, setfilteredAllReportsData] = useState([])
    const [allReportsLoading, setallReportsLoading] = useState(true);
    const [newPickedReportFile, setnewPickedReportFile] = useState({ name: "", path: '' })
    const [uploading, setUploading] = useState(false);

    //lifecycles
    useEffect(() => {
        console.log(auth().currentUser.uid);
        const unsbscribeReportsAll = firestore().collection('users').doc(auth().currentUser.uid).collection('medicalHistory').orderBy('dateCreated', 'desc')
            .onSnapshot(queryData => {
                const list = queryData.docs.map(report => {
                    return {
                        id: report.id,
                        ...report.data()
                    }
                })
                console.log(list);
                if (allReportsLoading) {
                    setallReportsLoading(false)
                }
                setallReportsData(list)
            },
                err => {
                    ToastAndroid.show("Unable to fetch reports", ToastAndroid.LONG);
                    console.log("Medical records", err);
                })

        return () => {
            unsbscribeReportsAll();
        }
    }, [])

    useEffect(() => {
        setfilteredAllReportsData(
            allReportsData.filter(doc => {
                return doc.name.toLowerCase().includes(search.toLowerCase())
            })
        )
    }, [search, allReportsData])

    //methods

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
            giveReviewModal.current.open()
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
                                appointments: [],
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

    const removeReport = (report) => {
        firestore().collection('users').doc(auth().currentUser.uid).collection('medicalHistory').doc(report.id).delete()
            .then(() => {
                ToastAndroid.show('Report Removed', ToastAndroid.LONG)
            })
            .catch(err => {
                ToastAndroid.show('Unable to remove report currently.', ToastAndroid.LONG)
                console.log(err);
            })
    }

    const ReportView = ({ item, index }) => {
        return (
            <Animatable.View animation="slideInRight" duration={500} useNativeDriver={true}>

                <TouchableOpacity

                    key={index.toString()}
                    style={{
                        elevation: 0,
                        padding: 10,
                        borderRadius: 15,
                        marginVertical: 5,
                        backgroundColor: "#e3f2fd",

                    }}
                    onPress={() => Linking.openURL(item.url)}
                    onLongPress={() => {
                        if (item.appointments.length !== 0) {
                            ToastAndroid.show("This report is used in an appointment it can't be removed", ToastAndroid.LONG)
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
                                { text: "OK", onPress: () => { removeReport(item) } }
                            ],
                            { cancelable: false });
                    }}
                >
                    <View style={{ justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }}>
                        <MaterialCommunityIcons name="pdf-box" size={35} color="red" />
                        <Paragraph style={{ color: '#147efb', textTransform: 'capitalize', fontSize: 18 }}>{item.name}</Paragraph>
                    </View>
                    <View style={{ justifyContent: "flex-end", alignItems: 'flex-end' }}>
                        <Caption>{moment(item.dateCreated.toDate()).format('Do MMMM YYYY')}</Caption>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar backgroundColor="#fff" />
            <Animatable.View style={{ paddingHorizontal: 15, }} animation="slideInDown" duration={500} useNativeDriver={true}>
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
                        marginTop: 3,
                        borderRadius: 10
                    }}
                    iconColor="#147efb"
                />
            </Animatable.View>
            {allReportsLoading ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <Spinner
                        type="Wave"
                        color="#147efb"
                        isVisible={true}
                        size={50}
                    />
                </View>
                :
                filteredAllReportsData.length == 0 ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                        <FontAws5 name="file-medical-alt" size={45} style={{ color: "#147efb" }} />
                        <Caption>No Reports to show</Caption>
                    </View>
                    :
                    <View>
                        <FlatList
                            data={filteredAllReportsData}
                            renderItem={ReportView}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15 }}
                            ListHeaderComponent={() => (
                                <View style={{ padding: 5 }}>
                                    <Caption>All your medical records and reports are available here. You can add more reports by pressing on add report button below or remove them by long pressing them.</Caption>
                                </View>
                            )}
                        />
                    </View>
            }

            <FAB
                style={styles.fab}
                label="ADD Report"
                icon="plus"
                onPress={() => askExternalStorangePermission()}
            />
            <Modalize
                ref={giveReviewModal}
                adjustToContentHeight={true}
                modalStyle={styles.modal}
                handleStyle={{ backgroundColor: '#147efb' }}
                rootStyle={{ elevation: 10 }}
                onClose={() => {
                    setnewPickedReportFile({ name: '', path: "" })
                }}
                panGestureEnabled={!uploading}
                closeOnOverlayTap={!uploading}

            >
                <View>
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
                                <Button mode="contained" icon="send" style={{ borderRadius: 10, marginTop: 10, flex: 1, marginLeft: 5 }} contentStyle={{ height: 40 }} color="#147efb" onPress={() => { uploadReport() }}>Add</Button>
                            </View>
                        </View>
                    }
                </View>
            </Modalize>
        </View>)
}

export default MedicalRecords;

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
        padding: 15
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#147efb"
    },
});
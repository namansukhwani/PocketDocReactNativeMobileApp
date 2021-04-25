import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StatusBar, Dimensions, BackHandler, ToastAndroid, FlatList, StyleSheet, Image, Animated, TouchableOpacity, ScrollView, Keyboard, Linking } from 'react-native';
import { Avatar, Chip, Button, Headline, Paragraph, RadioButton, Subheading, TextInput, Title, Card, Caption, FAB, Searchbar, List, HelperText } from 'react-native-paper';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { Rating } from 'react-native-ratings';
import { Modalize } from 'react-native-modalize';

const colours = [
    {
        backgroundColor: '#bcaaa4',
        text: '#1b0000'
    },
    {
        backgroundColor: '#e3f2fd',
        text: '#147efb'
    },
    {
        backgroundColor: '#ffe082',
        text: '#c67c00'
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

//Component 

function Review({ data, index, totalLength }) {

    const [sendersName, setSendersName] = useState('Unknown');
    const [picUrl, setpicUrl] = useState('');

    useEffect(() => {
        firestore().collection('users').doc(data.userId).get()
            .then(user => {
                setSendersName(user.data().name)
                setpicUrl(user.data().profilePictureUrl)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <View style={[styles.review, index === totalLength - 1 ? { borderBottomWidth: 0 } : { borderBottomWidth: 0.4 }]} key={index.toString()}>
            <View style={styles.reviewSendersName}>
                {picUrl === '' ?
                    <Avatar.Image size={20} source={require('../assets/user_avatar.png')} />
                    :
                    <Avatar.Image size={20} source={{ uri: picUrl }} />
                }
                <Caption style={{ marginLeft: 4 }}>{sendersName}</Caption>
            </View>
            <Paragraph numberOfLines={7}>{data.comment}</Paragraph>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                <Rating
                    type="star"
                    readonly={true}
                    imageSize={14}
                    startingValue={data.rating}
                    tintColor="#eeeeee"
                />
                <Caption style={{ fontSize: 12 }}>{moment(data.dateCreated.toDate()).format('DD/MM/YYYY')}</Caption>
            </View>
        </View>
    )
}

function DocDetails(props) {
    //const
    const data = props.route.params.data;
    const address = data.address + ', ' + (data.city === '' ? '' : data.city + ', ') + (data.state === '' ? '' : data.state + ', ') + data.pincode + (data.landmark === '' ? '' : ', near ' + data.landmark);

    //refs
    const giveReviewModal = useRef(null);

    //states
    const [reviews, setReviews] = useState([])
    const [reviewsLoading, setReviewsLoading] = useState(true)
    const [yourReview, setyourReview] = useState('');
    const [yourReviewError, setyourReviewError] = useState(false)
    const [yourRating, setyourRating] = useState(2.5)

    //lifecycles
    useEffect(() => {
        getAllReviews();
    }, [])

    //methods
    const getAllReviews = () => {
        firestore().collection('doctors').doc(data.doctorId).collection('reviews').orderBy('dateCreated','desc').limit(4).get()
            .then(reviews => {
                const tempList = reviews.docs.map(review => {
                    return review.data()
                })
                setReviews(tempList);
                setReviewsLoading(false);
            })
            .catch(err => {
                console.log(err);
                ToastAndroid.show("Unable to fetch Reviews", ToastAndroid.SHORT);
            })
    }

    const postReview=()=>{
        if(yourReview.length<=0){
            ToastAndroid.show("Can\'t post review without a comment",ToastAndroid.LONG)
        }
        else{
            const reviewData={
                userId:auth().currentUser.uid,
                dateCreated:firestore.Timestamp.now(),
                rating:yourRating,
                comment:yourReview
            }

            firestore().collection('doctors').doc(data.doctorId).collection('reviews').add(reviewData)
            .then(()=>{
                getAllReviews()
                const ratingUpdateData={
                    rating:{
                        totalRating:data.rating.totalRating+yourRating,
                        noOfRatings:data.rating.noOfRatings+1
                    }
                }

                firestore().collection('doctors').doc(data.doctorId).update(ratingUpdateData)
                .then(()=>{
                    ToastAndroid.show("Review Posted Sucessfully",ToastAndroid.SHORT)
                    giveReviewModal.current.close()
                })
                .catch((err)=>{
                    ToastAndroid.show('Review posted but unable to update rating',ToastAndroid.SHORT)
                    giveReviewModal.current.close()

                })
            })
            .catch(err=>{
                console.log(err);
                ToastAndroid.show("Unable to post review at the moment please try again later",ToastAndroid.LONG)
                giveReviewModal.current.close()
            })

        }
    }

    const colorForExperience=(exp)=>{
        if(exp<5){
            return colours[0]
        }
        else if(exp>=5 && exp<10){
            return colours[1]
        }
        else{
            return colours[2]
        }
    }

    const colorForRating=(rat)=>{
        if(rat<2){
            return colours[0]
        }
        else if(rat>=2 && rat<3.5){
            return colours[1]
        }
        else{
            return colours[2]
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                    <View style={{ paddingHorizontal: 15, paddingTop: 25 }}>
                        {data.profilePictureUrl === '' ?
                            <Avatar.Image style={{ elevation: 2, alignSelf: 'flex-start', marginBottom: 5, marginTop: 0 }} size={140} source={require('../assets/user_avatar.png')} />
                            :
                            <Avatar.Image style={{ elevation: 2, alignSelf: 'flex-start', marginBottom: 5, marginTop: 0 }} size={180} source={{ uri: data.profilePictureUrl }} />
                        }
                        <Headline style={{ alignSelf: 'flex-start', fontWeight: "bold", paddingBottom: 0, marginBottom: 0, marginLeft: 5 }}>{data.name}</Headline>
                        <Subheading style={styles.sep}>{data.specializations[0]}</Subheading>
                        <View style={styles.address}>
                            <MaterialIcon name="location-on" size={20} color="#757575" />
                            <Paragraph style={{ color: '#757575' }} >{address}</Paragraph>
                        </View>
                        <LottieView
                            source={require('../assets/bubbles_animation.json')}
                            autoPlay={true}
                            resizeMode='contain'
                            loop={true}
                            style={{ flex: 1, zIndex: -10, position: 'absolute', width: '100%', height: '100%', opacity: 0.6 }}
                            speed={0.5}
                        />
                    </View>

                    <Animatable.View style={{ flex: 1, padding: 15, elevation: 10, backgroundColor: '#fff', borderTopRightRadius: 30, borderTopLeftRadius: 30 }} animation="slideInUp" duration={500} useNativeDriver={true}>
                        <Subheading style={{ fontSize: 20, fontWeight: "bold", marginTop: 0, paddingTop: 0 }}>About</Subheading>
                        <Paragraph style={{ fontSize: 14.7 }}>{data.about}</Paragraph>
                        <View style={styles.ratingView}>
                            <View style={{ ...styles.ratingViewButton, marginRight: 6 ,backgroundColor:colorForExperience(data.exprience).backgroundColor}}>
                                <Headline style={{ color: colorForExperience(data.exprience).text }}>{data.exprience + "+"}</Headline>
                                <Subheading style={{ fontWeight: 'bold' }} >Exp. Years</Subheading>
                            </View>
                            <View style={{ ...styles.ratingViewButton, marginLeft: 6, backgroundColor: colorForRating(data.rating.totalRating / data.rating.noOfRatings).backgroundColor }}>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >

                                    <AntDesignIcon name="star" color={colorForRating(data.rating.totalRating / data.rating.noOfRatings).text} size={25} />
                                    <Headline style={{ color: colorForRating(data.rating.totalRating / data.rating.noOfRatings).text }}>{(data.rating.totalRating / data.rating.noOfRatings).toFixed(2)}</Headline>

                                </View>
                                <Subheading style={{ fontWeight: 'bold' }} >Rating</Subheading>
                            </View>
                        </View>
                        <Subheading style={{ fontSize: 20, fontWeight: "bold", marginTop: 0, paddingTop: 0 }}>Contact</Subheading>
                        <List.Section>
                            <List.Item
                                onPress={() => { Linking.openURL(`tel:+91${data.phoneNo}`) }}
                                style={styles.listItem}
                                title={data.phoneNo}
                                titleStyle={{ fontWeight: "bold" }}
                                left={() => <List.Icon icon="phone" color="#147efb" />}
                            />
                            <List.Item
                                onPress={() => { Linking.openURL(`mailto:${data.email}`) }}
                                style={styles.listItem}
                                title={data.email}
                                titleStyle={{ fontWeight: "bold" }}
                                left={() => <List.Icon icon="email" color="#147efb" />}
                            />
                            <List.Item
                                onPress={() => { Linking.openURL(`geo:0,0?q=${address}`) }}
                                style={styles.listItem}
                                titleStyle={{ fontWeight: "bold" }}
                                title="Get Direction"
                                left={() => <List.Icon icon="directions" color="#147efb" />}
                            />
                        </List.Section>
                        <Subheading style={{ fontSize: 20, fontWeight: "bold", marginTop: 0, paddingTop: 0 }}>Reviews</Subheading>
                        {/* <Paragraph>{JSON.stringify(reviews[0])}</Paragraph> */}
                        {reviewsLoading ?
                            null
                            :
                            <View style={styles.reviewsDiv}>
                                {reviews.map((review, index) => {
                                    return <Review data={review} index={index} key={index.toString()} totalLength={reviews.length} />
                                })}

                                {reviews.length > 4 &&
                                    <TouchableOpacity style={styles.showMoreButton}><Paragraph style={{ color: '#147efb', fontWeight: "bold" }} >Show More</Paragraph></TouchableOpacity>
                                }
                            </View>
                        }
                        <Button mode="contained" icon="comment" style={{ borderRadius: 10, marginTop: 10 }} contentStyle={{}} labelStyle={{ color: '#147efb', textTransform: "none" }} color="#f5f5f5" onPress={() => { giveReviewModal.current.open() }}>Give Your Rating</Button>
                        <View style={{ height: 58 }} />
                    </Animatable.View>
                </View>

            </ScrollView>
            <Button mode="contained" style={styles.button} contentStyle={{ height: 48 }} color="#147EFB" onPress={() => {props.navigation.navigate('AppointmentBooking', { data: data }) }}>Book Appointment</Button>
            <Modalize
                ref={giveReviewModal}
                adjustToContentHeight={true}
                modalStyle={styles.modal}
                handleStyle={{ backgroundColor: '#147efb' }}
                rootStyle={{ elevation: 10 }}
            >
                <Subheading style={{ fontWeight: "bold",color:'#f1c40f',alignSelf:"center" }}>Your Rating</Subheading>

                <Rating
                    style={{marginBottom:15}}
                    minValue={1}
                    startingValue={2.5}
                    jumpValue={0.5}
                    onFinishRating={rating=>{
                        setyourRating(rating)
                    }}
                />
                <Subheading style={{ fontWeight: "bold" }}>Your Review<Subheading style={{ color: 'red' }}>*</Subheading><Caption>{' ' + yourReview.length + '/200'}</Caption></Subheading>
                <TextInput
                    mode="outlined"
                    value={yourReview}
                    error={yourReviewError}
                    placeholder="Write Your comment here..."
                    style={{ backgroundColor: "#fff", maxHeight: 180 }}
                    theme={{ colors: { primary: "#147EFB" } }}
                    numberOfLines={6}
                    label="Comment*"
                    multiline={true}
                    onChangeText={text => {
                        if (yourReviewError) {
                            setyourReviewError(false)
                        }
                        if (text.length <= 200) {
                            setyourReview(text)
                        }
                        else {
                            setyourReviewError(true)
                        }
                    }}
                />
                <HelperText style={{ marginBottom: 5 }} type="error" visible={yourReviewError}>Your Comment can't me more than 200 characters.</HelperText>
                <View style={{ display: 'flex', justifyContent: "space-evenly", alignItems: 'center', flexDirection: 'row', marginBottom: 15 }}>
                    <Button mode="contained" icon="cancel" style={{ borderRadius: 10, marginTop: 10, flex: 1, marginRight: 5 }} contentStyle={{ height: 40 }} labelStyle={{ color: 'red', }} color="#f5f5f5" onPress={() => { giveReviewModal.current.close() }}>Cancel</Button>
                    <Button mode="contained" icon="send" style={{ borderRadius: 10, marginTop: 10, flex: 1, marginLeft: 5 }} contentStyle={{ height: 40 }} color="#147efb" onPress={() => postReview()}>POST</Button>
                </View>
            </Modalize>
        </View>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(DocDetails);

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 10,
        left: 12,
        right: 12,
        justifyContent: 'center',
        borderRadius: 15
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
        backgroundColor: '#eee',
        borderRadius: 20,
        padding: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        display: 'flex',
        flexDirection: "row",
        marginBottom: 10
    },
    ratingView: {
        display: 'flex',
        paddingVertical: 8,
        alignItems: "center",
        // justifyContent:"space-around",
        flexDirection: "row"
    },
    ratingViewButton: {
        flex: 1,
        backgroundColor: '#e3f2fd',
        height: 70,
        borderRadius: 15,
        elevation: 1,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
    },
    listItem: {
        backgroundColor: '#e3f2fd',
        borderRadius: 20,
        padding: 0,
        marginBottom: 12,
        fontWeight: 'bold'
    },
    reviewsDiv: {
        backgroundColor: "#eeeeee",
        borderRadius: 15,
        marginTop: 5,
        overflow: 'hidden'
    },
    showMoreButton: {
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: "#e0e0e0"
    },
    review: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: "#989898"
    },
    reviewSendersName: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#fff",
        alignSelf: 'flex-start',
        borderRadius: 15
    },
    modal: {
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 15
    },
})
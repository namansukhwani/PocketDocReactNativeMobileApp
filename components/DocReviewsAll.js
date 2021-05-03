import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, StatusBar, FlatList, TouchableOpacity,ToastAndroid } from 'react-native';
import { Paragraph, Avatar, Caption, ActivityIndicator, Subheading, TextInput, Button, HelperText } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Rating } from 'react-native-ratings';
import { Modalize } from 'react-native-modalize';

function Review({ data, index }) {

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
        <Animatable.View animation="slideInRight" duration={500} useNativeDriver={true} style={{ ...styles.review, borderBottomWidth: 1 }} key={index.toString()}>
            <View style={styles.reviewSendersName}>
                {picUrl === '' ?
                    <Avatar.Image size={20} source={require('../assets/user_avatar.png')} />
                    :
                    <Avatar.Image size={20} source={{ uri: picUrl }} />
                }
                <Caption style={{ marginLeft: 4, color: "#565656" }}>{sendersName}</Caption>
            </View>
            <Paragraph >{data.comment}</Paragraph>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                <Rating
                    type="custom"
                    readonly={true}
                    imageSize={14}
                    startingValue={data.rating}
                    tintColor="#fff"
                    ratingBackgroundColor="#eeeeee"
                />
                <Caption style={{ fontSize: 12 }}>{moment(data.dateCreated.toDate()).format('DD/MM/YYYY')}</Caption>
            </View>
        </Animatable.View>
    )
}

function DocReviewsAll(props) {
    //const
    const data = props.route.params.data;

    //refs
    const giveReviewModal = useRef(null);

    //state
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [reviewType, setreviewType] = useState('All')
    const [yourReview, setyourReview] = useState('');
    const [yourReviewError, setyourReviewError] = useState(false)
    const [yourRating, setyourRating] = useState(2.5)

    //lifecycle
    useEffect(() => {
        getAllReviews('dateCreated', 'desc')
    }, [])

    //methods
    const getAllReviews = (orderBy, orderType, refresh = false, typeChange = false) => {
        if (refresh) {
            setIsRefreshing(true);
        }
        else if (typeChange) {
            setReviewsLoading(true);
        }
        firestore().collection('doctors').doc(data.doctorId).collection('reviews').orderBy(orderBy, orderType).get()
            .then(reviews => {
                const tempList = reviews.docs.map(review => {
                    return review.data()
                })
                setReviews(tempList);
                if (refresh) {
                    setIsRefreshing(false)
                }
                setReviewsLoading(false);

            })
            .catch(err => {
                console.log(err);
                ToastAndroid.show("Unable to fetch Reviews", ToastAndroid.SHORT);
            })
    }

    const changeType = (type) => {
        if (type === "All") {
            setreviewType(type)
            getAllReviews('dateCreated', 'desc', false, true);
        }
        else if (type === "Good") {
            setreviewType(type);
            getAllReviews('rating', 'desc', false, true);
        }
        else {
            setreviewType(type);
            getAllReviews('rating', 'asc', false, true);
        }
    }

    const postReview = () => {
        if (yourReview.length <= 0) {
            ToastAndroid.show("Can\'t post review without a comment", ToastAndroid.LONG)
        }
        else {
            const reviewData = {
                userId: auth().currentUser.uid,
                dateCreated: firestore.Timestamp.now(),
                rating: yourRating,
                comment: yourReview
            }

            firestore().collection('doctors').doc(data.doctorId).collection('reviews').add(reviewData)
                .then(() => {
                    getAllReviews('dateCreated', 'desc', true); setreviewType('All')

                    const ratingUpdateData = {
                        rating: {
                            totalRating: data.rating.totalRating + yourRating,
                            noOfRatings: data.rating.noOfRatings + 1
                        }
                    }

                    firestore().collection('doctors').doc(data.doctorId).update(ratingUpdateData)
                        .then(() => {
                            ToastAndroid.show("Review Posted Sucessfully", ToastAndroid.SHORT)
                            giveReviewModal.current.close()
                        })
                        .catch((err) => {
                            ToastAndroid.show('Review posted but unable to update rating', ToastAndroid.SHORT)
                            giveReviewModal.current.close()

                        })
                })
                .catch(err => {
                    console.log(err);
                    ToastAndroid.show("Unable to post review at the moment please try again later", ToastAndroid.LONG)
                    giveReviewModal.current.close()
                })

        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
            <View style={styles.reviewTypes}>
                <TouchableOpacity onPress={() => changeType("All")} style={reviewType == 'All' ? styles.reviewTypeSelected : styles.reviewTypeUnselected}><Paragraph style={{ marginVertical: 0, fontWeight: 'bold', color: reviewType == "All" ? "#FFF" : "#147EFB" }}>All</Paragraph></TouchableOpacity>
                <TouchableOpacity onPress={() => changeType("Good")} style={reviewType == 'Good' ? styles.reviewTypeSelected : styles.reviewTypeUnselected}><Paragraph style={{ marginVertical: 0, fontWeight: 'bold', color: reviewType == "Good" ? "#FFF" : "#147EFB" }}>Good First</Paragraph></TouchableOpacity>
                <TouchableOpacity onPress={() => changeType("Bad")} style={reviewType == 'Bad' ? styles.reviewTypeSelected : styles.reviewTypeUnselected}><Paragraph style={{ marginVertical: 0, fontWeight: 'bold', color: reviewType == "Bad" ? "#FFF" : "#147EFB" }}>Bad First</Paragraph></TouchableOpacity>
            </View>
            {reviewsLoading ?
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator animating={true} style={{ alignSelf: 'center' }} color="#147efb" size={60} />
                </View>
                :
                <FlatList
                    data={reviews}
                    refreshing={isRefreshing}
                    onRefresh={() => { getAllReviews('dateCreated', 'desc', true); setreviewType('All') }}
                    renderItem={({ item, index }) => <Review data={item} index={index} key={index.toString()} />}
                    keyExtractor={(item, index) => index.toString()}
                    // showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 10 ,paddingBottom:55}}
                />
            }
            
            <Button mode="contained" style={styles.button} contentStyle={{ height: 40 }} color="#147EFB" onPress={() => { giveReviewModal.current.open() }}>Give Your Review</Button>

            <Modalize
                ref={giveReviewModal}
                adjustToContentHeight={true}
                modalStyle={styles.modal}
                handleStyle={{ backgroundColor: '#147efb' }}
                rootStyle={{ elevation: 10 }}
                onClose={()=>{setyourRating(2.5);setyourReview('')}}
            >
                <Subheading style={{ fontWeight: "bold", color: '#f1c40f', alignSelf: "center" }}>Your Rating</Subheading>

                <Rating
                    style={{ marginBottom: 15 }}
                    minValue={1}
                    startingValue={2.5}
                    jumpValue={0.5}
                    onFinishRating={rating => {
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

export default DocReviewsAll;

const styles = StyleSheet.create({
    review: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: "#eeeeee"
    },
    reviewSendersName: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#e3f2fd",
        alignSelf: 'flex-start',
        borderRadius: 15
    },
    reviewTypes: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: '#eeeeee',
        borderRadius: 25,
        marginHorizontal: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // borderBottomColor:'#147efb',
        // borderBottomWidth:1
    },
    reviewTypeSelected: {
        backgroundColor: '#147efb',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 4,
        color: '#fff',
        elevation: 2,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reviewTypeUnselected: {
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 2,
        color: '#fff',
        borderColor: '#147efb',
        borderWidth: 2,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        padding: 15
    },
    button: {
        position: 'absolute',
        bottom: 10,
        left: 12,
        right: 12,
        justifyContent: 'center',
        borderRadius: 15
    },
})
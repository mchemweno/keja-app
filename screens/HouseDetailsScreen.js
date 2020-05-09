import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {SliderBox} from "react-native-image-slider-box";
import Colors from "../constants/Colors";
import {useSelector} from "react-redux";
import CustomText from "../components/CustomText";
import MapPreviewComponent from "../components/map components/MapPreviewComponents";
import {FontAwesome5} from "@expo/vector-icons";
import Card from "../components/Card";
import StarRating from "react-native-star-rating";



const HouseDetailScreen = props => {


    const {house} = props.route.params;
    props.navigation.setOptions({
        title: house.properties.name
    });

    const [autoPlay, setAutoPlay] = useState(true);


    const height = useSelector(state => state.uiReducer.height);
    const width = useSelector(state => state.uiReducer.width);
    const orientation = height < width ? 'landscape' : 'portrait';


    return (
        <ScrollView style={styles.screen}>
            <View style={styles.sliderContainer}>
                <SliderBox
                    images={house.properties.house_images}
                    imageLoadingColor={Colors.mainColor}
                    autoplay={false}

                    onCurrentImagePressed={(index) => setAutoPlay(false)}
                    circleLoop
                    parentWidth={width}

                    resizeMethod={'resize'}
                    resizeMode={'cover'}

                    paginationBoxStyle={{
                        position: "absolute",
                        bottom: 0,
                        padding: 0,
                        alignItems: "center",
                        alignSelf: "center",
                        justifyContent: "center",
                        paddingVertical: 10
                    }}

                    dotColor={Colors.mainColor}
                    sliderBoxHeight={350}
                    inactiveDotColor={'white'}

                    ImageComponentStyle={{width: '100%'}}
                />
            </View>
            <Card style={{marginTop: 5, paddingBottom: 10}}>
                <View style={styles.priceNameOwnerCard}>
                    <View>
                        <View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <View>
                                    <StarRating
                                        disabled={true}
                                        emptyStar={'md-star-outline'}
                                        fullStar={'md-star'}
                                        halfStar={'md-star-half'}
                                        iconSet={'Ionicons'}
                                        rating={3}
                                        maxStars={5}
                                        fullStarColor={Colors.complementary}
                                        emptyStarColor={Colors.complementary}
                                        starSize={30}
                                    />
                                </View>
                            </View>
                        </View>
                        <CustomText style={styles.priceText}>Ksh.<CustomText
                            style={{...styles.priceText}}>{house.properties.price}</CustomText></CustomText>
                        <View style={styles.nameCard}>
                            <CustomText style={styles.nameText}>{house.properties.name}</CustomText>
                        </View>
                    </View>
                    <View style={{
                        alignItems: 'flex-end'
                    }}>
                        <TouchableOpacity>
                            <View style={{height: 60, width: 60}}>
                                <Image source={require('../media/16508961_10208579998673126_7136972591737547712_n.jpg')}
                                       style={{
                                           height: '100%',
                                           width: '100%',
                                           borderRadius: 50
                                       }}
                                />
                            </View>
                        </TouchableOpacity>

                        <CustomText style={styles.ownerLabel}>Owner</CustomText>
                    </View>
                </View>
                <View style={styles.amenitiesCard}>
                    <View style={{flexDirection: 'row'}}>
                        <FontAwesome5 name={'hammer'} size={16} color={Colors.mainColor}/>
                        <CustomText style={styles.label}>Amenities</CustomText>
                    </View>
                    {house.properties.amenities.dstv &&
                    <CustomText style={styles.amenitiesText}>
                        <FontAwesome5 name={'check-circle'}/>DSTv
                    </CustomText>}
                    {house.properties.amenities.wifi &&
                    <CustomText style={styles.amenitiesText}>
                        <FontAwesome5 name={'check-circle'}/>WIFI
                    </CustomText>}
                    {!house.properties.amenities.dstv && !house.properties.amenities.wifi &&
                    <CustomText style={styles.amenitiesText}>No extra utilities.</CustomText>}
                </View>
                <View style={{
                    ...styles.mapPreviewContainer,
                    height: orientation === 'portrait' ? height / 2.5 : height / 1.3,
                }}>
                    <View style={{flexDirection: 'row'}}>
                        <FontAwesome5 name={'map-pin'} size={16} color={Colors.mainColor} style={{marginRight: '2%'}}/>
                        <CustomText style={styles.label}>Location</CustomText>
                    </View>
                    <View style={{flex: 1, margin: 5}}>
                        <MapPreviewComponent
                            location={{
                                lat: house.geometry.coordinates[1],
                                lng: house.geometry.coordinates[0]
                            }}
                            onPress={() => {
                                props.navigation.navigate('Single House Map Screen',
                                    {house: house}
                                )
                            }}
                        />
                    </View>
                </View>
            </Card>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: 30,
        backgroundColor: Colors.greyMonochromeLight2
    },
    priceText: {
        fontSize: 25
    },
    label: {
        fontSize: 14,
        color: Colors.grey,
        marginHorizontal: 5
    },
    ownerLabel: {
        color: Colors.grey,
        paddingRight: '2%'
    },
    amenitiesText: {
        fontSize: 16,
        color: Colors.black,
        marginHorizontal: '8%'
    },
    nameText: {
        fontSize: 23,
        color: Colors.black,
        marginHorizontal: '14%'
    },
    imageSliderStyle: {
        marginBottom: 5
    },
    amenitiesCard: {
        borderBottomWidth: 0.5,
        borderColor: Colors.greyMonochromeLight2,
        paddingVertical: 5,
        marginHorizontal: 5
    },
    mapPreviewContainer: {
        flex: 2,
        borderBottomWidth: 0.5,
        borderColor: Colors.greyMonochromeLight2,
        paddingVertical: 10,
        marginHorizontal: 5
    },
    priceNameOwnerCard: {
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '4%',
        borderBottomWidth: 0.5,
        borderColor: Colors.greyMonochromeLight2
    },
    nameOwnerCard: {
        paddingVertical: 5,
        borderColor: Colors.greyMonochromeLight2,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5
    },
    featuresLabel: {
        marginLeft: '1%',
        fontSize: 20,
        color: Colors.grey
    }
})

export default HouseDetailScreen;

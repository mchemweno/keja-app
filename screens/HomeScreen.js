import React, {useCallback, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Colors from "../constants/Colors";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import CustomText from "../components/CustomText";
import Card from "../components/Card";
import {useDispatch, useSelector} from "react-redux";
import {SliderBox} from "react-native-image-slider-box";
import {fetchHouses, fetchHousesRandom} from "../store/actions/houses";
import {fetchCategories} from "../store/actions/categories";
import {fetchNearbyLocations} from "../store/actions/location";
import {fetchCurrentLocation} from "../utilities/utilities";


const HomeScreen = props => {
    const height = useSelector(state => state.uiReducer.height);
    const width = useSelector(state => state.uiReducer.width);

    const houses = useSelector(state => state.houses.housesRandom);
    const houseMasterImages = [];

    const nearByLocations = useSelector(state => state.nearByLocations.nearByLocations);

    const categories = useSelector(state => state.categories.categories);

    const dispatch = useDispatch();
    const [currentImage, setCurrentImage] = useState(houseMasterImages[0]);
    const [region, setRegion] = useState(null);


    let numColumns = (width > height) ? 2 : 2;


    const orientation = height > width ? 'portrait' : 'landscape';


    const fetchCategoriesScreen = useCallback(async () => {
        try {
            await dispatch(fetchCategories());
        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }, [dispatch]);

    const fetchHousesScreen = useCallback(async () => {
        try {
            await dispatch(fetchHousesRandom());
        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }, [dispatch]);

    if (houses) {
        houses.map(house => {
            houseMasterImages.push(house.properties.master_image)
        });
    }
    ;

    const fetchNearbyLocationsScreen = async () => {
        try {
            await fetchCurrentLocation(setRegion, 0, 0);
            dispatch(fetchNearbyLocations(region.latitude, region.longitude));
            console.log(region);
        } catch (err) {
            Alert.alert('Disclaimer', err.message)
        }
    };

    useEffect(() => {
        // const unsubscribe = props.navigation.addListener('focus', () => {
        //
        // });
        // return (() => {
        //     unsubscribe();
        // })
        fetchHousesScreen();
        fetchCategoriesScreen();
        fetchNearbyLocationsScreen().catch(err => {
            Alert.alert('Disclaimer', err.message)
        });

    }, []);


    return (
        <ScrollView style={styles.screen}>
            {houses ?
                <View style={{flex: 1}}>
                    <ImageBackground
                        source={{uri: currentImage}}
                        style={{
                            ...styles.imageBackground,
                        }}
                        imageStyle={styles.imageStyle}
                        blurRadius={100}
                    >
                        <View style={styles.menuSearchContainer}>
                            <Card style={{
                                ...styles.searchCard,
                                height: orientation === 'portrait' ? height / 20 : height / 10
                            }}>
                                <View style={styles.searchContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.navigation.navigate('Map Screen', {
                                                nearByLocation: null,
                                                category: null
                                            })
                                        }}
                                        style={styles.searchOpacity}>
                                        <Ionicons
                                            name={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
                                            size={25} color={Colors.mainColor}
                                        />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={{
                                            ...styles.searchInput,
                                            height: orientation === 'portrait' ? height / 20 : height / 10
                                        }}
                                        placeholder={'Location?'}
                                        onFocus={() => {
                                            props.navigation.navigate('Map Screen', {
                                                nearByLocation: null,
                                                category: null
                                            })
                                        }}
                                    />
                                </View>
                            </Card>
                            <View style={styles.menuContainer}>
                                <TouchableOpacity
                                    style={styles.menuTouchableOpacity}
                                    onPress={() => {
                                        props.navigation.openDrawer()
                                    }}
                                >
                                    <Ionicons name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} size={40}
                                              color={Colors.mainColor}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Card style={{
                            ...styles.sliderCard,
                            height: orientation === 'portrait' ? height / 5 : height / 2.5,

                        }}>
                            <SliderBox
                                images={houseMasterImages}
                                imageLoadingColor={Colors.mainColor}


                                onCurrentImagePressed={(index) => {
                                    props.navigation.navigate('House Details Screen', {
                                        house: houses[index]
                                    })
                                }}
                                currentImageEmitter={(index) => {
                                    setCurrentImage(houseMasterImages[index])
                                }}
                                circleLoop
                                autoplay={false}
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
                                }}

                                dotColor={Colors.mainColor}
                                sliderBoxHeight={'100%'}
                                inactiveDotColor={'white'}

                                ImageComponentStyle={{width: '100%'}}

                                maxToRenderPerBatch={6}
                                removeClippedSubviews={true}
                                initialNumToRender={6}
                            />
                        </Card>
                    </ImageBackground>

                    <View style={styles.locationsContainer}>
                        <View>
                            <View style={styles.locationsTextContainer}>
                                <FontAwesome5 name={'location-arrow'} size={16} color={Colors.complementary}/>
                                <CustomText style={styles.locationsText}>Nearby locations</CustomText>
                            </View>
                            {nearByLocations.length > 0 ?
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    <View style={{justifyContent: 'flex-start', ...styles.locationsCard,}}>
                                        {nearByLocations.map((nearByLocation) => {
                                            return (
                                                <TouchableOpacity
                                                    key={nearByLocation.id}
                                                    style={{
                                                        ...styles.locationTouchableOpacity,
                                                        height: orientation === 'portrait' ? height / 28 : height / 13
                                                    }}
                                                    onPress={() => {
                                                        props.navigation.navigate('Map Screen', {
                                                            nearByLocation: nearByLocation,
                                                            category: null
                                                        })
                                                    }}
                                                >
                                                    <CustomText
                                                        style={styles.locationText}>{nearByLocation.name}</CustomText>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </ScrollView> :
                                <CustomText>Make Sure your GPS is turned on to enjoy this feature</CustomText>}
                        </View>
                    </View>

                    <View style={styles.exploreCardContainer}>
                        <View style={{flexDirection: 'row'}}>
                            <FontAwesome5 name={"binoculars"} size={16} color={Colors.complementary}/>
                            <CustomText style={styles.exploreText}>Explore Categories</CustomText>
                        </View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                            {categories &&
                            categories.map(category => {
                                return (
                                    <View
                                        style={{elevation: 10}}
                                        key={category.id}
                                    >
                                        <TouchableOpacity

                                            style={{
                                                ...styles.exploreCategoriesCard,
                                                width: width / 2.5,
                                                height: orientation === 'portrait' ? height / 8 : height / 3.5,
                                            }}
                                            onPress={() => {
                                                props.navigation.navigate('Map Screen', {
                                                    nearByLocation: null,
                                                    category: category,
                                                })
                                            }}
                                        >
                                            <ImageBackground
                                                style={styles.exploreImageBackground}
                                                source={require('../media/keja_images.png')}
                                            >
                                                <CustomText
                                                    style={{...styles.categoryText}}>{category.house_category}</CustomText>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}

                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    width: '100%'
                                }}
                            >
                                <FontAwesome5 name={'arrow-right'} size={16} color={Colors.complementary}/>
                                <CustomText style={styles.moreCategoriesText}>more categories</CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> :
                <View
                    style={{
                        ...styles.spinnerView,
                        height: height,
                        width: width
                    }}
                ><ActivityIndicator size={'large'} color={Colors.mainColor}/></View>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,

    },
    spinnerView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageBackground: {
        width: '100%',
        height: 210,
        marginBottom: 25,
    },
    imageStyle: {},
    menuSearchContainer: {
        marginTop: 30,
        flexDirection: 'row',
        marginHorizontal: 10
    },
    menuTouchableOpacity: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 5,
        borderRadius: 3
    },
    menuContainer: {
        flex: 2,
        overflow: 'hidden',
    },
    searchCard: {
        marginHorizontal: 5,
        borderRadius: 50,
        flex: 12
    },
    searchContainer: {
        flexDirection: 'row',
        flex: 6,
    },
    searchInput: {
        flex: 6,
        paddingLeft: 10,
        fontSize: 16
    },
    searchOpacity: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        borderColor: Colors.greyMonochromeLight,
    },
    locationsContainer: {
        marginTop: 5,
        paddingBottom: 5,
        paddingTop: 5,
        marginHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 10
    },
    locationsTextContainer: {
        flexDirection: 'row',
        marginHorizontal: 5,
        alignItems: 'center'
    },
    locationsText: {
        fontSize: 16,
        color: Colors.grey,
        marginLeft: 5
    },
    sliderCard: {
        borderRadius: 10,
        marginHorizontal: 10,
        overflow: 'hidden',
        marginTop: 10,
    },
    locationsCard: {
        marginHorizontal: 10,
        marginTop: 5,
        flexDirection: 'row',

    },
    locationTouchableOpacity: {
        borderColor: Colors.greyMonochromeLight2,
        borderWidth: 1,
        padding: 5,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        backgroundColor: Colors.mainColorMonochromeLight2

    },
    locationText: {
        color: Colors.mainColor,
        fontSize: 16,
    },
    exploreCardContainer: {
        marginTop: 5,
        paddingHorizontal: 5,
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderRadius: 10,
        paddingVertical: 5
    },
    exploreText: {
        fontSize: 16,
        color: Colors.grey,
        marginLeft: 5
    },
    exploreCategoriesCard: {
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: '5%',
        marginHorizontal: '3.3%',
        marginBottom: 5
    },
    exploreImageBackground: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingRight: '10%',
        paddingBottom: '10%',
    },
    categoryText: {
        fontSize: 16,
        color: 'white'
    },
    moreCategoriesText: {
        color: Colors.complementary,
        marginLeft: 5
    }
})


export default HomeScreen;

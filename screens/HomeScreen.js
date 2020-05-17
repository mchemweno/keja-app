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
import {fetchHousesRandom} from "../store/actions/houses";
import {fetchCategories} from "../store/actions/categories";
import {fetchNearbyLocations} from "../store/actions/location";
import MyImageSlider from "../components/MyImageSlider";
import {getLocationHandler} from "../utilities/utilities";


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

    const fetchNearbyLocationsScreen = useCallback(async () => {
        try {
            const {latitude, longitude} = await getLocationHandler();
            await dispatch(fetchNearbyLocations(latitude, longitude));
        } catch (err) {
            return err
        }
        ;
    }, []);

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
            Alert.alert("Couldn't fetch your location", 'Make sure your GPS and data are turned on');
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
                            height: orientation === 'portrait' ? height / 4 : height / 2,
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
                                    <Ionicons name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} size={35}
                                              color={Colors.mainColor}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Card style={{
                            ...styles.sliderCard,
                            height: orientation === 'portrait' ? height / 5 : height / 2.5,

                        }}>
                           <MyImageSlider
                               images={houseMasterImages}
                               sliderBoxHeight={'100%'}

                               onCurrentImagePressed={(index) => {
                                   props.navigation.navigate('House Details Screen', {
                                       house: houses[index]
                                   })
                               }}

                               currentImageEmitter={(index) => {
                                   setCurrentImage(houseMasterImages[index])
                               }}

                               dotColor={Colors.mainColor}
                               inactiveDotColor={'white'}

                               paginationBoxVerticalPadding={20}
                               paginationBoxStyle={{
                                   position: "absolute",
                                   bottom: 0,
                                   padding: 0,
                                   alignItems: "center",
                                   alignSelf: "center",
                                   justifyContent: "center",
                               }}

                               imageLoadingColor={Colors.mainColor}



                               autoplay={true}
                               circleLoop={false}
                           />
                        </Card>
                    </ImageBackground>

                    <View style={styles.locationsContainer}>
                        <View>
                            <View style={styles.locationsTextContainer}>
                                <FontAwesome5 name={'location-arrow'} size={16} color={Colors.complementary}/>
                                <CustomText style={styles.locationsText}>Nearby locations</CustomText>
                            </View>
                            {nearByLocations ?
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {nearByLocations.length > 0 ?
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
                                        </View> : <CustomText style={styles.noLocationText}>No places found near your
                                            location</CustomText>}
                                </ScrollView> :
                                <CustomText style={styles.noLocationText}>Make sure data and GPS are turned on to enjoy
                                    this
                                    feature.</CustomText>}
                        </View>
                    </View>

                    <View style={styles.exploreCardContainer}>
                        <View style={{flexDirection: 'row', marginHorizontal: '1%'}}>
                            <FontAwesome5 name={"binoculars"} size={16} color={Colors.complementary}/>
                            <CustomText style={styles.exploreText}>What are you looking for?</CustomText>
                        </View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', paddingLeft: '2.5%', paddingRight: '2.5%'}}>
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
                                                width: width / 2.56,
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
        marginBottom: '11%',
    },
    imageStyle: {
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    noLocationText: {
        marginLeft: 5
    },
    menuSearchContainer: {
        marginTop: 30,
        flexDirection: 'row',
        marginHorizontal: '2%'
    },
    menuTouchableOpacity: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: '1%',
        borderRadius: 3
    },
    menuContainer: {
        flex: 2,
        overflow: 'hidden',
    },
    searchCard: {
        marginHorizontal: '1%',
        borderRadius: 50,
        flex: 12
    },
    searchContainer: {
        flexDirection: 'row',
        flex: 6,
    },
    searchInput: {
        flex: 6,
        paddingLeft: '2%',
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
        marginTop: '1%',
        paddingBottom: '1%',
        paddingTop: '1%',
        marginHorizontal: '2%',
        backgroundColor: 'white',
        borderRadius: 10
    },
    locationsTextContainer: {
        flexDirection: 'row',
        marginHorizontal: '2%',
        alignItems: 'center'
    },
    locationsText: {
        fontSize: 16,
        color: Colors.grey,
        marginLeft: 5
    },
    sliderCard: {
        borderRadius: 10,
        marginHorizontal: '2%',
        overflow: 'hidden',
        marginTop: '3%',
    },
    locationsCard: {
        marginHorizontal: 15,
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
        marginTop: '1%',
        paddingHorizontal: '1%',
        backgroundColor: 'white',
        marginHorizontal: '2%',
        borderRadius: 10,
        paddingVertical: '1%'
    },
    exploreText: {
        fontSize: 16,
        color: Colors.grey,
        marginLeft: '2%'
    },
    exploreCategoriesCard: {
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: '5%',
        marginHorizontal: '2.5%',
        marginBottom: '2%'
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
        marginLeft: '1%'
    }
})


export default HomeScreen;

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
import {Ionicons} from "@expo/vector-icons";
import CustomText from "../components/CustomText";
import Card from "../components/Card";
import {useDispatch, useSelector} from "react-redux";
import {SliderBox} from "react-native-image-slider-box";
import {fetchHouses} from "../store/actions/houses";


const HomeScreen = props => {
    const height = useSelector(state => state.uiReducer.height);
    const width = useSelector(state => state.uiReducer.width);

    const houses = useSelector(state => state.houses.houses)
    const houseMasterImages = [];

    const dispatch = useDispatch();
    const [currentImage, setCurrentImage] = useState(houseMasterImages[0]);


    let numColumns = (width > height) ? 2 : 2;

    const orientation = height > width ? 'portrait' : 'landscape';

    const categories = [{id: 0, value: 'Juja'}, {id: 1, value: 'Nairobi'}, {id: 2, value: 'Westlands'}, {
        id: 3,
        value: 'Kileleshwa'
    }, {id: 4, value: 'Kinoo'}, {id: 5, value: 'Thika'}];

    const fetchHousesScreen = useCallback(async () => {
        try {
            await dispatch(fetchHouses());
        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }, [dispatch]);

    if (houses) {
        houses.map(house => {
            houseMasterImages.push(house.properties.master_image)
        });
    }

    useEffect(() => {
        // const unsubscribe = props.navigation.addListener('focus', () => {
        //
        // });
        // return (() => {
        //     unsubscribe();
        // })
        fetchHousesScreen();
    }, [fetchHousesScreen]);


    return (
        <ScrollView style={styles.screen}>
            {houses ?
                <View style={{flex: 1}}>
                    <ImageBackground
                        source={{uri: currentImage}}
                        style={styles.imageBackground}
                        blurRadius={10}
                    >
                        <View style={styles.menuSearchContainer}>
                            <View style={styles.menuContainer}>
                                <TouchableOpacity
                                    style={styles.menuTouchableOpacity}
                                    onPress={() => {
                                        props.navigation.openDrawer()
                                    }}
                                >
                                    <Ionicons name={'md-menu'} size={33} color={Colors.mainColor}/>
                                </TouchableOpacity>
                            </View>
                            <Card style={{
                                ...styles.searchCard,
                                height: orientation === 'portrait' ? height / 20 : height / 10
                            }}>
                                <View style={styles.searchContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.navigation.navigate('Map Screen')
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
                                            props.navigation.navigate('Map Screen')
                                        }}
                                    />
                                </View>
                            </Card>
                        </View>
                        <Card style={{
                            ...styles.sliderCard,
                            height: orientation === 'portrait' ? height / 4 : height / 2
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
                                autoplay
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
                                inactiveDotColor={Colors.grey}

                                ImageComponentStyle={{width: '100%'}}

                                maxToRenderPerBatch={6}
                                removeClippedSubviews={true}
                                initialNumToRender={6}
                            />
                        </Card>
                    </ImageBackground>
                    <View style={{
                        marginTop: 10,
                        backgroundColor: 'white'
                    }}>
                        <View style={styles.locationsContainer}>
                            <View style={styles.locationsTextContainer}>
                                <CustomText style={styles.locationsText}>Popular locations</CustomText>
                            </View>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={{justifyContent: 'flex-start', ...styles.locationsCard,}}>
                                    {categories.map((category) => {
                                        return (
                                            <TouchableOpacity
                                                key={category.id}
                                                style={{
                                                    ...styles.locationTouchableOpacity,
                                                    height: orientation === 'portrait' ? height / 28 : height / 13
                                                }}>
                                                <CustomText style={styles.locationText}>{category.value}</CustomText>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.highestRatedCardContainer}>
                        <CustomText style={styles.highestRatedText}>Explore Categories</CustomText>
                        <View>
                            <View styles={{
                                ...styles.highestRatedHouseCard
                            }}>
                                <CustomText>ngori</CustomText>
                                <CustomText>ngori</CustomText>
                                <CustomText>ngori</CustomText>
                            </View>
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
        marginBottom: 60
    },
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
        borderRadius: 3,
    },
    menuContainer: {
        flex: 2,
        overflow: 'hidden'
    },
    searchCard: {
        marginHorizontal: 5,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: Colors.mainColorMonochromeLight2,
        flex: 12
    },
    searchContainer: {
        flexDirection: 'row',
        flex: 6
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
        borderBottomWidth: 0.5,
        paddingBottom: 5,
        marginHorizontal: 5,
        borderColor: Colors.backgroundColor
    },
    locationsTextContainer: {
        justifyContent: 'center'
    },
    locationsCardContainer: {},
    locationsText: {
        fontSize: 16,
        color: Colors.black
    },
    sliderCard: {
        borderRadius: 5,
        marginHorizontal: 10,
        overflow: 'hidden',
        marginTop: 10
    },
    locationsCard: {
        marginHorizontal: 5,
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
    highestRatedCardContainer: {
        marginTop: 5,
        paddingHorizontal: 5,
        backgroundColor: 'white'
    },
    highestRatedText: {
        fontSize: 16
    },
    highestRatedHouseCard: {

    }
})


export default HomeScreen;

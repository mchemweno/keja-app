import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import * as Permissions from "expo-permissions";
import * as Location from 'expo-location';
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import Search from "../components/map components/search";
import Colors from "../constants/Colors";
import MapMarker from "react-native-maps/lib/components/MapMarker";
import {useDispatch, useSelector} from "react-redux";
import {fetchHouses} from "../store/actions/houses";
import MapView from "react-native-map-clustering";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButtons";
import MapViewDirections from "react-native-maps-directions";
import vars from "../env";

const MapScreen = (props) => {

    props.navigation.setOptions({
        title: 'Houses',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title={'Menu'}
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        props.navigation.openDrawer()
                    }}/>
            </HeaderButtons>
        )
    });

    const dispatch = useDispatch();

    const houses = useSelector(state => state.houses.houses)

    const {width, height} = Dimensions.get('window');

    const aspectRatio = width / height;

    const latitude_delta = 0.0072;
    const longitude_delta = latitude_delta * aspectRatio;

    const [region, setRegion] = useState();

    const [userOriginCoordinates, setUserOriginCoordinates] = useState();
    const [userDestinationCoordinates, setUserDestinationCoordinates] = useState();
    const [mapWidth, setMapWidth] = useState('99%')

    const updateMapStyle = () => {
        setMapWidth('100%')
    }

    const [isSearch, setIsSearch] = useState(false);

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        fetchHousesScreen().then(() => setRefreshing(false));
    }, [refreshing]);


    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);

        if (result.status != 'granted') {
            Alert.alert(
                'Insufficient permissions',
                'You need to grant location permissions'
            );
            return false
        }
        return true
    };


    const lastKnownPosition = async () => {
        const hasPermissions = await verifyPermissions()
        if (!hasPermissions) {
            return;
        }

        try {
            const location = await Location.getLastKnownPositionAsync();
            setRegion(prevState => {
                return {
                    ...prevState,
                    lat: location.latitude,
                    lng: location.longitude
                }
            });

        } catch (err) {
            Alert.alert('Error', 'Make Sure Your GPS and Internet is Turned on.')
        }


    };

    const getLocationHandler = async () => {
        const hasPermissions = await verifyPermissions()
        if (!hasPermissions) {
            return;
        }


        try {
            const location = await Location.getCurrentPositionAsync({
                timeout: 5000,
                accuracy: 6
            });
            setRegion(prevState => {
                return {
                    ...prevState,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: latitude_delta,
                    longitudeDelta: longitude_delta
                }
            });
        } catch (err) {
            await lastKnownPosition();
        }


    };

    const setIsSearchHandler = () => {
        setIsSearch(prevState => !prevState)
    };


    const setRegionHandler = (lat, lng, latDelta) => {
        const lngDelta = latDelta * aspectRatio;
        setRegion(prevState => {
            return {
                ...prevState,
                latitude: lat,
                longitude: lng,
                latitudeDelta: latDelta,
                longitudeDelta: lngDelta


            }
        })
    };

    const fetchHousesScreen = useCallback(async () => {
        try {
            await dispatch(fetchHouses());
        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }, [dispatch]);


    useEffect(() => {
        getLocationHandler().catch(err => {
            Alert.alert('Disclaimer', "Make sure your gps and data are turned on")
        });

    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            fetchHousesScreen();
        });
        return (() => {
            unsubscribe();
        })
    }, [fetchHousesScreen]);


    return (
        <SafeAreaView style={styles.screen}>
            {!!region &&
            <MapView
                provider={"google"}

                onMapReady={() => {
                    fetchHousesScreen();
                    updateMapStyle()
                }}
                onPress={() => {
                    setUserDestinationCoordinates(null);
                    setIsSearch(false);
                }}
                style={{...styles.mapStyle, width: mapWidth,}}
                onRegionChangeComplete={region => {
                    setRegion((prevState) => {
                        return (
                            {
                                ...prevState,
                                latitude: region.latitude,
                                longitude: region.longitude,
                                latitudeDelta: region.latitudeDelta,
                                longitudeDelta: region.longitudeDelta
                            }
                        )
                    });
                }}

                region={region}

                zoomEnabled={true}
                zoomControlEnabled={true}
                showsUserLocation={true}
                userLocationPriority={'medium'}
                userLocationUpdateInterval={3000}
                showsBuildings={true}
                showsMyLocationButton={true}
                loadingEnabled={true}

                onUserLocationChange={(data) => {
                    setUserOriginCoordinates({
                        latitude: data.nativeEvent.coordinate.latitude,
                        longitude: data.nativeEvent.coordinate.longitude,
                    });
                }}

                clusterColor={Colors.secondary}
            >
                {/*{userOriginCoordinates && userDestinationCoordinates &&*/}
                {/*<MapViewDirections*/}
                {/*    apikey={vars.googleApiKey}*/}
                {/*    origin={userOriginCoordinates}*/}
                {/*    destination={userDestinationCoordinates}*/}
                {/*    strokeWidth={5}*/}
                {/*    strokeColor={Colors.primary}*/}
                {/*/>*/}
                {/*}*/}
                {houses && houses.map((house) => (
                    <MapMarker
                        key={house.id}
                        coordinate={{
                            latitude: house.geometry.coordinates[1],
                            longitude: house.geometry.coordinates[0]
                        }}

                        onPress={() => {
                            setUserDestinationCoordinates({
                                latitude: house.geometry.coordinates[1],
                                longitude: house.geometry.coordinates[0]
                            });
                        }}

                        onCalloutPress={() => {
                            props.navigation.navigate('House Details Screen',
                                {house: house})
                        }}

                        title={house.properties.name}
                        tracksViewChanges={true}

                    ><FontAwesome name={'home'} size={27} style={{color: Colors.secondary}}/></MapMarker>
                ))
                }
            </MapView>}
            <View style={styles.menuContainer}>
                <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                    <Ionicons
                        name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                        size={33}
                        color={Colors.secondary}
                    />

                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                {
                    isSearch ?
                        <Search
                            setCoordinatesHandler={setRegionHandler}
                            setIsSearchHandler={setIsSearchHandler}
                        /> :
                        <TouchableOpacity
                            style={styles.touchableOpacityStyle}
                            onPress={() => {
                                setIsSearchHandler(true);
                            }}
                        >
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
                                size={33} color={Colors.secondary}
                            />
                        </TouchableOpacity>
                }
            </View>
        </SafeAreaView>

    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    mapStyle: {
        flex: 1,
        marginTop: 30
    },
    menuContainer: {
        position: 'absolute',
        top: 50,
        left: 30,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        elevation: 5,
        borderRadius: 5,
        padding: 10
    },
    searchContainer: {
        position: 'absolute',
        top: 110,
        left: 30,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        elevation: 5,
        borderRadius: 5
    },
    touchableOpacityStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
})

export default MapScreen;

import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import * as Permissions from "expo-permissions";
import * as Location from 'expo-location';
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import Search from "../components/map components/search";
import Colors from "../constants/Colors";
import MapMarker from "react-native-maps/lib/components/MapMarker";
import {useSelector} from "react-redux";
import MapView from "react-native-map-clustering";

const MapScreen = (props) => {
    const {nearByLocation} = props.route.params;


    const houses = useSelector(state => state.houses.houses)

    const height = useSelector(state => state.uiReducer.height);
    const width = useSelector(state => state.uiReducer.width);

    const orientation = height > width ? 'portrait' : 'landscape';

    const aspectRatio = width / height;

    const latitude_delta = 0.0072;
    const longitude_delta = latitude_delta * aspectRatio;


    let nearByLocationMapScreen;
    if (nearByLocation) {
        const latDelta = nearByLocation.geometry.viewport.northeast.lat - nearByLocation.geometry.viewport.southwest.lat;
        nearByLocationMapScreen = {
            latitude: nearByLocation.geometry.location.lat,
            longitude: nearByLocation.geometry.location.lng,
            latitudeDelta: latDelta,
            longitudeDelta: latDelta * aspectRatio
        }
    }

    const [region, setRegion] = useState(nearByLocationMapScreen);


    const [mapWidth, setMapWidth] = useState('99%')

    const updateMapStyle = () => {
        setMapWidth('100%')
    }

    const [isSearch, setIsSearch] = useState(nearByLocation ? false : true);


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
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: latitude_delta,
                    longitudeDelta: longitude_delta
                }
            });

        } catch (err) {
            Alert.alert('Error', 'Make Sure Your GPS and Internet is Turned on.', [
                    {text: "OK", onPress: () => props.navigation.goBack()}
                ]
            )
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


    useEffect(() => {
        if (nearByLocation===null) {
            getLocationHandler().catch(err => {
                Alert.alert('Error', "Make sure your gps and data are turned on", [{text: "OK", onPress: () => props.navigation.goBack()}])
            });
            console.log(region);
        }
    }, []);



    return (
        <SafeAreaView style={styles.screen}>
            {region &&
            <MapView
                provider={"google"}
                region={region}

                onMapReady={() => {
                    updateMapStyle()
                }}
                onPress={() => {
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


                zoomEnabled={true}
                zoomControlEnabled={true}
                showsUserLocation={true}
                userLocationPriority={'medium'}
                userLocationUpdateInterval={3000}
                showsBuildings={true}
                showsMyLocationButton={true}
                loadingEnabled={true}


                clusterColor={Colors.mainColorMonochromeDark2}
            >

                {houses && houses.map((house) => (
                    <MapMarker
                        key={house.id}
                        coordinate={{
                            latitude: house.geometry.coordinates[1],
                            longitude: house.geometry.coordinates[0]
                        }}


                        onCalloutPress={() => {
                            props.navigation.navigate('House Details Screen',
                                {house: house})
                        }}

                        title={house.properties.name}
                        tracksViewChanges={true}

                    ><FontAwesome name={'home'} size={27} style={{color: Colors.mainColorMonochromeDark2}}/></MapMarker>
                ))
                }
            </MapView>}
            <View style={styles.searchContainer}>
                {
                    isSearch ?
                        <Search
                            container={{
                                width: orientation === 'portrait' ? 300 : 700
                            }}
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
                                size={33} color={Colors.mainColor}
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
    searchContainer: {
        position: 'absolute',
        top: 50,
        left: 30,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        elevation: 5,
        borderRadius: 3,
        overflow: 'hidden',
        borderWidth: 0.2,
        borderColor: Colors.mainColor
    },
    touchableOpacityStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        flex: 1
    }
})

export default MapScreen;

import React, {useCallback, useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import Search from "../components/map components/search";
import Colors from "../constants/Colors";
import MapMarker from "react-native-maps/lib/components/MapMarker";
import {useDispatch, useSelector} from "react-redux";
import MapView from "react-native-map-clustering";
import {fetchHouses, fetchHousesCategory} from "../store/actions/houses";
import {fetchCurrentLocation} from "../utilities/utilities";

const MapScreen = (props) => {
    const {nearByLocation} = props.route.params;
    const {category} = props.route.params;

    const dispatch = useDispatch()


    let houses = useSelector(state => state.houses.houses);

    if (category) {
        houses = useSelector(state => state.houses.housesCategory);
    };

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

    const fetchHousesScreen = useCallback(async () => {
        try {
            if (category) {
                await dispatch(fetchHousesCategory(category.id));
            } else {
                await dispatch(fetchHouses());
            }

        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }, [dispatch]);

    useEffect(() => {
        if (nearByLocation === null) {
            try {
                fetchCurrentLocation(setRegion, latitude_delta, longitude_delta);
            } catch (err) {
                Alert.alert('Disclaimer', 'Make sure your GPS and data are turned on');
                setIsSearch(true);
            }
        };

        fetchHousesScreen();
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

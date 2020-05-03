import React, {useState, useEffect} from 'react';
import MapView from "react-native-maps";
import {FontAwesome} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import MapMarker from "react-native-maps/lib/components/MapMarker";
import MapViewDirections from "react-native-maps-directions";
import vars from "../env";
import {StyleSheet} from "react-native";
import {useSelector} from "react-redux";


const SingleHouseMapScreen = (props) => {
    const {house} = props.route.params;

    const height = useSelector(state => state.uiReducer.height);
    const width = useSelector(state => state.uiReducer.width);

    const aspectRatio = width / height;


    const latitude_delta = 0.0072;
    const longitude_delta = latitude_delta * aspectRatio;

    const [userOriginCoordinates, setUserOriginCoordinates] = useState();
    const [userDestinationCoordinates, setUserDestinationCoordinates] = useState({
        latitude: house.geometry.coordinates[1],
        longitude: house.geometry.coordinates[0]
    });
    const [mapWidth, setMapWidth] = useState('99%');

    const [region, setRegion] = useState({
        latitude: house.geometry.coordinates[1],
        longitude: house.geometry.coordinates[0],
        latitudeDelta: latitude_delta,
        longitudeDelta: longitude_delta
    });




    const updateMapStyle = () => {
        setMapWidth('100%')
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('blur', () => {
            setUserDestinationCoordinates(null);
        });
        return (() => {
            unsubscribe();
        })
    });
    return (
        <MapView
            provider={"google"}

            region={region}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation={true}
            userLocationPriority={'medium'}
            userLocationUpdateInterval={3000}
            showsBuildings={true}
            showsMyLocationButton={true}
            loadingEnabled={true}

            onMapReady={() => {
                updateMapStyle()
            }}

            style={{...styles.mapStyle, width: mapWidth}}

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

            onUserLocationChange={(data) => {
                setUserOriginCoordinates({
                    latitude: data.nativeEvent.coordinate.latitude,
                    longitude: data.nativeEvent.coordinate.longitude,
                });
            }}
        >
            {userOriginCoordinates && userDestinationCoordinates &&
            <MapViewDirections
                apikey={vars.googleApiKey}
                origin={userOriginCoordinates}
                destination={userDestinationCoordinates}
                strokeWidth={5}
                strokeColor={Colors.mainColor}
                resetOnChange={false}
                precision={"high"}
            />
            }
            <MapMarker
                coordinate={{
                    latitude: house.geometry.coordinates[1],
                    longitude: house.geometry.coordinates[0]
                }}

                title={house.properties.name}
                tracksViewChanges={true}

            ><FontAwesome name={'home'} size={27} style={{color: Colors.mainColorMonochromeDark2}}/></MapMarker>
        </MapView>
    )
};

const styles= StyleSheet.create({
    mapStyle: {
        flex: 1,
        marginTop: 30
    },
});

export default SingleHouseMapScreen;

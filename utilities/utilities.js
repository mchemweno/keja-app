import * as Permissions from "expo-permissions";
import {Alert} from "react-native";
import * as Location from "expo-location";
import {fetchHouses, fetchHousesCategory} from "../store/actions/houses";

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
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }

    } catch (err) {
        return err
    }


};


export const getLocationHandler = async () => {
    const hasPermissions = await verifyPermissions()
    if (!hasPermissions) {
        return;
    }


    try {
        const location = await Location.getCurrentPositionAsync({
            timeout: 5000,
            accuracy: 6
        });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }

    } catch (err) {
        await lastKnownPosition();
    }


};

export const fetchHousesScreen = async (category, rooms, price, dstv, wifi) => {
    try {
        if (category) {
            await dispatch(
                fetchHousesCategory(category.id,
                    {
                        rooms: rooms,
                        price: price,
                        dstv: dstv,
                        wifi: wifi
                    }
                ));
        } else {
            await dispatch(fetchHouses(
                {
                    rooms: rooms,
                    price: price,
                    dstv: dstv,
                    wifi: wifi
                }
            ));
        }

    } catch (err) {
        return err
    }
};




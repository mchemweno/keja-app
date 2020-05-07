import * as Permissions from "expo-permissions";
import {Alert} from "react-native";
import * as Location from "expo-location";

export const fetchCurrentLocation = (setRegion, latitudeDelta, longitudeDelta) => {
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
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                }
            });
        } catch (err) {
            return err
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
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                }
            });
        } catch (err) {
            await lastKnownPosition();
        }


    };

    getLocationHandler().catch(err => {
        return err;
    });

}

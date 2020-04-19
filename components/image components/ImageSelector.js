import React from 'react';
import {Alert, Button, StyleSheet, View} from "react-native";
import Colors from "../../constants/Colors";
import * as Permissions from "expo-permissions";
import * as ImagePicker from 'expo-image-picker';


const ImageSelector = props => {
    const verifyPermissionsUseCamera = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA);

        if (result.status != 'granted') {
            Alert.alert(
                'Insufficient permissions',
                'You need to grant camera permissions'
            );
            return false
        }
        return true
    };

    const verifyPermissionsGoToGallery = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (result.status != 'granted') {
            Alert.alert(
                'Insufficient permissions',
                'You need to grant camera permissions'
            );
            return false
        }
        return true
    };

    const takeImageHandler = async () => {

        const hasPermission = await verifyPermissionsUseCamera();

        if (!hasPermission) {
            return
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8
        })

        if (image.uri !== undefined) {
            props.setImages(prevState => [...prevState, image]);
        }
    };
    const selectImageFromGallery = async () => {
        const hasPermission = await verifyPermissionsGoToGallery();

        if (!hasPermission) {
            return
        }

        const image = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8
        })

        if (image.uri !== undefined) {
            props.setImages(prevState => [...prevState, image]);
        }
    };


    return (
        <View style={styles.pickerContainer}>
            <Button title={"Take Image"} color={Colors.secondary} onPress={takeImageHandler}/>
            <Button title={"Select From Gallery"} color={Colors.secondary} onPress={selectImageFromGallery}/>
        </View>
    )
};

const styles = StyleSheet.create({
    pickerContainer: {
        justifyContent: 'space-around'
    }
})


export default ImageSelector;

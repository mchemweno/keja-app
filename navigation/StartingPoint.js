import React, {useCallback, useEffect} from 'react';
import {StyleSheet} from "react-native";
import {NavigationContainer} from '@react-navigation/native'
import {setDimensions} from "../store/actions/ui";
import {useDispatch} from "react-redux";
import {Dimensions} from 'react-native'
import MainNavigator from "./MainNavigator";
import KejaAppDrawer from "./KejaAppDrawer";
import {fetchNearbyLocations} from "../store/actions/location";



const StartingPoint = props => {

    const dispatch = useDispatch();

    const updateLayout = useCallback(() => {
        dispatch(setDimensions(
            Dimensions.get('window').height,
            Dimensions.get('window').width
        ))
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchNearbyLocations(	0.514277,35.269779));
        Dimensions.addEventListener('change', updateLayout);
        return () => {
            Dimensions.removeEventListener('change', updateLayout)
        };
    })

    return (
        <NavigationContainer>
           <KejaAppDrawer/>
        </NavigationContainer>
    )

};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})


export default StartingPoint;

import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MapScreen from "../screens/MapScreen";
import {StyleSheet} from "react-native";
import HouseDetailScreen from "../screens/HouseDetailsScreen";
import Colors from "../constants/Colors";
import headerStyles from "./headerStyles";


const Stack = createStackNavigator();


const HousesNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: headerStyles.headerStyles,
                headerTitleAlign: 'center',
                headerTitleStyle: headerStyles.headerTitleStyle
            }}
            headerMode={'float'}
        >
            <Stack.Screen name='Map Screen' component={MapScreen}/>
            <Stack.Screen name='House Details Screen' component={HouseDetailScreen}/>
        </Stack.Navigator>
    )
};

export default HousesNavigator;

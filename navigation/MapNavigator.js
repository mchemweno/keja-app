import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MapScreen from "../screens/MapScreen";
import HouseDetailScreen from "../screens/HouseDetailsScreen";
import headerStyles from "./headerStyles";


const Stack = createStackNavigator();


const MapNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: headerStyles.headerStyles,
                headerTitleAlign: 'center',
                headerTitleStyle: headerStyles.headerTitleStyle
            }}
            headerMode={'float'}

        >
            <Stack.Screen
                name='Map Screen'
                component={MapScreen}
                options={{
                    headerShown: false
                }}

            />
            <Stack.Screen name='House Details Screen' component={HouseDetailScreen}/>
        </Stack.Navigator>
    )
};

export default MapNavigator;

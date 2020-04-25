import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MapScreen from "../screens/MapScreen";
import HouseDetailScreen from "../screens/HouseDetailsScreen";
import headerStyles from "./headerStyles";
import TabNavigator from "./TabNavigator";


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
            <Stack.Screen name='Tab' component={TabNavigator}
                          options={{
                              headerShown: false,
                          }}
            />
            <Stack.Screen name='House Details Screen' component={HouseDetailScreen}
                          options={{
                              headerShown: false,
                          }}
            />
        </Stack.Navigator>
    )
};

export default MapNavigator;

import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import HouseDetailScreen from "../screens/HouseDetailsScreen";
import headerStyles from "./headerStyles";
import HomeScreen from "../screens/HomeScreen";


const Stack = createStackNavigator();


const HomeNavigator = () => {
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
                name='Home Screen'
                component={HomeScreen}

            />
            <Stack.Screen name='House Details Screen' component={HouseDetailScreen}/>
        </Stack.Navigator>
    )
};

export default HomeNavigator;

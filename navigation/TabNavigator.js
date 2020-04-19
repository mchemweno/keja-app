import React from 'react';
import {Platform, StyleSheet} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MapNavigator from "./MapNavigator";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import HomeNavigator from "./HomeNavigator";

const Tab = (Platform.OS === 'android') ? createMaterialBottomTabNavigator() : createBottomTabNavigator();


const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: Colors.secondaryColor,
                inactiveTintColor: 'black',
                style: styles.tabStyles
            }}

            shifting={true}
            activeColor={Colors.secondary}
            inactiveColor={Colors.other}
            initialRouteName={'Map'}
            barStyle={styles.tabStyles}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon: (tabInfo) => {
                        return <FontAwesome5
                            name={"home"}
                            size={25}
                            color={tabInfo.color}/>
                    },
                    tabBarColor: Colors.primaryColor
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapNavigator}
                options={{
                    tabBarIcon: (tabInfo) => {
                        return <FontAwesome5
                            name={"map-marker-alt"}
                            size={25}
                            color={tabInfo.color}/>
                    },
                    tabBarColor: Colors.primaryColor
                }}
            />
        </Tab.Navigator>
    )
};

const styles = StyleSheet.create({
    tabStyles: {
        backgroundColor: 'white',  //overidden by tabBarColor if shifting is true.
        fontFamily: 'open-sans-bold',
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        overflow: 'hidden'
    }
})

export default TabNavigator;

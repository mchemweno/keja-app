import React from 'react';
import {Platform, StyleSheet} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {FontAwesome5, FontAwesome} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import HomeNavigator from "./HomeNavigator";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";

const Tab = (Platform.OS === 'android') ? createMaterialBottomTabNavigator() : createBottomTabNavigator();


const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: Colors.mainColor,
                inactiveTintColor: Colors.mainColorMonochromeLight,
            }}

            shifting={true}
            activeColor={Colors.mainColor}
            inactiveColor={Colors.greyMonochromeLight}
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
                            size={20}
                            color={tabInfo.color}/>
                    }
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarIcon: (tabInfo) => {
                        return <FontAwesome5
                            name={"map-marker-alt"}
                            size={20}
                            color={tabInfo.color}/>
                    }
                }}
            />
            <Tab.Screen
                name="Ngwori"
                component={HomeScreen}
                options={{
                    tabBarIcon: (tabInfo) => {
                        return <FontAwesome
                            name={"gear"}
                            size={20}
                            color={tabInfo.color}/>
                    }
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
        overflow: 'hidden',
    }
})

export default TabNavigator;

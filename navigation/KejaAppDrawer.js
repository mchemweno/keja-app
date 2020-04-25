import {createDrawerNavigator} from "@react-navigation/drawer";
import MapNavigator from "./MapNavigator";
import React from "react";
import Colors from "../constants/Colors";
import OwnerNavigator from "./OwnerNavigator";
import TabNavigator from "./TabNavigator";


const Drawer = createDrawerNavigator();

const KejaAppDrawer = () => {
    return (
        <Drawer.Navigator
            hideStatusBar={false}
            drawerStyle={{
                marginTop: 30,
                backgroundColor: Colors.grayShade1
            }}

            drawerContentOptions={{
                activeTintColor: Colors.mainColor,
                inactiveTintColor: Colors.mainColorMonochrome,
                itemStyle: {margin: 2},
            }}
        >
            <Drawer.Screen
                name={'Houses Tab'}
                component={TabNavigator}
                options={{
                    headerShown: false
                }}
            />
            <Drawer.Screen name={'Owner'} component={OwnerNavigator}/>
        </Drawer.Navigator>
    )
}

export default KejaAppDrawer;

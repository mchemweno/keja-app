import {createDrawerNavigator} from "@react-navigation/drawer";
import HousesNavigator from "./HousesNavigator";
import React from "react";
import Colors from "../constants/Colors";
import OwnerNavigator from "./OwnerNavigator";


const Drawer = createDrawerNavigator();

const KejaAppDrawer = () => {
    return (
        <Drawer.Navigator
            hideStatusBar={false}
            drawerStyle={{
                marginTop: 30
            }}

            drawerContentOptions={{
                activeTintColor: Colors.primary,
                inactiveTintColor: 'black',
                itemStyle: { margin: 2 },
            }}
        >
            <Drawer.Screen name={'Houses'} component={HousesNavigator}/>
            <Drawer.Screen name={'Owner'} component={OwnerNavigator} />

        </Drawer.Navigator>
    )
}

export default KejaAppDrawer;

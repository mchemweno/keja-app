import React from 'react';
import {Text, View} from "react-native";


const HouseDetailScreen = props => {

    const house = props.route.params;
    console.log(house);
    return (
        <View>
            <Text>Niaje</Text>
        </View>
    )
};

export default HouseDetailScreen;

import React from 'react';
import {StyleSheet, Text} from "react-native";
import Colors from "../constants/Colors";

const CustomText = props => {
    return (
        <Text style={{...styles.myTextStyles, ...props.style}} {...props}>{props.children}</Text>
    )
};


const styles = StyleSheet.create({
    myTextStyles: {

    }
});

export default CustomText;

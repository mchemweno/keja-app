import React, {useCallback, useState} from 'react';
import {StyleSheet, Switch, View, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import Colors from "../constants/Colors";
import {useDispatch, useSelector} from "react-redux";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import CustomText from "./CustomText";
import Card from "./Card";
import {setDstvStore, setPriceStore, setRoomsStore, setWifiStore} from "../store/actions/filters";


const FiltersComponent = (props) => {
    const dispatch = useDispatch();


    const dstvStore = useSelector(state => state.filtersReducer.dstv);
    const wifiStore = useSelector(state => state.filtersReducer.wifi);
    const priceStore = useSelector(state => state.filtersReducer.price);
    const roomsStore = useSelector(state => state.filtersReducer.rooms);

    const [dstv, setDstv] = useState(dstvStore);
    const [wifi, setWifi] = useState(wifiStore);
    const [price, setPrice] = useState([priceStore.low, priceStore.high]);
    const [rooms, setRooms] = useState([roomsStore.low, roomsStore.high]);
    const [isLoading, setIsLoading] = useState(false);


    return (
        <View style={styles.screen}>
            {!isLoading ?
            <Card style={styles.cardStyles}>
                <View style={styles.amenitiesContainerStyles}>
                    <CustomText style={styles.labelStyle}>DSTV</CustomText>
                    <Switch
                        trackColor={{
                            false: Colors.greyMonochromeLight,
                            true: Colors.mainColorMonochromeLight
                        }}
                        thumbColor={Colors.mainColor}
                        value={dstv}
                        onValueChange={(value) => {
                            setDstv(value);
                        }}
                    />
                </View>

                <View style={styles.amenitiesContainerStyles}>
                    <CustomText style={styles.labelStyle}>WIFI</CustomText>
                    <Switch
                        trackColor={{
                            false: Colors.greyMonochromeLight,
                            true: Colors.mainColorMonochromeLight
                        }}
                        thumbColor={Colors.mainColor}
                        value={wifi}
                        onValueChange={(value) => {
                            setWifi(value);
                        }}
                    />
                </View>
                <View style={styles.amenitiesContainerStyles}>
                    <CustomText style={{...styles.labelStyle, marginRight: '4%'}}>Price</CustomText>
                    <View>
                        <View style={styles.priceTextContainer}>
                            <CustomText style={styles.sliderText}>min > {price[0]}</CustomText>
                            <CustomText style={styles.sliderText}>max {'<'} {price[1]}</CustomText>
                        </View>
                        <MultiSlider
                            trackStyle={{backgroundColor: Colors.grey}}
                            selectedStyle={{backgroundColor: Colors.mainColorMonochromeLight}}
                            sliderLength={250}
                            min={4000}
                            max={100000}
                            step={100}
                            allowOverlap={false}
                            values={[...price]}
                            onValuesChange={(values) => {
                                setPrice(values)
                            }}
                            snapped
                            markerStyle={{
                                backgroundColor: Colors.mainColor
                            }}
                            containerStyle={{
                                paddingHorizontal: '5%'
                            }}

                        />
                    </View>
                </View>
                <View style={styles.amenitiesContainerStyles}>
                    <CustomText style={styles.labelStyle}>Rooms</CustomText>
                    <View>
                        <View style={styles.priceTextContainer}>
                            <CustomText style={styles.sliderText}>min > {rooms[0]}</CustomText>
                            <CustomText style={styles.sliderText}>max {'<'} {rooms[1]}</CustomText>
                        </View>
                        <MultiSlider
                            trackStyle={{backgroundColor: Colors.grey}}
                            selectedStyle={{backgroundColor: Colors.mainColorMonochromeLight}}
                            sliderLength={250}
                            min={0}
                            max={10}
                            step={1}
                            allowOverlap={false}
                            values={[...rooms]}
                            onValuesChange={(values) => {
                                setRooms(values)
                            }}
                            snapped
                            markerStyle={{
                                backgroundColor: Colors.mainColor
                            }}
                            containerStyle={{
                                paddingHorizontal: '5%'
                            }}

                        />
                    </View>
                </View>
                <View style={styles.touchableOpacityContainer}>
                    <TouchableOpacity
                        style={styles.touchableOpacityStyles}
                        onPress={() => {
                            dispatch(setRoomsStore(rooms[0], rooms[1]));
                            dispatch(setPriceStore(price[0], price[1]));
                            dispatch(setWifiStore(wifi));
                            dispatch(setDstvStore(dstv));
                            setIsLoading(
                                true);
                            props.setIsFilter(false);
                            props.forceUpdate();
                        }}
                    ><CustomText style={styles.touchableOpacityText}>Save</CustomText></TouchableOpacity>
                    <TouchableOpacity
                        style={styles.touchableOpacityStyles}
                        onPress={() => {
                            props.setIsFilter(false);
                        }}
                    ><CustomText style={styles.touchableOpacityText}>Back</CustomText></TouchableOpacity>
                </View>
            </Card>: <ActivityIndicator size={'large'} color={Colors.mainColor}/>}
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: 30,
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    cardStyles: {
        padding: '5%',
        borderRadius: 10
    },
    amenitiesContainerStyles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    priceTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '5%'
    },
    touchableOpacityStyles: {
        backgroundColor: Colors.mainColor,
        borderRadius: 30,
        overflow: 'hidden'
    },
    touchableOpacityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    touchableOpacityText : {
        color: 'white',
        paddingVertical: '5%',
        paddingHorizontal: '10%'
    },
    sliderText: {
        color: Colors.complementary,
        fontSize: 16
    },
    labelStyle: {
        fontSize: 16,
    }
});

export default FiltersComponent;

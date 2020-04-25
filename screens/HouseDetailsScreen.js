import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {SliderBox} from "react-native-image-slider-box";
import Colors from "../constants/Colors";
import {useSelector} from "react-redux";
import CustomText from "../components/CustomText";
import MapPreviewComponent from "../components/map components/MapPreviewComponents";
import {FontAwesome5} from "@expo/vector-icons";
import Card from "../components/Card";


const HouseDetailScreen = props => {


    const {house} = props.route.params;
    props.navigation.setOptions({
        title: house.properties.name
    });

    const [autoPlay, setAutoPlay] = useState(true);


    const height = useSelector(state => state.uiReducer.height);
    const width = useSelector(state => state.uiReducer.width);
    const orientation = height < width ? 'landscape' : 'portrait';


    return (
        <ScrollView style={styles.screen}>
            <View style={styles.sliderContainer}>
                <SliderBox
                    images={house.properties.house_images}
                    imageLoadingColor={Colors.mainColor}
                    autoplay={false}

                    onCurrentImagePressed={(index) => setAutoPlay(false)}
                    circleLoop
                    parentWidth={width}

                    resizeMethod={'resize'}
                    resizeMode={'cover'}

                    paginationBoxStyle={{
                        position: "absolute",
                        bottom: 0,
                        padding: 0,
                        alignItems: "center",
                        alignSelf: "center",
                        justifyContent: "center",
                        paddingVertical: 10
                    }}

                    dotColor={Colors.mainColor}
                    sliderBoxHeight={350}
                    inactiveDotColor={'#808080'}

                    ImageComponentStyle={{width: '100%'}}
                />
            </View>
            <Card style={{marginTop:5, paddingBottom: 10}}>
                <View style={styles.nameOwnerCard}>
                    <View style={styles.nameCard}>
                        <CustomText style={styles.nameLabel}>Name</CustomText>
                        <CustomText style={styles.nameText}>{house.properties.name}</CustomText>
                    </View>
                    <View style={styles.ownerCard}>
                        <CustomText style={styles.nameLabel}>Owner</CustomText>
                    </View>
                </View>
                <View style={styles.priceCard}>
                    <CustomText style={styles.label}>Price</CustomText>
                    <CustomText style={styles.priceText}>Ksh.{house.properties.price}</CustomText>
                </View>
                <View style={styles.amenitiesCard}>
                    <CustomText style={styles.label}>Amenities</CustomText>
                    {house.properties.amenities.dstv &&
                    <CustomText style={styles.amenitiesText}>
                        <FontAwesome5 name={'check-circle'}/>DSTv
                    </CustomText>}
                    {house.properties.amenities.wifi &&
                    <CustomText style={styles.amenitiesText}>
                        <FontAwesome5 name={'check-circle'}/>WIFI
                    </CustomText>}
                    {!house.properties.amenities.dstv && !house.properties.amenities.wifi &&
                    <CustomText style={styles.amenitiesText}>No extra utilities.</CustomText>}
                </View>
                <View style={{
                    ...styles.mapPreviewContainer,
                    height: orientation === 'portrait' ? height / 2.5 : height / 1.3,
                }}>
                    <CustomText style={styles.label}>Map</CustomText>
                    <View style={{flex: 1, margin: 5}}>
                        <MapPreviewComponent location={{
                            lat: house.geometry.coordinates[1],
                            lng: house.geometry.coordinates[0]
                        }}/>
                    </View>
                </View>
            </Card>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: 30,
        backgroundColor: '#c3c3c3'
    },
    priceText: {
        fontSize: 20,
        color: Colors.myBlack,
        marginHorizontal: 15
    },
    label: {
        fontSize: 15,
        color: Colors.myGrey,
        marginHorizontal: 5
    },
    nameLabel: {
        fontSize: 15,
        color: Colors.myGrey,
        marginHorizontal: 5
    },
    amenitiesText: {
        fontSize: 15,
        color: Colors.myBlack,
        marginHorizontal: 15
    },
    nameText: {
        fontSize: 20,
        color: Colors.myBlack,
        marginHorizontal: 15
    },
    imageSliderStyle: {
        marginBottom: 5
    },
    amenitiesCard: {
        borderBottomWidth: 0.5,
        borderColor: Colors.mainColorMonochrome,
        paddingVertical: 5
    },
    mapPreviewContainer: {
        flex: 2,
        borderBottomWidth: 0.5,
        borderColor: Colors.mainColorMonochrome,
        paddingVertical: 10,
    },
    priceCard: {
        paddingVertical: 5,
        borderBottomWidth: 0.2,
        borderColor: Colors.mainColorMonochrome,
        flexDirection: 'row'
    },
    nameCard: {},
    nameOwnerCard: {
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderColor: Colors.mainColorMonochrome,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    ownerCard: {
        marginRight: 5
    }
})

export default HouseDetailScreen;

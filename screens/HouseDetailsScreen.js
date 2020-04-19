import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {SliderBox} from "react-native-image-slider-box";
import Colors from "../constants/Colors";
import {useSelector} from "react-redux";
import Card from "../components/Card";
import CustomText from "../components/CustomText";
import MapPreviewComponent from "../components/map components/MapPreviewComponents";


const HouseDetailScreen = props => {

    const [autoPlay, setAutoPlay] = useState(true);

    const {house} = props.route.params;


    const height = useSelector(state => state.uiReducer.height);
    const width = useSelector(state => state.uiReducer.width);
    const orientation = height < width ? 'landscape' : 'portrait';


    return (
        <ScrollView style={styles.screen}>
            <View style={styles.sliderContainer}>
                <SliderBox
                    images={house.properties.house_images}
                    imageLoadingColor={Colors.secondary}
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

                    dotColor={Colors.secondary}
                    sliderBoxHeight={300}
                    inactiveDotColor={'#808080'}

                    ImageComponentStyle={{borderRadius: 15, width: '97%', marginTop: 5}}
                />
            </View>
            <Card style={styles.priceCard}>
                <CustomText style={styles.amenitiesLabel}>Price</CustomText>
                <CustomText style={styles.amenitiesText}>{house.properties.price}</CustomText>
            </Card>
            <Card style={styles.amenitiesCard}>
                <CustomText style={styles.amenitiesLabel}>Amenities</CustomText>
                {house.properties.amenities.dstv &&
                <CustomText style={styles.amenitiesText}>DSTv</CustomText>}
                {house.properties.amenities.wifi &&
                <CustomText  style={styles.amenitiesText}>WIFI</CustomText>}
                {!house.properties.amenities.dstv && !house.properties.amenities.wifi &&
                <CustomText  style={styles.amenitiesText}>No extra utilities.</CustomText>}
            </Card>
            <Card style={{
                ...styles.mapPreviewContainer,
                height: orientation=== 'portrait'? height/3 : height/1.3
            }}>
                <MapPreviewComponent location={{
                    lat: house.geometry.coordinates[1],
                    lng: house.geometry.coordinates[0]
                }}/>
            </Card>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    amenitiesLabel: {
        fontSize: 25
    },
    amenitiesText: {
        fontSize: 15,
        color: Colors.other,
        marginHorizontal: 15
    },
    imageSliderStyle: {
        marginBottom: 5
    },
    amenitiesCard: {
        margin: 5,
        padding: 5,
        borderRadius: 10
    },
    sliderContainer: {},
    mapPreviewContainer: {
        flex: 2,
        borderRadius: 10
    },
    priceCard: {
        margin: 5,
        padding: 5,
        borderRadius: 10,
        flexDirection: 'row'
    }
})

export default HouseDetailScreen;

import React, {useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import CustomText from "../components/CustomText";
import Card from "../components/Card";
import {useSelector} from "react-redux";
import {SliderBox} from "react-native-image-slider-box";


const HomeScreen = props => {
    const houses = useSelector(state => state.houses.houses)
    const houseMasterImages = [];

    houses.map(house => {
        houseMasterImages.push(house.properties.master_image)
    });
    const [currentImage, setCurrentImage] = useState(houseMasterImages[0]);

    const height = useSelector(state => state.uiReducer.height);
    const width = useSelector(state => state.uiReducer.width);

    const orientation = height > width ? 'portrait' : 'landscape';


    return (
        <ScrollView style={styles.screen}>
            <ImageBackground
                source={{uri: currentImage}}
                style={styles.imageBackground}
                blurRadius={10}
            >
                <Card style={styles.searchCard}>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity style={styles.searchOpacity}>
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
                                size={25} color={Colors.mainColor}
                            />
                        </TouchableOpacity>
                        <TextInput style={styles.searchInput} placeholder={'House location?'}/>
                    </View>
                </Card>
                <Card style={{
                    ...styles.sliderCard,
                    height: orientation === 'portrait' ? height / 4 : height / 2
                }}>
                    <SliderBox
                        images={houseMasterImages}
                        imageLoadingColor={Colors.mainColor}
                        autoplay={true}

                        onCurrentImagePressed={(index) => {
                            props.navigation.navigate('House Details Screen',{
                                house: houses[index]
                            })
                        }}
                        currentImageEmitter={(index) => {
                            setCurrentImage(houseMasterImages[index])
                        }}
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
                        sliderBoxHeight={'100%'}
                        inactiveDotColor={Colors.grey}

                        ImageComponentStyle={{width: '100%'}}
                    />
                </Card>
            </ImageBackground>
            <View style={styles.categoriesContainer}>
                <View style={styles.categoriesTextContainer}>
                    <CustomText style={styles.categoriesText}>Categories</CustomText>
                </View>
                <View>
                    <Card>

                    </Card>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    imageBackground: {
        width: '100%',
        height: 200,
        marginBottom: 70
    },
    searchCard: {
        marginTop: 30,
        marginHorizontal: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: Colors.mainColorMonochromeLight2
    },
    searchContainer: {
        flexDirection: 'row',
    },
    searchInput: {
        flex: 6,
        padding: 7
    },
    searchOpacity: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: Colors.greyMonochromeLight
    },
    categoriesContainer: {
        marginTop: 10
    },
    categoriesTextContainer: {},
    categoriesCardContainer: {},
    categoriesText: {
        fontSize: 16,
        color: Colors.mainColor
    },
    sliderCard: {
        borderRadius: 5,
        marginHorizontal: 10,
        overflow: 'hidden',
        marginTop: 10
    }
})


export default HomeScreen;

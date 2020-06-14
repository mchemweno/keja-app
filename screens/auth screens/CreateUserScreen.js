import React, {useCallback, useReducer, useState} from "react";
import {Image, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import ImageSelector from "../../components/image components/ImageSelector";
import ImageItem from "../../components/image components/ImageItem";
import {FORM_UPDATE, formReducer} from "../../utilities/formReducer";
import CustomText from "../../components/CustomText";
import InputComponent from "../../components/input components/InputComponent";
import Colors from "../../constants/Colors";


const CreateUserScreen = (props) => {

    const [formState, dispatchFromUseReducer] = useReducer(
        formReducer,
        {
            inputValues: {
                username: '',
                firstName: '',
                lasttName: '',
                email: '',
                password: '',
                retypePassword: '',
            },
            inputValidities: {
                username: '',
                firstName: false,
                lastName: false,
                email: false,
                password: false,
                retypePassword: false
            },
            formIsValid: false
        }
    );

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {

        dispatchFromUseReducer({
            type: FORM_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFromUseReducer])

    const [image, setImage] = useState();
    return (
        <ScrollView
            style={styles.screen}
        >
            <View
                style={styles.imageSelectorPickerContainer}
            >
                <View
                    style={styles.imageContainer}
                >{!image ? <Image
                        style={{height: '100%', width: '100%'}}
                        source={require('../../media/keja_image.png')}
                    /> :
                    <ImageItem image={image}/>}
                </View>
                    <ImageSelector setImage={setImage}/>
            </View>
            <View style={styles.inputContainer}>
                <CustomText style={styles.labelTextStyle}>Username:</CustomText>
                <InputComponent
                    initialValue={formState.inputValues.username}
                    initialValidity={false}

                    required
                    minLength={5}

                    placeholder={'Username'}
                    id={'username'}

                    onInputChange={inputChangeHandler}

                    underlineColorAndroid="transparent"
                    autoCorrect
                    inputSize={20}
                />
            </View>
            <View style={styles.inputContainer}>
                <CustomText style={styles.labelTextStyle}>First name:</CustomText>
                <InputComponent
                    initialValue={formState.inputValues.firstName}
                    initialValidity={false}

                    required
                    minLength={3}

                    placeholder={'Fist Name'}
                    id={'firstName'}

                    onInputChange={inputChangeHandler}

                    underlineColorAndroid="transparent"
                    autoCorrect
                    inputSize={20}
                />
            </View>
            <View style={styles.inputContainer}>
                <CustomText style={styles.labelTextStyle}>last name:</CustomText>
                <InputComponent
                    initialValue={formState.inputValues.lastName}
                    initialValidity={false}

                    required
                    minLength={3}

                    placeholder={'Last Name'}
                    id={'lastName'}

                    onInputChange={inputChangeHandler}

                    underlineColorAndroid="transparent"
                    autoCorrect
                    inputSize={20}
                />
            </View>
            <View style={styles.inputContainer}>
                <CustomText style={styles.labelTextStyle}>Email:</CustomText>
                <InputComponent
                    initialValue={formState.inputValues.email}
                    initialValidity={false}

                    required
                    email

                    placeholder={'Email'}
                    id={'email'}

                    onInputChange={inputChangeHandler}

                    underlineColorAndroid="transparent"
                    keyboardType="email-address"
                    autoCorrect
                    inputSize={20}
                />
            </View>
            <View style={styles.inputContainer}>
                <CustomText style={styles.labelTextStyle}>Password:</CustomText>
                <InputComponent
                    initialValue={formState.inputValues.password}
                    initialValidity={false}

                    required
                    passwordValidation

                    placeholder={'Password'}
                    id={'password'}

                    onInputChange={inputChangeHandler}
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    autoCorrect={false}

                    inputSize={20}
                />
            </View>
            <View style={styles.inputContainer}>
                <CustomText style={styles.labelTextStyle}>Retype password:</CustomText>
                <InputComponent
                    initialValue={formState.inputValues.retypePassword}
                    initialValidity={false}

                    required
                    passwordValidation

                    placeholder={'Retyped Password'}
                    id={'retypePassword'}

                    onInputChange={inputChangeHandler}
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    autoCorrect={false}
                    inputSize={20}
                />
            </View>
            <TouchableOpacity style={{
                ...styles.signUpOpacity,
                backgroundColor: formState.formIsValid ? Colors.mainColor : Colors.mainColorMonochromeLight2,
            }}>
                <CustomText style={styles.signUpText}>Sign Up</CustomText>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginTop: 30
    },
    imageContainer: {
        height: 200,
        width: 200,
        borderWidth: 1
    },
    imageSelectorPickerContainer: {
        alignItems: 'center'
    },
    labelTextStyle: {
        color: Colors.mainColor,
        fontSize: 14
    },
    inputContainer: {
        marginHorizontal: '3%',
        marginTop: '3%'
    },
    signUpOpacity: {
        alignItems: 'center',
        paddingVertical: '2%',
        marginHorizontal: '1%',
        marginTop: '3%',
        borderRadius: 10
    },
    signUpText: {
        color: 'white',
        fontSize: 20,
    },
})

export default CreateUserScreen;

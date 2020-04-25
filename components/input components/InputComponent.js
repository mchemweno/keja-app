import React, {useEffect, useReducer} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import CustomText from "../CustomText";

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';


const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid,
            };

        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            };
        default:
            return state
    }
};


const InputComponent = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initialValidity,
        touched: false
    });

    const {onInputChange, id} = props;

    useEffect(() => {
        if (inputState.touched) {
            onInputChange(id, inputState.value, inputState.isValid)
        }

    }, [inputState]);

    const textChangeHandler = text => {

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        if (props.number != null && Number.isInteger(+text) === false) {
            isValid = false;
        }

        dispatch({type: INPUT_CHANGE, value: text, isValid: isValid})
    };


    const lostFocusHandler = () => {
        dispatch({type: INPUT_BLUR});
    }

    return (
        <View>
            <View style={styles.inputsContainer}>
                <CustomText style={styles.labelStyle}>{props.label}:</CustomText>
                <TextInput
                    placeholder={props.label}
                    {...props}
                    value={inputState.value}
                    onChangeText={text => {
                        textChangeHandler(text);
                    }}
                    onBlur={lostFocusHandler}
                    style={styles.inputStyle}

                    underlineColorAndroid='transparent'
                />
            </View>
            {!inputState.isValid && inputState.touched &&
            <View style={styles.errorContainer}>
                <CustomText style={styles.textStyle}>Enter Valid {props.label}</CustomText>
            </View>
            }
        </View>
    )
};

const styles = StyleSheet.create({
    inputStyleContainer: {},
    inputsContainer: {
        flexDirection: 'row',
        margin: '1%'
    },
    errorContainer: {
        borderRadius: 10,
        alignItems: 'center',
        margin: '3%',
        justifyContent: 'center'
    },
    textStyle: {
        borderRadius: 10,
        color: 'red',
        backgroundColor: '#D3D3D3',
        width: '45%',
        textAlign: 'center'
    },
    labelStyle: {
        fontSize: 20,
        flex: 1,
        paddingTop: '1%'
    },
    inputStyle: {
        flex: 3,
        fontSize: 17
    }
});


export default InputComponent;

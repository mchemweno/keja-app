import React from 'react';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import vars from "../../env";
import {Dimensions, StyleSheet} from "react-native";


const Search = (props) => {
    return (
        <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={3}
            autoFocus={false}
            returnKeyType={'search'}
            keyboardAppearance={'light'}
            listViewDisplayed='auto'
            fetchDetails={true}
            renderDescription={row => row.description}
            onPress={(data, details = null) => {
                const latDelta = details.geometry.viewport.northeast.lat - details.geometry.viewport.southwest.lat;
                props.setCoordinatesHandler(
                    details.geometry.location.lat,
                    details.geometry.location.lng,
                    latDelta
                );
                props.setIsSearchHandler(false);
            }}

            getDefaultValue={() => ''}

            query={{
                key: vars.googleApiKey,
                language: 'en', // language of the results
                types: ''
            }}

            styles={{
                textInputContainer: {
                    backgroundColor: 'white',
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                },
                container: {
                    opacity: 0.7,
                    width: Dimensions.get('window').width / 1.2,
                },
            }}

            nearbyPlacesAPI='GooglePlacesSearch'
        />

    )
};
export default Search;

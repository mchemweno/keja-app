import {FETCH_HOUSES, FETCH_HOUSES_CATEGORY, FETCH_HOUSES_RANDOM, SET_FILTERS} from "../actions/houses";
import {useSelector} from "react-redux";

const initialState = {
    houses: null,
    housesCategory: null,
    housesRandom: null
}


const housesReducer = (state = initialState, action) => {

    switch (action.type) {
        case FETCH_HOUSES:
            const filteredHouses = filterMethod(action.houses, action.filters);
            if (state.houses === null) {
                return {
                    ...state,
                    houses: filteredHouses
                }
            } else {
                const intersection = state.houses.filter(house => action.houses.includes(house))
                return {
                    ...state,
                    houses: [...new Set([...intersection, ...filteredHouses])]
                }
            }
        case FETCH_HOUSES_CATEGORY:
            const filteredHouseCategory = filterMethod(action.houses, action.filters);
            return {
                ...state,
                housesCategory: filteredHouseCategory
            }

        case FETCH_HOUSES_RANDOM:
            return  {
                ...state,
                housesRandom: action.houses
            }

        default:
            return state
    }

}


const filterMethod = (houses, filters) => {
    const dstv = filters.dstv;
    const wifi = filters.wifi;
    const price = filters.price;
    const rooms = filters.rooms;

    const filteredHouses = houses.filter((house) => {
        if (dstv && !house.properties.amenities.dstv) {
            return false
        }
        if (wifi && !house.properties.amenities.wifi) {
            return false
        }
        if (house.properties.price < price.low || house.properties.price > price.high ) {
            return false
        }
        if (house.properties.rooms < rooms.low || house.properties.rooms > rooms.high ) {
            return false
        }
        return true
    });
    return filteredHouses;
};



export default housesReducer;

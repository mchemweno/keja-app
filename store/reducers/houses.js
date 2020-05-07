import {FETCH_HOUSES, FETCH_HOUSES_CATEGORY, FETCH_HOUSES_RANDOM} from "../actions/houses";

const initialState = {
    houses: null,
    housesCategory: null,
    housesRandom: null
}


const housesReducer = (state = initialState, action) => {

    switch (action.type) {
        case FETCH_HOUSES:
            if (state.houses === null) {
                return {
                    ...state,
                    houses: action.houses
                }
            } else {
                const intersection = state.houses.filter(house => action.houses.includes(house))
                return {
                    ...state,
                    houses: [...new Set([...intersection, ...action.houses])]
                }
            }
        case FETCH_HOUSES_CATEGORY:
            return {
                ...state,
                housesCategory: action.houses
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


export default housesReducer;

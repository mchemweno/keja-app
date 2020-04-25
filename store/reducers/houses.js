import {FETCH_HOUSES} from "../actions/houses";

const initialState = {
    houses: null
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

        default:
            return state
    }

}


export default housesReducer;

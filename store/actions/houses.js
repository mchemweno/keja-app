export const FETCH_HOUSES = 'FETCH_HOUSES';
export const CREATE_HOUSE = 'CREATE_HOUSE';

const domain = 'https://keja-app-backend.herokuapp.com';


export const fetchHouses = () => {
    return async (dispatch) => {
        let houses;
        try {

            const response = await fetch(`${domain}/houses/`,
                {
                    method: 'GET'
                })


            const resData = await response.json();

            houses = resData.features;

            if (response.status != 200) {
                throw new Error('Something went wrong')
            }
        } catch (err) {
            return err
        }

        dispatch({
            type: FETCH_HOUSES,
            houses: houses
        })

    }
};

export const createHouse = (name, category, rooms, price, location, wifi, dstv, images) => {

    const owner = 1;
    return async (dispatch) => {
        try {
            const response = await fetch(`${domain}/houses/create_house`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    category: category,
                    price: price,
                    location: {
                        type: "point",
                        coordinates: [
                            location.lng,
                            location.lat
                        ]
                    },
                    amenities: {
                        wifi: wifi,
                        Dstv: dstv,
                    },
                    images: [image],
                    owner: owner
                })
            })

            if (response.status != 201) {
                throw new Error("Something went wrong");
            }

        } catch (err) {
            throw err;
        }

    }
}

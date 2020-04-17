import {objectToFormData} from "object-to-formdata";

export const FETCH_HOUSES = 'FETCH_HOUSES';
export const CREATE_HOUSE = 'CREATE_HOUSE';

const domain = 'https://keja-app-backend.herokuapp.com';


export const fetchHouses = () => {
    return async (dispatch) => {
        let houses;
        try {

            const response = await fetch(`${domain}/houses/all_houses`,
                {
                    method: 'GET'
                })

            const resData = await response.json();

            houses = resData.features;

            if (response.status != 200) {
                console.log("hey")
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
    const myObj = {
        name: name,
        category: category,
        price: price,
        location:
            {
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
        owner: owner
    };

    const formData = objectToFormData(myObj);

    console.log(formData);

    const imageName = images[0].uri.split('/').pop();
    const imageType = imageName.split('.').pop();

    let pic = {
        name: imageName,
        type: "image/png",
        uri: images[0].uri
    }

    formData.append("master_image", pic, pic.name);

    return async (dispatch) => {
        try {
            const response = await fetch(`${domain}/houses/create_house`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            })


            if (response.status != 201) {
                console.log("hey");
                throw new Error("Something went wrong");
            }

        } catch (err) {
            throw err;
        }

    }
}

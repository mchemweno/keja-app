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
        amenities: {
            wifi: wifi,
            Dstv: dstv,
        },
        owner: owner
    };
    const pic = imageProcessor(images[0]);
    const formData = objectToFormData(myObj);
    formData.append("master_image", pic, pic.name);
    formData.append("location", `{\n        \"type\": \"Point\",\n        \"coordinates\": [\n            ${location.lng},\n            ${location.lat}\n        ]\n    }`);

    const imagesFormData = new FormData();
    images.map((image, index) => {
        const imagePic = imageProcessor(image);
        imagesFormData.append("image" + index, imagePic, imagePic.name);
    })

    return async (dispatch) => {
        try {
            const response = await fetch(`${domain}/houses/create_house`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            })

            if (response.status != 201) {
                throw new Error("Something went wrong");
            }

            const resData = await response.json();
            const newHouseId = resData['id']

            imagesFormData.append("houseId", newHouseId);
            console.log(imagesFormData);

            try {
                const response = await fetch(`${domain}/houses/house_images`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                    body: imagesFormData
                });
                if (response.status != 201) {
                    throw new Error("Something went wrong");
                }
            } catch (err) {

            }

        } catch (err) {
            throw err;
        }

    }
}


const imageProcessor = (image) => {


    const imageName = image.uri.split('/').pop();
    const imageType = 'image/' + imageName.split('.').pop();

    const pic = {
        name: imageName,
        type: imageType,
        uri: image.uri
    }

    return pic

};

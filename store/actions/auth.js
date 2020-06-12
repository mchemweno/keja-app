import {objectToFormData} from "object-to-formdata";

export const domain = 'https://keja-app-backend.herokuapp.com';

export const loginSocial = (token, backend) => {
    const myObj = {
        grant_type: 'convert_token',
        client_id: 'JN8xQTpthEVoYErHcfipm9wMjksjWanBLLYSnKsz',
        client_secret: 'e6t0QLaoeC2PtUTyhWjwIXSfa76oBFVajZizbfpGZSmEcZ4zueDnubvaNKS65cwPpKbmQENS1iOBIv5I7UTy3mmnWyEFMCAKAH6bZ6n485XlGYA9YEih7Ar6uJAyiWCD',
        backend: backend,
        token: token
    };
    const formData = objectToFormData(myObj);
    return async (dispatch) => {
        try {
            const response = await fetch(`${domain}/houses/auth/convert-token`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            })
            if (response.status != 200) {
                throw new Error("Something went wrong");
            }

            const resData = await response.json();
            console.log(resData);

        } catch (err) {
            throw err
        }
    }
};


export const loginNormal = (username, password) => {
    const myObj = {
        username: username,
        password: password
    };
    const formData = objectToFormData(myObj);

    return async (dispatch) => {
        try {
            const response = await fetch(`${domain}/houses/token/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            })
            if (response.status != 200) {
                throw new Error("Something went wrong");
            }

            const resData = await response.json();
            console.log(resData);

        } catch (err) {
            throw err
        }
    }

};

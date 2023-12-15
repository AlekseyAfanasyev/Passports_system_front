import axios, { AxiosResponse } from "axios";

export const setRequestPassports = async(request_id = 0, passport_names: string[], userToken='') : Promise<AxiosResponse> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    console.log("setRequestPassports: ", passport_names)
    return axios.put(
        '/api/border_crossing_facts/set_passports',
        {
            requestID: request_id,
            passports: passport_names
        },
        config
    )
    .then((response) => response)
}
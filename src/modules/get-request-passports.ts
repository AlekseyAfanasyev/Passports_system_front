import { Passport } from "./ds"

import axios from "axios"

export const getRequestPassports = async(request_id = 0, userToken = ''): Promise<Passport[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        '/api/border_crossing_passport/' +  String(request_id),
        config)
        .then((response) => {
            const {data} = response

            return data;
        })
}
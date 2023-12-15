import axios from "axios";

export const setRequestPassports = async(request_id = 0, passport_names: string[], userToken='') : Promise<string> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.put(
        '/api/border_crossing_facts/set_passports',
        {
            requestID: request_id,
            passports: passport_names
        },
        config
    )
    .then((response) => response.data)
}
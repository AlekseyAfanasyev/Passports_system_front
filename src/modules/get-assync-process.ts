import axios from "axios"

export const getAsyncProcessed = async(userToken = ''): Promise<number> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        '/api/manage_passports/async_processed',
        config)
        .then((response) => {
            const {data} = response

            return data;
        })
}
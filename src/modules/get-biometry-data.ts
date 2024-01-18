import axios from "axios"

export const getExtractionData = async(request_id = 0, userToken = ''): Promise<number[][]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        '/api/manage_passports/' +  String(request_id) + '/biometry',
        config)
        .then((response) => {
            const {data} = response

            return data;
        })
}
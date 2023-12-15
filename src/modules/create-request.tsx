import axios from "axios";

export const createRequest = async(passports: string[], userToken: string): Promise<string> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }
    return axios.put(
        '/api/border_crossing_fact/create',
        {
          'passports': passports,
        },
        config

    )
    .then((response) => response.data);
}
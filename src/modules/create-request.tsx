import axios, { AxiosResponse } from "axios";

export const createRequest = async(passports: string[], userToken: string): Promise<AxiosResponse> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }
      return axios.post(
        '/api/border_crossing_facts/create',
        {
          'passports': passports,
        },
        config

    )
    .then((response) => response);
}
import axios, { AxiosResponse } from "axios";

export const createRequest = async(passport: string, userToken: string): Promise<AxiosResponse> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
      }
      return axios.post(
        `/api/Passports_system_front/${encodeURIComponent(passport)}/add`,
        {
          'passport': passport,
        },
        config

    )
    .then((response) => response);
}

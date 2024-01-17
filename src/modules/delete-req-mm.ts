import axios, { AxiosResponse } from "axios";

export const deletePassportTransfer = async(passport: string, req: string | null, userToken: string): Promise<AxiosResponse> => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
        },
    };

    return axios.delete(
        `/api/border_crossing_passports/delete_single`,
        {
            headers: config.headers,
            data: {
                passport: passport,
                req: req
            },
        }
    )
    .then((response) => response);
}
import axios, { AxiosError } from 'axios';

import { BorderCrossingFactRequest } from './ds';

export const getDetailedReq = async (userToken = '', req_id = ''): Promise<BorderCrossingFactRequest> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
            'Accept': 'application/json'
        },
    };

    try {
        const response = await axios.get(`/api/border_crossing_facts/${encodeURIComponent(req_id)}`, config);
        const { data } = response;
        console.log(data);
        return data;
    } catch (error) {
        if ((error as AxiosError).response && (error as AxiosError).response?.status === 403) {
            throw new Error('403');
        } else {
            console.error("Ошибка при выполени запроса:", error);
            throw error;
        }
    }
};
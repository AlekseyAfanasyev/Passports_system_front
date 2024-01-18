import axios, {AxiosError} from 'axios';

import {BorderCrossingFactRequest} from './ds';

export const getTransfReqs = async (
    userToken = '',
    status = '', 
    dateStart: string | null, 
    dateFin: string | null,
    //client: string | null,
    ): Promise<BorderCrossingFactRequest[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
};
const queryParams = new URLSearchParams({
    status: status,
    date_start: dateStart || "",
    date_fin: dateFin || "",
    //client: client || "",
});

return axios.get(`/api/border_crossing_facts?${queryParams.toString()}`, config)
    .then((response) => {
        const { data } = response;
        return data;
    });
};

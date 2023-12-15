import axios from 'axios'

import {BorderCrossingFactRequest} from './ds'

export const getTransfReqs = async (userToken = '', status = ''): Promise<BorderCrossingFactRequest[]> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken,
        },
    }
    return axios.get(
        `/api/border_crossing_facts` + status,
        config,
    )
    .then((response) => {
        const { data } = response
        console.log(data)
        return data;
    }) 

}
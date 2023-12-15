import axios from "axios";
import { BorderCrossingFactRequest } from './ds'

export const changeReqStatus = async (userToken = '', request: BorderCrossingFactRequest): Promise<string> => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userToken,
      },
    }
    return axios.put(
      '/api/border_crossing_facts/change_status',
      {
        reqID: request.ID,
        status: request.Status,
      },
      config

    )    
    .then((response) => response.data);
}
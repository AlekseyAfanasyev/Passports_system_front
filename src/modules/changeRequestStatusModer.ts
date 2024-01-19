import { BorderCrossingFactRequest } from './ds'
import axios from 'axios';

export const changeReqStatusModer = async (userToken = '', request: BorderCrossingFactRequest): Promise<string> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  }
  return axios.put(
    `/api/border_crossing_facts/${encodeURIComponent(request.ID)}/change_status_moder`,
    {
      status: request.Status,
    },
    config

  )
    .then((response) => response.data);
}
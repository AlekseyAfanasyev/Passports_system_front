import axios from 'axios';

export const changeReqStatusClient = async (userToken = '', reqID: number): Promise<string> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  }
  return axios.put(
    `/api/border_crossing_facts/${encodeURIComponent(reqID)}/change_status_client`,
    config
  )
    .then((response) => response.data);
}
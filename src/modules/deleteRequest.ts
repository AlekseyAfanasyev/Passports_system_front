import axios from 'axios';

export const deleteBRequest = async (userToken = '', reqID: number): Promise<string> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  };

  return axios.delete(`/api/border_crossing_facts/${encodeURIComponent(reqID)}/delete`, config)
    .then((response) => response.data);
};
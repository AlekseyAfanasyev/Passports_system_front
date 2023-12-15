import axios from 'axios';

export const changePassportStatus = async (userToken = '', passport_name: string): Promise<void> => {
  try {
    const response = await axios.delete(`api/change_passport_availibility/${passport_name}`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken,
      },
  });

  if (response.status === 200) {
  } else {
      throw new Error('Ошибка при изменении статуса орбиты');
  }
  } catch (error) {
    throw new Error('Ошибка при изменении статуса паспорта');
  }
};


import { Passport } from './ds';
import axios from 'axios';

export const editPassport = async (userToken = '', passport: Passport): Promise<Passport> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  };

  const { ID, Name, Seria, Issue, Code, Gender, Birthdate, BDplace, Image } = passport;

  try {
    const response = await axios.put(
      `/api/Passports_system_front/${encodeURIComponent(Seria)}/edit`,
      {
        ID,
        Name,
        Seria,
        Issue,
        Code,
        Gender,
        Birthdate,
        BDplace,
        Image
      },
      config
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
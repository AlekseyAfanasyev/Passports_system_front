import { Passport } from './ds'
import axios from 'axios';

export const addNewPassport = async (userToken = '', passport: Passport): Promise<Passport> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
    },
  }
  console.log(passport)
  return axios.post(
    `/api/passports/add_new_passport`,
    {
        Name: passport.Name,
        Seria: passport.Seria,
        Issue: passport.Issue,
        Code: passport.Code,
        Gender: passport.Gender,
        Birthdate: passport. Birthdate,
        BDplace: passport.BDplace,
        Image: passport.Image
    },
    config

  )
    .then((response) => response.data);
}
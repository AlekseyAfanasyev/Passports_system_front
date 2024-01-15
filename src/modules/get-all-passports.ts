import { Passport } from './ds';
import axios from 'axios';

export const getAllPassports = async (passportName = '', passportIsGender = '') : Promise<Passport[]> => {
    try {
        const queryParams = new URLSearchParams({
          passport_name: passportName,
          passport_gender: passportIsGender,
        });

        const response = await axios.get(`/api/passports?${queryParams.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Ошибка при получении паспортов:', error);
        return [{
            "ID": 0,
            "Name": "Нет информации",
            "IsFree": false,
            "Seria":"Нет информации",
            "Issue": "Нет информации",
            "Code": "Нет информации",
            "Gender": "Нет информации",
            "Birthdate": "Нет информации",
            "BDplace": "Нет информации",
            "Image": "./DEFAULT.jpg"
        }];
      }
    };

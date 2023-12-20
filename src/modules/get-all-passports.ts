import { Passport } from './ds';
import axios from 'axios';

export const getAllPassports = async (passportName = '') : Promise<Passport[]> => {
    try {
        const response = await axios.get(`/api/passports?passport_name=${encodeURIComponent(passportName)}`);
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

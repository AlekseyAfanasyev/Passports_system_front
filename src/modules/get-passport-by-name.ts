import {Passport} from './ds'
import axios from 'axios';

export const getPassportByName = async  (passportName = ''): Promise<Passport> => {
    try {
        const response = await axios.get(`/api/passports/${encodeURIComponent(passportName)}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при получении паспортов:', error);
        return {
        "ID": 1,
        "Name": "Нет информации",
        "IsFree": false,
        "Seria":"Нет информации",
        "Issue": "Нет информации",
        "Code": "Нет информации",
        "Gender": "Нет информации",
        "Birthdate": "Нет информации",
        "BDplace": "Нет информации",
        "Image": "./DEFAULT.jpg"
    };
}
};


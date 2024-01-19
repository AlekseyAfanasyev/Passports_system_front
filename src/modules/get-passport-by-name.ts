import { Passport } from './ds'
import axios from 'axios';
import { passportsData } from './get-all-passports';

export const getPassportByName = async (passportName = ''): Promise<Passport> => {
    try {
        const response = await axios.get(`/api/Passports_system_front/${encodeURIComponent(passportName)}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка 2:', error);
        const defaultPassport = passportsData.find(passport => passport.Name === passportName);

        // Если орбита найдена, возвращаем её, иначе возвращаем значения по умолчанию
        return defaultPassport || {
            ID: 0,
            Name: "Нет информации",
            IsFree: false,
            Seria: "Нет информации",
            Issue: "Нет информации",
            Code: "Нет информации",
            Gender: "Нет информации",
            Birthdate: "Нет информации",
            BDplace: "Нет информации",
            Image: " "
        };
    }
}

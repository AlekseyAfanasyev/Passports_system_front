import { Passport } from './ds';
import axios from 'axios';

export const passportsData = [
  {
    ID: 1,
    Name: "Афанасьев Александр Анатольевич",
    IsFree: true,
    Seria:"4516 999432",
    Issue: "11.05.2023",
    Code: "770-045",
    Gender: "МУЖ.",
    Birthdate: "11.03.1992",
    BDplace: "Город Москва",
    Image: "../Passports_system_front/AAA.jpg"
  },
  {
    ID: 2,
    Name: "Лаптев Григорий Сергеевич",
    IsFree: true,
    Seria:"8866 343789",
    Issue: "23.09.2020",
    Code: "225-189",
    Gender: "МУЖ.",
    Birthdate: "26.12.2000",
    BDplace: "Город Москва",
    Image: "../Passports_system_front/LGS.jpg"
  },
  {
    ID: 6,
    Name: "Яковлева София Ивановна",
    IsFree: true,
    Seria:"9192 10902222",
    Issue: "18.06.2018",
    Code: "398-330",
    Gender: "ЖЕН.",
    Birthdate: "27.04.2002",
    BDplace: "Город Санкт-Петербург",
    Image: "../Passports_system_front/YSI.jpg"
  }]


  export const getAllPassports = async (passportName = '', passportIsGender = ''): Promise<Passport[]> => {
    try {
        const queryParams = new URLSearchParams({
            passport_name: passportName,
            passport_gender: passportIsGender,
        });

        const response = await axios.get(`/api/Passports_system_front?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching passports:', error);
        if (passportName !== '' || passportIsGender !== '') {
            let filteredPassports = passportsData.filter(passport =>
                passportName === '' || passport.Name.toLowerCase().includes(passportName.toLowerCase()));

            if (passportIsGender === '1') {
                filteredPassports = filteredPassports.filter(passport => passport.Gender === 'МУЖ.');
            } else if (passportIsGender === '0') {
                filteredPassports = filteredPassports.filter(passport => passport.Gender === 'ЖЕН.');
            }

            return filteredPassports; // Вернуть массив Passport[]
        } else {
            return passportsData; // Вернуть массив Passport[]
        }
    }
}
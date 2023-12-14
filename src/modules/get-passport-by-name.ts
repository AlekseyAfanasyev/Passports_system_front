import {Passport} from './ds'

export const getPassportByName = async  (passportName = ''): Promise<Passport> => {
    return fetch('/api/passports/' + String(passportName),{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .catch(() => ({
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
    }));
}

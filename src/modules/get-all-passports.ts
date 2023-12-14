import { Passport } from './ds';

export const getAllPassports = async (passportName = '') : Promise<Passport[]> => {
    return fetch('/api/passports?passport_name=' + String(passportName))
    .then((response) => response.json())
    .catch (() => ([{
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
  }]
  ))
}
import {Passport} from './ds'

export const getPassportByName = async  (passportName = ''): Promise<Passport> => {
    return fetch('/api/passports/' + String(passportName),{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json());
}

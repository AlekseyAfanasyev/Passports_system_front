import { Passport } from './ds';

export const getAllPassports = async (passportName = '') : Promise<Passport[]> => {
    return fetch('/api/passports?passport_name=' + String(passportName))
        .then((response) => {
            console.log("get-all-passport");
            return response.json()
            .catch(() => ({ resultCount: 0, results:[]}));
        })
}
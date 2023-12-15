export interface Passport {
    ID: number,
    Name: string,
    IsFree: boolean,
    Seria: string,
    Issue: string,
    Code: string,
    Gender: string,
    Birthdate: string,
    BDplace: string,
    Image: string
}

export interface User {
    UUID: string,
    Name: string,
    Role: number,
    Pass: string
}

export interface BorderCrossingFactRequest {
    ID: number,
    ClientRefer: string,
    Client: User,
    ModerRefer: string,
    Moder: User,
    Status: string,
    DateCreated: string,
    DateProcessed: string,
    DateFinished: string,
}

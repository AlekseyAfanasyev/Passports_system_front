import React, { FC, useEffect, useState } from 'react';
import './styles/style.css';
import { Passport } from '../modules/ds';
import { getAllPassports } from '../modules/get-all-passports';
import PassportCard from '../components/PassportCard';
import NavigationMain from '../components/NavigationMain';
import Breadcrumbs from '../components/Breadcrumbs';


const PassportsPage: FC = () => {
    const [passports, setPassports] = useState<Passport[]>([]);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var passportName = urlParams.get('passport_name') || '';
        setSearchText(passportName);

        const loadPassports = async () => {
            try {
                const result = await getAllPassports(passportName);
                setPassports(result);
            } catch (error) {
                console.error("Ошибка при загрузке объектов:", error);
            }
        }

        loadPassports();
    }, []);

    const handleStatusChange = (passportName: string, newStatus: boolean) => {
        setPassports((passports) =>
            passports.map((passport) =>
                passport.Name === passportName ? { ...passport, IsFree: newStatus } : passport
            )
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = `/passports?passport_name=${searchText}`;
    };

    return (
        <div>
            <NavigationMain/>
            <Breadcrumbs/>
            <div className="search-form">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        id="passport_search"
                        name="passport_name"
                        placeholder="Введите название"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <input type="submit" className="button" value="Поиск"/>
                </form>
            </div>
            <div className="card_group">
                {passports.map((passport, index) => (
                    <PassportCard
                        key={index}
                        imageUrl={passport.Image}
                        passportName={passport.Name}
                        passportStatus={passport.IsFree}
                        passportDetailed={`/passports/${passport.Name}`}
                        changeStatus={`/passports/change_status/${passport.Name}`}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default PassportsPage;

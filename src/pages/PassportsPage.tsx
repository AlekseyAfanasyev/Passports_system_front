import { FC, useEffect, useState } from 'react';
import '../styles/style.css';
import { Passport } from '../modules/ds';
import { getAllPassports } from '../modules/get-all-passports';
import PassportCard from '../components/PassportCard/PassportCard';
import SearchForm from '../components/SearchForm/SearchForm';


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
        setPassports((passports) => passports.filter((passport) => passport.Name !== passportName));
    };


    return (
        <div>
            <SearchForm
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchSubmit={(searchText) => {
            window.location.href = `/passports?passport_name=${searchText}`;
          }}
      />
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

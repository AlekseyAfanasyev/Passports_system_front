import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Col, Row, Modal, Button } from 'react-bootstrap'
import '../styles/style.css';
import { Passport } from '../modules/ds';
import { getAllPassports } from '../modules/get-all-passports';
import store, { useAppDispatch } from '../store/store';
import cartSlice from '../store/cartSlice';
import PassportCard from '../components/PassportCard/PassportCard';
import SearchForm from '../components/SearchForm/SearchForm';


const PassportsPage: FC = () => {
    const [passports, setPassports] = useState<Passport[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const dispatch = useAppDispatch()

    const { added } = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

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

    const handleModalClose= () => {
        dispatch(cartSlice.actions.disableAdded())
    }


    return (
        <div>
            <Modal show = {added} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Паспорт добавлен в заявку</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <button onClick={() => { dispatch(cartSlice.actions.disableAdded()) }}>
            Закрыть
          </button>
        </Modal.Footer>
      </Modal>
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

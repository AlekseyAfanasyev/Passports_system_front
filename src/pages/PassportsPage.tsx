import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import '../styles/style.css';
import { Passport } from '../modules/ds';
import { getAllPassports } from '../modules/get-all-passports';
import store, { useAppDispatch } from '../store/store';
import cartSlice from '../store/cartSlice';
import PassportCard from '../components/PassportCard/PassportCard';
import SearchForm from '../components/SearchForm/SearchForm';
import { useNavigate } from 'react-router-dom';
import filtersSlice from "../store/filtersSlice";
import PassportFilter from '../components/PassportFilter/PassportFilter';
import loadTransfReq from '../modules/load-reqs';
import { getRequestPassports } from '../modules/get-request-passports';
import getRequestByStatus from '../modules/get-req-by-status';
import CartButton from '../components/CartButton/CartButton';


const PassportsPage: FC = () => {
    const [passports, setPassports] = useState<Passport[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const dispatch = useAppDispatch()
    const navigate= useNavigate()
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const { added } = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

    const { passportName } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
    const [name, setName] = useState(passportName);

    const { passportIsGender } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
    const [isGender, setIsGender] = useState(passportIsGender);


    useEffect(() => {

      const loadDraftRequest = async () => {
        const result = (await getRequestByStatus(userToken?.toString(), userRole, userName, 'Черновик'))
        if (!result) {
          return
        }

        if (result[0]?.ID) {
          localStorage.setItem("reqID", result[0].ID.toString());
          const passportsData = await getRequestPassports(result[0].ID, userToken?.toString());
          var passportNames: string[] = [];
          if (passportsData) {
            for (let passport of passportsData) {
              passportNames.push(passport.Name);
            }
            dispatch(cartSlice.actions.setPassports(passportNames));
          }
        };
      }
      loadDraftRequest()

         
        const loadPassports = async () => {
            try {
                const result = await getAllPassports(name?.toString(), isGender?.toString());
                setPassports(result);
            } catch (error) {
                console.error("Ошибка при загрузке объектов:", error);
            }
        }

        loadPassports();
    }, []);

    const applyFilters = async () => {
      try {
        const data = await getAllPassports(name?.toString(), isGender?.toString());
        dispatch(filtersSlice.actions.setPassportName(name));
        dispatch(filtersSlice.actions.setPassportIsGender(isGender));
  
        setPassports(data);
  
        navigate('/passports', { state: { data } });
      } catch (error) {
        console.error("Ошибка при получении паспортов:", error);
      }
    };
  
    const clearFilters = async () => {
      setName('');
      setIsGender('');
  
      dispatch(filtersSlice.actions.setPassportName(''));
      dispatch(filtersSlice.actions.setPassportIsGender(''));
  
      try {
        const data = await getAllPassports();
        setPassports(data);
      } catch (error) {
        console.error("Error loading all passports:", error);
      }
  
    };

    const handleStatusChange = (passportName: string, newStatus: boolean) => {
        setPassports((passports) =>
            passports.map((passport) =>
                passport.Name === passportName ? { ...passport, IsFree: newStatus } : passport
            )
        );
        setPassports((passports) => passports.filter((passport) => passport.Name !== passportName));
    };

    const handleModalClose = () => {
        dispatch(cartSlice.actions.disableAdded())
    }


    return (
        <div>
          {userToken && userRole === '2' && <Button 
      onClick={() => (navigate(`/passports/add_new_passport`))} className='cart-button'> Новый паспорт </Button>}
            <Modal show = {added} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Паспорт добавлен в заявку</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <button onClick ={() => { dispatch(cartSlice.actions.disableAdded()) }}>
            Закрыть
          </button>
        </Modal.Footer>
      </Modal>
      {userToken && userRole === '1' && <CartButton/>}
      <PassportFilter
        name={name}
        isGender={isGender}
        setName={setName}
        setIsGender={setIsGender}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />
            <div className="card_group">
                {passports.map((passport, index) => (
                    <PassportCard
                        key={index}
                        imageUrl={passport.Image}
                        passportName={passport.Name}
                        passportStatus={passport.IsFree}
                        changeStatus={`/passports/change_status/${passport.Name}`}
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default PassportsPage;

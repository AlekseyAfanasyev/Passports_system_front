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
import PassportTable from '../components/PassportTable/PassportTable';
import { changePassportStatus } from '../modules/change-passport-status';
import { useNavigate } from 'react-router-dom';
import filtersSlice from "../store/filtersSlice";
import PassportFilter from '../components/PassportFilter/PassportFilter';
import { getRequestPassports } from '../modules/get-request-passports';
import getRequestByStatus from '../modules/get-req-by-status';
import CartButton from '../components/CartButton/CartButton';
import { BsGrid, BsTable } from 'react-icons/bs';



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
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    const ToggleIcon = viewMode === 'table' ? BsGrid : BsTable;

    const toggleViewMode = () => {
      setViewMode((prevMode) => (prevMode === 'table' ? 'cards' : 'table'));
    };


    useEffect(() => {

      const loadDraftRequest = async () => {
        const result = (await getRequestByStatus(userToken?.toString(), 
                      userRole, userName, 'Черновик', '', '', /*''*/))
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

    const handleStatusChange = async (passportName: string, newStatus: boolean) => {
      setIsStatusChanging(true);
  
      try {
        await changePassportStatus(userToken?.toString(), passportName);
  
        setPassports((passports) =>
          passports.map((passport) =>
            passport.Name === passportName ? { ...passport, IsAvailable: newStatus } : passport
          )
        );
  
        setPassports((passports) => passports.filter((passport) => passport.Name !== passportName));
  
      } catch (error) {
        console.error('Error while changing passport status:', error);
      } finally {
        setIsStatusChanging(false);
        navigate('/passports');
      }
    };

    const handleModalClose = () => {
        dispatch(cartSlice.actions.disableAdded())
    }


    return (
        <div>
      {userToken && userRole === '1' && <CartButton />}
      {userToken && userRole === '2' && (
        <Button onClick={() => navigate(`/passports/add_new_passport`)} className='cart-button'>
          Новый паспорт
        </Button>
      )}
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
      {userToken && userRole === '2' && (
        <>
        <Button 
      onClick={() => (navigate(`/passports/add_new_passport`))} className='cart-button'> Новый паспорт </Button>
      <div className='toggle-view-icon' onClick={toggleViewMode}>
            <ToggleIcon style={{ position: 'absolute', left: '20px', marginTop: '100px' }} size={40} />
          </div>
          </>
      )}
      <PassportFilter
        name={name}
        isGender={isGender}
        setName={setName}
        setIsGender={setIsGender}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />
      {userRole === '2' ? (
        <PassportTable
          passports={passports}
          handleStatusChange={handleStatusChange}
          isStatusChanging={isStatusChanging} />
      ) : (
            <div className="card_group">
                {passports.map((passport, index) => (
                  <div key={index} className="passport-card">
                    <PassportCard
                        imageUrl={passport.Image}
                        passportName={passport.Name}
                        passportStatus={passport.IsFree}
                        changeStatus={`/passports/change_status/${passport.Name}`}
                        onStatusChange={handleStatusChange}
                        />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            
            };

export default PassportsPage;

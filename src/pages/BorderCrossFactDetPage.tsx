import React, { FC, useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { Form, FormGroup, Button, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import Select from 'react-select';
import { getDetailedReq } from '../modules/get-detailed-request';
import { getRequestPassports } from "../modules/get-request-passports";
import { setRequestPassports } from "../modules/set-request-passports";
import { changeReqStatus } from "../modules/change-req-status";
import { BorderCrossingFactRequest } from "../modules/ds";
import store, { useAppDispatch } from '../store/store';
import { Passport } from '../modules/ds';
import { getAllPassports } from "../modules/get-all-passports";
import "../styles/BorderCrossFactDetPage.styles.css";
import cartSlice from "../store/cartSlice";
import { AxiosError } from 'axios';


const BorderCrossFactDetPage: FC = () => {

    const newPassportInputRef = useRef<any>(null);
    const dispatch = useAppDispatch()
    const [passportNames, setPassportNames] = useState<string[]>();
    const [newPassport, setNewPassport] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    
    const [reqId, setReqId] = useState(0);
    const [req, setReq] = useState<BorderCrossingFactRequest | undefined>();

    const [options, setOptions] = useState<Passport[]>([]);
    const [selectedPassport, setSelectedPassport] = useState<Passport | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const pathname = window.location.pathname;
        const parts = pathname.split('/');
        const reqIdString = parts[parts.length - 1];

        if (reqIdString) {
            setReqId(+reqIdString);
        }

        const loadReq = async () => {
            try {
                const loadedReq = await getDetailedReq(userToken?.toString(), String(reqIdString));
                setError(null);
                setReq(loadedReq);
            } catch (error) {
                if ((error as AxiosError).message === '403') {
                    setError("403 Доступ запрещен");
                } else {
                    setError("500 Ошибка загрузки заявки");
                }
            }
            if (userToken === null) {
                return;
            }

            const passports = await getRequestPassports(+reqIdString, userToken);
            var passportNames: string[] = [];
            if (passports) {
                for (let passport of passports) {
                    passportNames.push(passport.Name);
                }
                setPassportNames(passportNames);
                if (req?.Status == 'Черновик'){
                    localStorage.setItem("passports", passportNames.join(","));
                }
            }
        };
        const fetchPassports = async () => {
            const passports = await getAllPassports();
            setOptions(passports);
        };

        loadReq();
        fetchPassports();
    }, [userToken]);

    if (error) {
        return (
          <div style={{ textAlign: 'center', fontSize: '2em', margin: 'auto' }}>
            {error}
          </div>
        );
      }

    const removePassport = (removedPassportName: string) => {
        return (event: React.MouseEvent) => {
            if (!passportNames) {
                return;
            }

            dispatch(cartSlice.actions.removePassport(removedPassportName))
            setPassportNames(passportNames.filter(function (passportName) {
                return passportName !== removedPassportName;
            }));

            event.preventDefault();
        };
    };

    const addPassport = () => {
        if (!selectedPassport || !selectedPassport.Name || !passportNames) {
            return;
        }

        const passportNameToAdd = selectedPassport.Name;

        if (passportNames.includes(passportNameToAdd)) {
            console.error('Паспорт уже добавлен:', passportNameToAdd);
            return;
        }

        dispatch(cartSlice.actions.addPassport(passportNameToAdd))
        setPassportNames([...passportNames, passportNameToAdd]);

        setNewPassport('');

        if (newPassportInputRef.current != null) {
            newPassportInputRef.current.value = '';
        }
    }

    const handleErrorClose = () => {
        setShowError(false);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        if (req?.Status != 'Черновик') {
            window.location.href = '/passports';
        }
    };

    const sendChanges = async (status: string) => {
        if (!userToken) {
            return;
        }

        var req_id = 0;
        

        if (req?.ID !== undefined) {
            req_id = req?.ID;
        }

        const editResult = await changeReqStatus(userToken, {
            ID: req_id,
            Status: status,
        });
        console.log(editResult);


        if (!passportNames || !userToken) {
            return;
        }
        if (status !== 'Удалена') {
            const passportsResult = await setRequestPassports(req?.ID, passportNames, userToken);
            if (passportsResult.status === 201) {
                setShowSuccess(true);
            } else {
                setShowError(true);
            }
            console.log(passportsResult);
            if (status != 'Черновик'){
                localStorage.setItem("passports", '')
                window.location.href = '/passports';
            }
        } else {
            localStorage.setItem("passports", '')
            setPassportNames([]);
        }
    };

    return (
        <div className="container">
            <Modal show={showError} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Произошла ошибка, заявка не была обновлена</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleErrorClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Обновление заявки прошло успешно!</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <h1>Заявка #{req?.ID}</h1>
            <p>Статус: {req?.Status}</p>
            <h4>Паспорта:</h4>
            <ListGroup className="list-group" style={{ width: '500px' }}>
                {passportNames?.map((passportName, passportID) => (
                    <ListGroupItem key={passportID} className="list-group-item">
                        {passportName}
                        {req?.Status === 'Черновик' && (
                            <span className="button-group">
                                <Button variant="danger" onClick={removePassport(passportName)}>Удалить</Button>
                            </span>
                        )}
                    </ListGroupItem>
                ))}
            </ListGroup>
            {req?.Status === 'Черновик' && (
                <div className="input-group">
                    <Select
                        options={options.map(option => ({ value: option.Name, label: option.Name }))}
                        value={selectedPassport ? { value: selectedPassport.Name, label: selectedPassport.Name } : null}
                        onChange={(value) => setSelectedPassport(options.find(option => option.Name === value?.value) || null)}
                        isSearchable
                        placeholder="Выберите паспорт..."
                    />
                    <Button onClick={addPassport} className="button">Добавить</Button>
                </div>
            )}
            <Form>
                {req?.Status === 'Черновик' && (
                    <Button onClick={() => sendChanges('Черновик')} className="button">Сохранить изменения</Button>
                )}
                <FormGroup className="form-group">
                    {userRole === '1' && req?.Status === 'Черновик' && (
                        <>
                            <div>
                                <Button className="common-button" variant="primary" 
                                onClick={() => sendChanges('На рассмотрении')}>Сформировать</Button>
                            </div>
                            <div>
                                <Button className="common-button" variant="danger" 
                                onClick={() => sendChanges('Удалена')}>Отменить</Button>
                            </div>
                        </>
                    )}

                    {userRole === '2' && req?.Status === 'На рассмотрении' && (
                        <>
                            <div>
                                <Button className="common-button" variant="warning" 
                                onClick={() => sendChanges('Отклонена')}>Отклонить</Button>
                            </div>
                            <div>
                                <Button className="common-button" variant="success" 
                                onClick={() => sendChanges('Оказана')}>Одобрить</Button>
                            </div>
                        </>
                    )}
                </FormGroup>
            </Form>
            <div className="button-container">
                <Button href='/border_crossing_facts' className="button">К заявкам</Button>
                <Button href='/passports' className="button">К паспортам</Button>
            </div>
        </div>
    );
};

export default BorderCrossFactDetPage;
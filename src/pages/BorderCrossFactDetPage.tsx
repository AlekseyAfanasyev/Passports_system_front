import React, { FC, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Button, Col, Form, FormGroup, ListGroup, ListGroupItem, Modal, Row, Table } from "react-bootstrap";
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
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { getExtractionData } from "../modules/get-biometry-data";
import cartSlice from '../store/cartSlice';
import Cart from './CartPage';
import { changeReqStatusModer } from '../modules/changeRequestStatusModer';


const BorderCrossFactDetPage: FC = () => {

    const [passports, setPassports] = useState<Passport[]>();
    
    const [showError, setShowError] = useState(false);
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    
    const [reqId, setReqId] = useState(0);
    const [req, setReq] = useState<BorderCrossingFactRequest | undefined>();

    const [status, setStatus] = useState<string | undefined>();
    
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()
    const [extractions, setExtraction] = useState<number[][] | undefined>()
    const isInCart = useSelector((state: ReturnType<typeof store.getState>) => state.cart.isInCart);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const pathname = window.location.pathname;
        const parts = pathname.split('/');
        const reqIdString = parts[parts.length - 1];
        
        const loadReq = async () => {
            try {
                const loadedReq = await getDetailedReq(userToken?.toString(), String(reqIdString));
                setError(null);
                setReq(loadedReq);
                setStatus(loadedReq?.Status)
                if (loadedReq?.Status !== 'Черновик') {
                    dispatch(cartSlice.actions.setIsInCart(false));
                }
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

            const reqID: number = reqIdString ? parseInt(reqIdString, 10) : 0;
            const requestPassports = await getRequestPassports(reqID, userToken);
            setPassports(requestPassports);
            const extractions = await getExtractionData(+reqIdString, userToken)
            console.log("---",extractions)
            setExtraction(extractions)
        };

        loadReq();
    }, [isInCart]);

    if (error) {
        return (
            <div style={{ textAlign: 'center', fontSize: '2em', margin: 'auto' }}>
            {error}
        </div>
        );
      }

    

    const handleErrorClose = () => {
        setShowError(false);
    };
   
    const sendChanges = async (status: string) => {
        if (!userToken || req?.ID === undefined) {
            console.log("Ошибка токена или ID");
            return;
        }
        try {
            await changeReqStatusModer(userToken, {
                ID: req.ID,
                Status: status,
            });

            setStatus(status);
        } catch (error) {
            setShowError(true);
        }
    };
    return (
        <div className="container">
            {status === 'Черновик' || isInCart ? (
                <Cart />
            ) : (
                <>
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
            <h1>Заявка #{req?.ID}</h1>
            <p>Статус: {status}</p>
            {status !== 'Отклонена' && (<>
                <h4>Паспорта:</h4>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Table bordered striped style={{ width: '600px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>Имя</th>
                            <th style={{ width: '40px' }}>Картинка</th>
                            <th style={{ width: '50px' }}>Факт прохода по биометрии</th>
                        </tr>
                    </thead>
                    <tbody>
                    {passports?.map((passport) => {
                        let extraction_data: number[] | undefined;

                        if (extractions) {
                            extraction_data = extractions.find((item) => item[0] === passport.ID);
                        }

                        return (
                            <tr key={passport.ID}>
                                <td style={{ width: '50px', height: '90px' }}>
                                    {passport.Name}
                                </td>
                                <td style={{ width: '40px', height: '40px', position: 'relative' }}>
                                    {passports && (
                                        <img
                                            src={passport?.Image}
                                            onError={(e) => { e.currentTarget.src = '/DEFAULT.jpg' }}
                                            style={{ width: '50%',
                                            height: '95%',
                                            position: 'absolute',
                                            top: '40%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)' }}
                                        />
                                    )}
                                </td>
                                <td style={{ width: '50px' }}>{extraction_data ? extraction_data[1] : '-'}</td>

                            </tr>
                        );
                    })}

                        </tbody>
                </Table>
            </div>
            </>)}
            <Form>
                <FormGroup className="form-group">

                    {userRole === '2' && status === 'На рассмотрении' && (
                        <>
                            <div>
                            <Button 
                                className="common-button" 
                                variant="warning" 
                                onClick={() => sendChanges('Отклонена')}>
                                    Отклонить
                                </Button>
                            </div>
                            <div>
                            <Button 
                                className="common-button" 
                                variant="success" 
                                onClick={() => sendChanges('Оказана')}>
                                    Одобрить
                                </Button>
                            </div>
                        </>
                    )}
                </FormGroup>
            </Form>
            <Row>
                <Col>
                    <Button onClick={() => navigate('/border_crossing_facts')}
                     className="button">
                        К заявкам
                    </Button>
                </Col>
                <Col>
                    <Button onClick={() => navigate(`/passports/`)}
                     className="button">
                        К паспортам
                    </Button>
                </Col>
            </Row>
            </>
            )}
        </div>
    );
};
export default BorderCrossFactDetPage;
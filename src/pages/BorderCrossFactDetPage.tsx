import React, { FC, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Button, Col, Form, FormGroup, ListGroup, ListGroupItem, Modal, Row } from "react-bootstrap";
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


const BorderCrossFactDetPage: FC = () => {

    const [passports, setPassports] = useState<Passport[]>();
    
    const [showError, setShowError] = useState(false);
    const { userToken, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    
    const [reqId, setReqId] = useState(0);
    const [req, setReq] = useState<BorderCrossingFactRequest | undefined>();

    const [status, setStatus] = useState<string | undefined>();
    
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

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
        };

        loadReq();
    }, []);

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
            const editResult = await changeReqStatus(userToken, {
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
                <ListGroup className="list-group" style={{ width: '300px' }}>
                    {passports?.map((passport) => (
                        <ListGroupItem key={passport.ID} className="list-group-item">
                            {passport.Name}
                            {passport.Image && (
                                <img
                                    src={passport?.Image}
                                    onError={(e) => { e.currentTarget.src = '/DEFAULT.jpg' }}
                                    style={{ width: '75px', height: '75px', position: 'absolute', right: '0' }}
                                />
                            )}
                            <div style={{ width: '75px', height: '75px' }}></div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
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
        </div>
    );
}
export default BorderCrossFactDetPage;
import { FC, useEffect, useState } from "react";
import { Button, ListGroup, ListGroupItem, Modal, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {useSelector } from "react-redux/es/hooks/useSelector";
import cartSlice from "../store/cartSlice";
import store, { useAppDispatch } from "../store/store";
import { deletePassportTransfer } from "../modules/delete-req-mm";
import "../styles/CartPage.styles.css"
import { changeReqStatus } from "../modules/change-req-status";
import { DropResult } from "react-beautiful-dnd";
import { changeReqStatusClient } from "../modules/changeRequestStatusClient";
import { deleteBRequest } from "../modules/deleteRequest";

interface InputChangeInterface {
    target: HTMLInputElement;
}

const Cart: FC = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const passports = useSelector((state: ReturnType<typeof store.getState>) => state.cart.passports);


    useEffect(() => {
        dispatch(cartSlice.actions.setIsInCart(true));
    }, [dispatch, userToken]);

    const deleteFromCart = (passportName = '') => {
        if (!userToken) {
            return;
          }
          return async ()  => {
            await deletePassportTransfer(passportName, localStorage.getItem("reqID"), userToken)
              .then(() => {
                dispatch(cartSlice.actions.removePassport(passportName));
                if (passports.length === 1) {
                  deleteRequest()
                }
              })
              .catch(() => {
                setShowError(true);
              });
        }
    }

    const sendRequest = async () => {
        if (!userToken) {
            return;
        }

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        await changeReqStatusClient(userToken, reqID)

        // await changeReqStatus(userToken, {
        //     ID: reqID,
        //     Status: "На рассмотрении",
        // });

        localStorage.setItem("reqID", "")

        if (passports) {
            passports.forEach((passportName: string) => {
                dispatch(cartSlice.actions.removePassport(passportName));
            });

            localStorage.setItem("reqID", "")
        }
        dispatch(cartSlice.actions.setIsInCart(false))
        setRedirectUrl(`/border_crossing_facts/${reqID}`)
        setShowSuccess(true)
    };

    const deleteRequest = async () => {
        if (!userToken) {
            return;
        }

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        await deleteBRequest(userToken, reqID)

        // await changeReqStatus(userToken, {
        //     ID: reqID,
        //     Status: "Удалена",
        // });

        if (passports) {
            passports.forEach((passportName: string) => {
                dispatch(cartSlice.actions.removePassport(passportName));
            });

            localStorage.setItem("reqID", "")
        }
        dispatch(cartSlice.actions.setIsInCart(false))
    };

    const handleErrorClose = () => {
        setShowError(false);
    };
    const handleSuccessClose = () => {
        setShowSuccess(false);

        if (redirectUrl) {
            dispatch(cartSlice.actions.setIsInCart(false))
            navigate(redirectUrl);
            setRedirectUrl(null);
        }
    };


    return (
        <div className="cart-container">
            <Modal show={showError} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Не получилось добавить паспорт</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleErrorClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Заявка отправлена</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                        Просмотр
                    </Button>
                    <Button onClick={() => (navigate(`/passports`))} variant="primary" className="button">
                        К паспортам
                    </Button>
                </Modal.Footer>
            </Modal>
            {passports?.length !== 0 && <h3>Выбранные паспорта:</h3>}
            {passports?.length === 0 && <h4>Вы ещё не выбрали ни одного паспорта</h4>}
            <ListGroup style={{ width: '500px' }}>
                {passports?.map((passportName, passportID) => (
                    <ListGroupItem key={passportID}>
                        {passportName}
                        <span className="pull-right button-group" style={{ float: 'right' }}>
                            <Button variant="danger" onClick={deleteFromCart(passportName)}>
                                Удалить
                            </Button>
                        </span>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {passports?.length !== 0 && (
                <>
                <Row>
                <Col>
                <Button className="common-button" 
                        variant="success" 
                        onClick={sendRequest} disabled={passports?.length === 0}>
                        Сформировать
                </Button>
                </Col>
                <Col>
                <Button className="common-button" 
                        variant="danger" 
                        onClick={deleteRequest}
                        disabled={passports?.length === 0}>
                        Отменить
                </Button>
                </Col>
                </Row>
                </>
            )}
            <button onClick={() => navigate("/passports")}>К паспортам</button>
        </div>
    );
};
export default Cart;
import { FC, useState } from "react";
import { Button, ListGroup, ListGroupItem, Modal, Col, Row  } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {useSelector } from "react-redux/es/hooks/useSelector";
import cartSlice from "../store/cartSlice";
import store, { useAppDispatch } from "../store/store";
import { deletePassportTransfer } from "../modules/delete-req-mm";
import "../styles/CartPage.styles.css"
import { changeReqStatus } from "../modules/change-req-status";

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


    const deleteFromCart = (passportName = '') => {
        return (event: React.MouseEvent) => {
            if (!userToken) {
                return
            }
            const response = deletePassportTransfer(passportName, localStorage.getItem("reqID"), userToken);
            dispatch(cartSlice.actions.removePassport(passportName))
            event.preventDefault()
        }
    }

    const sendRequest = async () => {
        if (!userToken) {
            return;
        }

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        const editResult = await changeReqStatus(userToken, {
            ID: reqID,
            Status: "На рассмотрении",
        });

        localStorage.setItem("reqID", "")

        const storedPassportsString: string[] | undefined = localStorage.getItem('passports')?.split(',');
        if (storedPassportsString) {

            storedPassportsString.forEach((passportName: string) => {
                dispatch(cartSlice.actions.removePassport(passportName));
            });

            localStorage.setItem("passports", "");
        }
        setRedirectUrl(`/border_crossing_facts/${reqID}`)
        setShowSuccess(true)
    };

    const deleteRequest = async () => {
        if (!userToken) {
            return;
        }

        const reqIDString: string | null = localStorage.getItem("reqID");
        const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

        const response = await changeReqStatus(userToken, {
            ID: reqID,
            Status: "Удалена",
        });

        localStorage.setItem("reqID", "")

        const storedPassportsString: string[] | undefined = localStorage.getItem('passports')?.split(',');
        if (storedPassportsString) {

            storedPassportsString.forEach((passportName: string) => {
                dispatch(cartSlice.actions.removePassport(passportName));
            });

            localStorage.setItem("passports", "");
        }
        navigate(`/passports`)
    };

    const handleErrorClose = () => {
        setShowError(false);
    };
    const handleSuccessClose = () => {
        setShowSuccess(false);

        if (redirectUrl) {
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
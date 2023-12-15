import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useSelector } from "react-redux/es/hooks/useSelector";
import { Button, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import cartSlice from "../store/cartSlice";
import store, { useAppDispatch } from "../store/store";
import { createRequest } from "../modules/create-request";
import "../styles/CartPage.styles.css"

interface InputChangeInterface {
    target: HTMLInputElement;
}

const Cart: FC = () => {
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {userToken} = useSelector((state: ReturnType<typeof store.getState> ) => state.auth)
    const {passports} = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

    const deleteFromCart = (passportName = '') => {
        return (event: React.MouseEvent) => {
            dispatch(cartSlice.actions.removePassport(passportName))
            event.preventDefault()
        }
    }

    const addOrbit = async () => {
        if (passports === undefined || userToken === null) {
            return;
        }

        try {
            const result = await createRequest(passports, userToken);

            if (result.status === 201) {
                const reqID = result.data;

                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    navigate(`/border_crossing_fact/${reqID}`);
                }, 3000);
            } else {
                setShowError(true);
            }
        } catch (error) {
            console.error("Ошибка при создании заявки:", error);
            setShowError(true);
        }
    };


    const handleErrorClose = () => {
        setShowError(false)
    }
    const handleSuccessClose = () => {
        setShowSuccess(false)
        //window.location.href = `/border_crossing_fact/${}`;
    }

    return (
        <div className="cart-container">
            <Modal show = {showError} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Не получилось добавить паспорт</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleErrorClose}>
                      Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show = {showSuccess} onHide={handleSuccessClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Паспорт добавлен</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSuccessClose}>
                      Перенаправление...
                    </Button>
                </Modal.Footer>
            </Modal>
            {passports?.length !== 0 &&
                <h3>Выбранные паспорта:</h3>
            }
            {passports?.length === 0 && 
                <h4>Вы ещё не выбрали ни одного паспорта</h4>
            }
            <ListGroup style={{width: '500px'}}>
                {passports?.map((passportName, passportID) => (
                    <ListGroupItem key={passportID}> {passportName}
                        <span className="pull-right button-group" style={{float: 'right'}}>
                            <Button variant="danger" onClick={deleteFromCart(passportName)}>Удалить</Button>
                        </span>
                    </ListGroupItem>
                ))
                }
            </ListGroup>
            {passports?.length !== 0 &&
                <button onClick={addOrbit}>Оформить</button>
            }
            <button onClick={() => navigate("/orbits")}>К паспортам</button>
        </div>
    )

}

export default Cart;
import { FC } from "react";
import {useSelector } from "react-redux/es/hooks/useSelector";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import cartSlice from "../store/cartSlice";
import store, { useAppDispatch } from "../store/store";

interface InputChangeInterface {
    target: HTMLInputElement;
  }

const BorderCrossPaspPage: FC = () => {
    const dispatch = useAppDispatch()

    const {passports} = useSelector((state: ReturnType<typeof store.getState>) => state.cart)

    const deleteFromCart = (passportName = '') => {
        return (event: React.MouseEvent) => {
            dispatch(cartSlice.actions.removePassport(passportName))
            event.preventDefault()
        }
    }

    return (
        <>
            <h3>Выбранные паспорта:</h3>
            <ListGroup style={{width: '500px'}}>
                {passports?.map((passportName) => (
                    <ListGroupItem> {passportName}
                        <span className="pull-right button-group" style={{float: 'right'}}>
                            <Button variant="danger" onClick={deleteFromCart(passportName)}>Удалить</Button>
                        </span>
                    </ListGroupItem>
                ))
                }
            </ListGroup>
        </>
    )

}

export default BorderCrossPaspPage;
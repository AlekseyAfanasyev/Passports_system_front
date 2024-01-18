import {FC} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import store from '../../store/store';
import './CartButton.styles.css';
import { Button } from 'react-bootstrap';

const CartButton: FC = () => {
    const passports = useSelector((state: ReturnType<typeof store.getState>) => state.cart.passports);
    const navigate = useNavigate()

  return (
    <Button 
      className={"cart-button"} 
      disabled={passports?.length === 0}
      onClick={() => (navigate(`/cart`))}>
      Корзина ({passports?.length || 0})
    </Button>
  );
};

export default CartButton;
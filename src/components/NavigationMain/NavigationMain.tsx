import React, { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import store, { useAppDispatch } from '../../store/store';
import { logoutUser } from '../../modules/auth-actions';
import './NavigationMain.styles.css';
import CartButton from '../CartButton/CartButton';

const NavigationMain: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        if (userToken) {
            dispatch(logoutUser(userToken));
            navigate('/passports');
        }
    };
    return (
        <Navbar expand="sm">
            <NavLink className="logo" to="/passports" style={{ textDecoration: 'none' }}>PASSPORT SYSTEM</NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <span><NavLink to="/passports" className="nav-link">Список паспортов</NavLink></span>
                {userToken && userRole === '1' && <CartButton/>}
                <Nav className="ml-auto">
                    {userToken &&
                        <>
                            <NavLink to="/border_crossing_facts" className="nav-link">Заявки</NavLink>
                            <NavDropdown
                                className="nav-dropdown"
                                title={userName}
                                id="basic-nav-dropdown"
                                show={showDropdown}
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                                align={{ sm: 'end' }}
                            >
                                <NavDropdown.Item
                                    className="navbar-block"
                                    onClick={() => {
                                        navigate('/profile');
                                        setShowDropdown(false);
                                    }}
                                >
                                    Личный кабинет
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    className="navbar-block"
                                    onClick={() => {
                                        handleLogout();
                                        setShowDropdown(false);
                                    }}
                                >
                                    Выйти
                                </NavDropdown.Item>
                            </NavDropdown>
                        </>}
                    {!userToken &&
                        <>
                            <NavLink to="/login" className='nav-link'>Вход</NavLink>
                        </>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationMain;

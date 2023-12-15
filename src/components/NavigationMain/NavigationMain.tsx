import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import store, { useAppDispatch } from '../../store/store';
import { logoutUser } from '../../modules/auth-actions';
import './NavigationMain.styles.css';

const NavigationMain: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        if (userToken) {
            dispatch(logoutUser(userToken));
            navigate('/orbits/');
        }
    };
    return (
        <Navbar className="navbar" expand="lg">
            <Navbar.Brand className="navbar-logo" href="/passports">
                PASSPORT SYSTEM
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link className="navbar-block" href="/passports">
                        Список паспортов
                    </Nav.Link>
                </Nav>
                <Nav>
                {!userToken && (
                        <Nav.Link className="navbar-block" href="/auth">
                            Вход
                        </Nav.Link>
                    )}
                    {userToken && (
                        <NavDropdown
                            className="nav-dropdown"
                            title={userName}
                            id="basic-nav-dropdown"
                            show={showDropdown}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                            align={{ lg: 'end' }}
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
                            {(userRole === '2' || userRole === '1') && (
                                <NavDropdown.Item
                                    className="navbar-block"
                                    onClick={() => {
                                        navigate('/transfer_requests');
                                        setShowDropdown(false);
                                    }}
                                >
                                    Заявки
                                </NavDropdown.Item>
                            )}
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
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
export default NavigationMain;
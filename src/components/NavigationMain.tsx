import React from 'react';
import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';

const NavigationMain: React.FC = () => {
    return (
        <Navbar className="navbar" expand="lg">
            <Navbar.Brand className="navbar-logo" href="/orbits">PASSPORT SYSTEM</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="navbar-blocks mr-auto">
                    <Nav.Link className="navbar-block" href="/orbits">Список паспортов</Nav.Link>
                    <Nav.Link className="navbar-block" href="/contacts">Контакты</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link className="navbar-profile" href="/profile">Личный кабинет</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationMain;

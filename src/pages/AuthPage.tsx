import {FC, useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {Button, Spinner, Modal} from 'react-bootstrap'

import '../styles/AuthPage.styles.css';

import store, { useAppDispatch } from '../store/store'
import { loginUser, registerUser } from '../modules/auth-actions';

interface InputChangeInterface {
    target: HTMLInputElement;
  }


const AuthPage: FC = () => {

    const {loading, userInfo, error, success} = useSelector(
        (state: ReturnType<typeof store.getState> ) => state.auth
    )

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const [showRegisterModal, setShowRegisterModal] = useState(true)

    const handleRegisterModalClose = () => {
        setShowRegisterModal(false)
    }

    const handleLoginChange = (event: InputChangeInterface) => {
        setLogin(event.target.value)
    }

    const handlePasswordChange = (event: InputChangeInterface) => {
        setPassword(event.target.value)
    }

    const sendLogin = async () => {
        await dispatch(loginUser({ login: login, password: password }));
        window.location.reload()
      };
    

    const sendRegister = async () => {
        setShowRegisterModal(true)
        dispatch(registerUser({login: login, password: password}));
    }

    useEffect(() => {
        if (success) {
            navigate('/profile');
          }
    }, [navigate, userInfo, success])



    return (
        <>
          <Modal show={success && showRegisterModal && !loading} onHide={handleRegisterModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Регистрация прошла успешно!</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleRegisterModalClose}>
                Закрыть
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="login-card">
            <h1>Вход</h1>
            <div className="form-group">
              <label>Логин:</label>
              <input className="input-login" value={login} onChange={handleLoginChange} />
            </div>
            <div className="form-group">
              <label>Пароль:</label>
              <input className="input-login" type="password" value={password} onChange={handlePasswordChange} />
            </div>
            <button onClick={sendLogin} disabled={loading}>
              Войти
            </button>
            <button onClick={sendRegister} disabled={loading}>
              Регистрация
            </button>
            {loading ? <Spinner /> : ''}
          </div>
        </>
      );
    };

    export default AuthPage;
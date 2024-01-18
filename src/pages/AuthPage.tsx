import {FC, useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {Button, Spinner, Modal} from 'react-bootstrap'

import '../styles/LoginPage.styles.css';

import store, { useAppDispatch } from '../store/store'
import { loginUser, registerUser } from '../modules/auth-actions';

interface InputChangeInterface {
    target: HTMLInputElement;
  }


const LoginPage: FC = () => {

    const {loading, error, success} = useSelector(
        (state: ReturnType<typeof store.getState> ) => state.auth
    )

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const [showRegisterModal, setShowRegisterModal] = useState(true)

   

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
    

   

    useEffect(() => {
      if (success) {
        const sendLogin = async () => await dispatch(loginUser({ login: login, password: password }));
        sendLogin()
      }
      if (success && !showRegisterModal) {
        navigate('/passports');
        window.location.reload()
      }
    }, [showRegisterModal, success])



    return (
        <>

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
            <div style={{ textAlign: 'center', marginTop: '30px' }}>Нет аккаунта?</div>
            <button onClick={() => (navigate(`/register`))}>
              Регистрация
            </button>
            {loading ? <Spinner /> : ''}
          </div>
        </>
      );
    };

    export default LoginPage;
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Modal, Spinner } from 'react-bootstrap';

import './RegisterPage.styles.css';

import { loginUser, registerUser } from '../../modules/auth-actions';
import store, { useAppDispatch } from '../../store/store';

interface InputChangeInterface {
  target: HTMLInputElement;
}

const Register: FC = () => {
  const { loading, error, success } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.auth
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
  };

  const handleLoginChange = (event: InputChangeInterface) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event: InputChangeInterface) => {
    setPassword(event.target.value);
  };

  const handleRepeatPasswordChange = (event: InputChangeInterface) => {
    setRepeatPassword(event.target.value);
  };

  const handleModalClose = () => {
    setShowErrorModal(false);
  };

  const sendRegister = async () => {
    if (password !== repeatPassword) {
      setErrorMessage('Пароли не совпадают');
      setShowErrorModal(true);
      return;
    }

    await dispatch(registerUser({ login: login, password: password }));

    if (success) {
      setShowRegisterModal(true);
      handleRegisterModalClose();
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorModal(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const sendLogin = async () => await dispatch(loginUser({ login: login, password: password }));
      sendLogin();
    }
    if (success && !showRegisterModal) {
      navigate('/Passports_system_front');
      window.location.reload();
    }
  }, [showRegisterModal, success]);

  return (
    <>
      <Modal show={showErrorModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ошибка</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
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
        <h1>Регистрация</h1>
        <div className="form-group">
          <label>Логин:</label>
          <input className="input-login" value={login} onChange={handleLoginChange} />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input className="input-login" type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div className="form-group">
          <label>Повторите пароль:</label>
          <input
            className="input-login"
            type="password"
            value={repeatPassword}
            onChange={handleRepeatPasswordChange}
          />
        </div>
        <button onClick={sendRegister} disabled={loading}>
          Зарегистрироваться
        </button>
        {loading ? <Spinner /> : ''}
      </div>
    </>
  );
};

export default Register;
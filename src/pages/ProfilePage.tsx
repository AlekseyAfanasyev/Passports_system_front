import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import store, { useAppDispatch } from '../store/store';
import { logoutUser } from '../modules/auth-actions';
import '../styles/ProfilePage.styles.css';

const Profile: FC = () => {
    const { userToken, userName, userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const isUserPresent = userToken !== undefined && userToken !== '';

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (userToken != null) {
            dispatch(logoutUser(userToken));
            navigate('/Passports_system_front/');
        }
    }

    return (
        <div className="profile-container">
            {!isUserPresent &&
                <h1>Вы не зашли в систему!</h1>
            }
            {isUserPresent &&
                <>
                    <h1> Аккаунт </h1>
                    {userRole == '1' && <p>Клиент</p> }
                    {userRole == '2' && <p>Модератор</p> }
                    <p>{userName}</p>
                    <button onClick={handleLogout}> Выйти из системы </button>
                </>
            }
        </div>
    );
}

export default Profile;
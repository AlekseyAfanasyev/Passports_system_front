import { Link } from 'react-router-dom';
import './MenuPage.styles.css';
import { useSelector } from 'react-redux';
import store from '../../store/store';

const HomePage = () => {
    const { userRole, userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    return (
        <div className="table-container">
            <table>
                <tbody>
                    <tr>
                        <td colSpan={1} style={{ textAlign: 'center' }}>
                            <h2>Меню</h2>
                        </td>
                    </tr>
                    {!userToken && (
                        <>
                            <tr>
                                <td>
                                    <Link to="/register">
                                        <div className="table-cell-link">Зарегистрироваться</div>
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Link to="/login">
                                        <div className="table-cell-link">Войти</div>
                                    </Link>
                                </td>
                            </tr>
                        </>)}
                    <tr>
                        <td>
                            <Link to="/passports">
                                <div className="table-cell-link">Паспорта</div>
                            </Link>
                        </td>
                    </tr>
                    {userRole == '2' && (
                    <tr>
                        <td>
                            <Link to="/passports/add_new_passport">
                                <div className="table-cell-link">Новый паспорт</div>
                            </Link>
                        </td>
                    </tr>
                    )}
                    {userToken && (
                    <tr>
                        <td>
                            <Link to="/border_crossing_facts">
                                <div className="table-cell-link">Заявки</div>
                            </Link>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HomePage;
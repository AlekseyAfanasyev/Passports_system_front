import { FC, useEffect, useState } from 'react';
import '../styles/style.css'
import { useParams } from 'react-router-dom';
import { getPassportByName } from '../modules/get-passport-by-name'
import { Passport } from '../modules/ds'
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';





const PassportPage: FC = () => {
    const [passport, setPassport] = useState<Passport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()
    
    

    
    const { passport_name } = useParams();

    useEffect(() => {

        const loadPassport = async () => {
            try {
                const result = await getPassportByName(String(passport_name));
                setPassport(result);
                setError(null);
              } catch (error) {
                console.error('Ошибка при получении орбит:', error);
                if ((error as AxiosError).message === '404') {
                  setError("404 Орбита не найдена");
                } else {
                  setError('Произошла ошибка при загрузке орбиты');
                }
              }
            };

        loadPassport();
    }, [passport_name]);

    if (error) {
        return (
          <div style={{ textAlign: 'center', fontSize: '2em', margin: 'auto' }}>
            {error}
          </div>
        );
      }
    
      if (!passport) {
        return <div>Загрузка...</div>;
      }

    return (
        <div>
            <div className="card-sub">
                <div className="card-content-sub">
                <img
                    src={passport?.Image || '/DEFAULT.jpg'}
                    className="card_image"
                    onError={(e) => {
                    e.currentTarget.src = '/DEFAULT.jpg';
                    }}
                    />
                    <div className="right-content-sub">
                        <p><span className="passport-label">Статус:</span> {passport?.IsFree ? 'Доступен' : 'Недоступен'}</p>
                        <p><span className="passport-label">Серия:</span> {passport?.Seria}</p>
                        <p><span className="passport-label">Дата выдачи:</span> {passport?.Issue}</p>
                        <p><span className="passport-label">Код отделения:</span> {passport?.Code}</p>
                        <p><span className="passport-label">Пол:</span> {passport?.Gender}</p>
                        <p><span className="passport-label">Дата рождения:</span> {passport?.Birthdate}</p>
                        <p><span className="passport-label">Место рождения:</span> {passport?.BDplace}</p>
                    </div>
                </div>
                <Row>
      <Col>
      <button className="button-det" onClick={() => (navigate(`/Passports_system_front/`))}>Назад</button>
      </Col>
      </Row>
        </div>
        </div>
    );
};

export default PassportPage;
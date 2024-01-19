import { FC } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Passport } from '../../modules/ds';
import './PassportTable.styles.css';

interface PassportTableProps {
  passports: Passport[];
  handleStatusChange: (passportName: string, newStatus: boolean) => void;
  isStatusChanging: boolean;
}

const PassportTable: FC<PassportTableProps> = ({ passports, handleStatusChange, isStatusChanging }) => {
  const navigate = useNavigate();

  return (
    <div className="passport-center-table">
      <table className="passport-table">
        <thead>
          <tr>
            <th>Изображение</th>
            <th>Название паспорта</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {passports.map((passport, index) => (
            <tr key={index}>
              <td>
                <div className="passport-details">
                  {passport.Image && (
                    <img
                      src={passport?.Image}
                      onError={(e) => {
                        e.currentTarget.src = '/DEFAULT.jpg';
                      }}
                      style={{ width: '150px', height: '150px' }}
                    />
                  )}
                 
                </div>
              </td>
              <td><span style={{ marginLeft: '10px', fontSize: '20px' }}>{passport.Name}</span></td>
              <td style={{ fontSize: '20px', paddingLeft: '10px', paddingRight: '10px' }}>
                {passport.IsFree ? 'Доступен' : 'Недоступен'}
              </td>
              <td>
                <Col>
                  <Button
                    className="passport-table-button"
                    onClick={() => navigate(`/Passports_system_front/${encodeURIComponent(passport.Name)}`)}
                  >
                    Подробнее
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="passport-table-button"
                    style={{ marginRight:'60px' }}
                    variant='success'
                    onClick={() => navigate(`/Passports_system_front/${encodeURIComponent(passport.Name)}/edit`)}
                  >
                    Изменить
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="passport-table-button"
                    style={{ marginRight:'60px' }}
                    variant='danger'
                    onClick={() => handleStatusChange(passport.Name, !passport.IsFree)}
                    disabled={isStatusChanging}
                  >
                    {isStatusChanging ? 'Удаление...' : 'Удалить'}
                  </Button>
                </Col>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassportTable;
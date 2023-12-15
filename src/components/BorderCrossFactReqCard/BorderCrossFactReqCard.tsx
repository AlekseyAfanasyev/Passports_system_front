import { FC } from 'react'
import { useSelector } from 'react-redux';
import { Button, Card } from 'react-bootstrap';
import store from '../../store/store'
import "./BorderCrossFactReqCard.styles.css"

interface borderCrossFactProps {
    id: number,
    status: string,
    dateCreated?: string,
    dateProcessed?: string,
    dateFinished?: string,
}

const borderCrossFactCard: FC<borderCrossFactProps> = ({ status, dateCreated, dateProcessed, dateFinished, id }) => {
    const { userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) {
            return 'N/A';
        }

    
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'UTC',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        };

        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ru-RU', options).format(date);
      };

    return (
        <Card className="card">
          <Card.Body className="card_body">
            <p>Статус: {status}</p>
            <p>Создана: {formatDate(dateCreated)}</p>
            {dateProcessed !== 'N/A' && dateProcessed && (
              <p>Отправлена: {formatDate(dateProcessed)}</p>
            )}
            {dateFinished !== 'N/A' && dateFinished && (
              <p>Завршена: {formatDate(dateFinished)}</p>
            )}
          </Card.Body>
          <Card.Footer className="card_footer">
            {userRole === '1' && status === 'Черновик' && (
              <div>
                <Button
                  onClick={() => (window.location.href = `/border_crossing_passports/${id}`)}
                  variant="primary"
                  className="button button_primary"
                >
                  Изменить
                </Button>
                <div></div>
                <Button variant="danger" className="button button_danger">
                  Отменить
                </Button>
              </div>
            )}
            {userRole === '1' && status !== 'Черновик' && (
              <Button
                onClick={() => (window.location.href = `/border_crossing_passports/${id}`)}
                variant="info"
                className="button button_info"
              >
                Просмотр
              </Button>
            )}
            {userRole === '2' && (
              <Button
                onClick={() => (window.location.href = `/border_crossing_passports/${id}`)}
                variant="primary"
                className="button button_primary"
              >
                Изменить
              </Button>
            )}
          </Card.Footer>
        </Card>
    );
}

export default borderCrossFactCard;
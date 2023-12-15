import { FC } from 'react'
import { useSelector } from 'react-redux';
import { Button, Card } from 'react-bootstrap';
import store from '../../store/store'

interface borderCrossFactProps {
    status: string,
    dateCreated?: string,
    dateFinished?: string,
}

const borderCrossFactCard: FC<borderCrossFactProps> = ({ status, dateCreated, dateFinished }) => {
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
        <Card>
            <Card.Body>
                <p> Статус: {status} </p>
                <p> Создана: {formatDate(dateCreated)}</p>
                {dateFinished !== undefined &&
                    <p> Завршена: {formatDate(dateFinished)} </p>
                }
            </Card.Body>
            <Card.Footer>
                {userRole === '1' && status === 'Черновик' &&
                    <>
                        <Button variant="primary">Изменить</Button>{' '}
                        <Button variant="danger">Отменить</Button>
                    </>
                }
                 {userRole === '1' && status !== 'Черновик' &&
                    <Button variant="info">Просмотр</Button>
                }
                {userRole === '2' &&
                    <Button variant="primary">Изменить</Button>
                }
            </Card.Footer>
        </Card>
    );
}

export default borderCrossFactCard;
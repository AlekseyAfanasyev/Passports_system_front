import { FC, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { changePassportStatus } from '../modules/change-passport-status';

interface Props {
    imageUrl: string;
    passportName: string;
    passportStatus: boolean;
    passportDetailed: string;
    changeStatus: string;
    onStatusChange: (passportName: string, newStatus: boolean) => void;
}

const PassportCard: FC<Props> = ({ imageUrl, passportName, passportStatus, passportDetailed, onStatusChange }) => {
    const [isStatusChanging, setIsStatusChanging] = useState(false);

    const handleStatusChange = () => {
        setIsStatusChanging(true); //рендер 1 => return (...)
        changePassportStatus(passportName)
            .then(() => {
                setIsStatusChanging(false); //рендер 2 (если успех) => return (...)
                onStatusChange(passportName, !passportStatus);
            })
            .catch((error) => {
                console.error('Ошибка при изменении статуса орбиты:', error);
                setIsStatusChanging(false); //рендер 2 (если не успех) => return (...)
            });
    };

    return (
        <Card className='card'>
            <Card.Title> <span className="passport-label">{passportName}</span> </Card.Title>
            <div className="image-container">
                <Card.Img className="card_image" src={`${imageUrl}`} />
            </div>
            <Card.Body>
                <div className='card_title'>
                    <Card.Title> Статус: {passportStatus ? "Доступен" : "Недоступен"} </Card.Title>
                </div>
                <Button className='button' href={passportDetailed}> Подробнее </Button>
                <div></div>
                <Button
                    className='button'
                    onClick={handleStatusChange}
                    disabled={isStatusChanging}
                >
                    {isStatusChanging ? 'Изменение...' : 'Изменить статус'}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default PassportCard;

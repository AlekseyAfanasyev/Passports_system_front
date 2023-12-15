import { FC, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { changePassportStatus } from '../../modules/change-passport-status';
import "./PassportCard.styles.css"
import cartSlice from '../../store/cartSlice'
import store, { useAppDispatch } from '../../store/store'


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
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    const { userRole, userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    const handleAddOrbitToCart = () => {
        dispatch(cartSlice.actions.addOrbit(passportName))
    }

    const handleStatusChange = async () => {
        setIsStatusChanging(true);

        try {
            await changePassportStatus(userToken?.toString(),passportName);
            onStatusChange(passportName, !passportStatus);
        } catch (error) {
            console.error('Error changing passport status:', error);
        } finally {
            setIsStatusChanging(false);
            navigate('/passports');
        }
    };

    return (
        <Card className='card'>
            <Card.Title> <span className="passport-label">{passportName}</span> </Card.Title>
            <div className="image-container">
            <Card.Img
                    className="card_image"
                    src={imageUrl}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = '/DEFAULT.jpg';
                    }}
                    alt={`/DEFAULT.jpg`}
                />
            </div>
            <Card.Body>
                <div className='card_title'>
                    <Card.Title> Статус: {passportStatus ? "Доступен" : "Недоступен"} </Card.Title>
                </div>
                <Button className='button' href={passportDetailed}> Подробнее </Button>
                <div></div>
                {userRole =='2' && (
                <Button
                    className='button'
                    onClick={handleStatusChange}
                    disabled={isStatusChanging}
                >
                    {isStatusChanging ? 'Удаление...' : 'Удалить'}
                </Button>
            )}
            {userRole =='1' && (
                <Button className='button' onClick={handleAddOrbitToCart}> Добавить</Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default PassportCard;

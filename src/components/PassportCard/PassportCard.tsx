import { FC, useState } from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { changePassportStatus } from '../../modules/change-passport-status';
import "./PassportCard.styles.css"
import cartSlice from '../../store/cartSlice'
import store, { useAppDispatch } from '../../store/store'
import { createRequest } from '../../modules/create-req-mm';
import { deletePassportTransfer } from '../../modules/delete-req-mm';


interface Props {
    imageUrl: string;
    passportName: string;
    passportStatus: boolean;
    changeStatus: string;
    onStatusChange: (passportName: string, newStatus: boolean) => void;
}

const PassportCard: FC<Props> = ({ imageUrl, passportName, passportStatus, onStatusChange }) => {
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { userRole, userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    const isPassportInCart = useSelector((state: ReturnType<typeof store.getState>) =>
    state.cart.passports?.includes(passportName)
);



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

    const handleCreateRequest = async () => {
        try {
            if(!userToken){
                return
            }
            if (isPassportInCart) {
                await deletePassportTransfer(passportName, localStorage.getItem("reqID"), userToken);
                dispatch(cartSlice.actions.removePassport(passportName));
            } else {
                const response = await createRequest(passportName, userToken);
                localStorage.setItem("reqID", response.data)
                dispatch(cartSlice.actions.addPassport(passportName));
            }
        } catch (error) {
            console.error('Ошибка:', error);
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
                    <Card.Title style={{fontWeight: 'bold'}}> {passportName} </Card.Title>
                    <Card.Title> Статус: {passportStatus ? "Доступен" : "Недоступен"} </Card.Title>
                </div>
                <Button className='button' onClick={() => (navigate(`/passports/${encodeURIComponent(passportName)}`))}> Подробнее </Button>
                <div></div>
                {userRole === '2' && (
                    <>
                     <Col>
                     <Button
                         className='button-card'
                         variant='success'
                         onClick={() => navigate(`/passports/${encodeURIComponent(passportName)}/edit`)}
                     >
                         Изменить
                     </Button>
                 </Col>
                    <Button
                    className='button-card'
                        onClick={handleStatusChange}
                        disabled={isStatusChanging}
                    >
                        {isStatusChanging ? 'Удаление...' : 'Удалить'}
                    </Button>
                    </>
            )}
            {userRole === '1' && (
                     <>
                     <div style={{ width: '1px', height: '1px' }}></div>
                     <Button
                         className='button-add'
                         onClick={handleCreateRequest}
                         variant={isPassportInCart ? 'danger' : 'success'}
                     >
                         {isPassportInCart ? 'Удалить' : 'Добавить'}
                     </Button>
                 </>
                )}
            </Card.Body>
        </Card>
    );
};

export default PassportCard;

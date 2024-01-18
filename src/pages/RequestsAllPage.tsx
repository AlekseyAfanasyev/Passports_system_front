import { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useNavigate } from "react-router-dom";
import { Col, Row, Table, Button } from "react-bootstrap";
import BorderCrossFactReqCard from '../components/BorderCrossFactReqCard/BorderCrossFactReqCard'
import store, { useAppDispatch } from '../store/store'
import getRequestByStatus from '../modules/get-req-by-status';
import { BorderCrossingFactRequest } from '../modules/ds'
import filtersSlice from '../store/filtersSlice';
import RequestFilter from '../components/RequestFilter/RequestFilter';
import "../RequestsAllPage.styles.css"
import Pagination from '../components/Pagination/Pagination';

const TransfReq: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { requestStatus } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
    const [transfReqs, setTransfReqs] = useState<BorderCrossingFactRequest[]>([])
    const [status, setStatus] = useState(requestStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;


    useEffect(() => {
        const loadValidRequests = async () => {
            const result = await getRequestByStatus(userToken?.toString(), userRole, userName, 'client');
            if (result) {
                setTransfReqs(result);
            }
        }

        loadValidRequests();

    }, []);

    const applyFilters = async () => {
        try {
            if (status === '') {
                setStatus('client');
            }
            dispatch(filtersSlice.actions.setRequestStatus(status));

            if (status !== undefined && status !== null) {
                const result = await getRequestByStatus(userToken?.toString(), userRole, userName, status?.toString());
                if (result) {
                    setTransfReqs(result);
                    navigate('/border_crossing_facts', { state: { result } });
                }
            }
        } catch (error) {
            console.error("Ошибка при получении заявок:", error);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) {
            return '-';
        }

        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };

        const date = new Date(dateString);

        return new Intl.DateTimeFormat('ru-RU', options).format(date);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = transfReqs.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(transfReqs.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, pageCount));
    };

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };


    return (
        <>
             {!userToken && (
                <>
                     <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h3>Вам необходимо войти в систему</h3>
                        <Button className="button" onClick={() => navigate(`/auth`)} variant="primary" style={{ marginTop: '10px' }}>
                            Войти
                        </Button>
                    </div>
                </>
            )}
            {userToken && (
                <>
                    <RequestFilter status={status} setStatus={setStatus} applyFilters={applyFilters}></RequestFilter>
                    {transfReqs.length === 0 && <h3 style={{ textAlign: 'center', marginTop: '20px' }}> Заявки не найдены</h3>}

                    {transfReqs.length !== 0 && (
                        <>
                            <Table striped bordered hover responsive className="custom-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Статус</th>
                                        <th>Создана</th>
                                        <th>На рассмотрении</th>
                                        <th>Завершена</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.ID}</td>
                                            <td>{item.Status}</td>
                                            <td>{formatDate(item.DateCreated)}</td>
                                            <td>{formatDate(item.DateProcessed)}</td>
                                            <td>{formatDate(item.DateFinished)}</td>
                                            <td>
                                                <button onClick={() => navigate(`/border_crossing_facts/${item.ID}`)}>Подробнее</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div style={{ margin: '0 auto' }}>
                                {transfReqs.length > itemsPerPage && (
                                    <Pagination
                                        currentPage={currentPage}
                                        pageCount={pageCount}
                                        goToNextPage={goToNextPage}
                                        goToPrevPage={goToPrevPage}
                                        paginate={paginate}
                                    />
                                )}
                            </div>

                        </>)}
                </>)}
        </>
    );
};

export default TransfReq;
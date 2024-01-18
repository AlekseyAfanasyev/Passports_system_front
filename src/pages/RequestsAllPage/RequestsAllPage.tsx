import { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { Col, Row, Table, Button } from "react-bootstrap";
//import BorderCrossFactReqCard from '../components/BorderCrossFactReqCard/BorderCrossFactReqCard'
import store, { useAppDispatch } from '../../store/store'
import getRequestByStatus from '../../modules/get-req-by-status';
import { BorderCrossingFactRequest } from '../../modules/ds'
import filtersSlice from '../../store/filtersSlice';
import RequestFilter from '../../components/RequestFilter/RequestFilter';
import "../../styles/RequestsAllPage.styles.css";
import Pagination from '../../components/Pagination/Pagination';
import { useFetcher, useNavigate } from 'react-router-dom';
import { getDistinctClients } from '../../modules/get-distinct-client';
import { getAsyncProcessed } from "../../modules/get-assync-process";

const TransfReq: FC = () => {
    const { userToken, userRole, userName } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);
    const {
        requestStatus,
        reqStartDate,
        reqFinDate,
        reqClient } = useSelector((state: ReturnType<typeof store.getState>) => state.filters);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [transfReqs, setTransfReqs] = useState<BorderCrossingFactRequest[]>([]);
    const [startDate, setStartDate] = useState(reqStartDate);
    const [finDate, setFinDate] = useState(reqFinDate);
    const [status, setStatus] = useState(requestStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const [client, setClient] = useState(reqClient);
    const [allClients, setAllClients] = useState<string[]>([]);
    const [asyncProcessedAmount, setAsyncProcessedAmount] = useState<number | null>(null);

    const fetchAsyncProcessedAmount = async () => {
        const amount = await getAsyncProcessed(userToken?.toString());
        setAsyncProcessedAmount(amount);
    };


    useEffect(() => {
        const loadValidRequests = async () => {
            const result = await getRequestByStatus(userToken?.toString(),
                userRole, userName, 'client', reqStartDate, reqFinDate, /*reqClient*/);
            if (result) {
                setTransfReqs(result);
            }
            if (userRole == '2') {
                const distinctClients = await getDistinctClients(userToken?.toString())
                setAllClients(distinctClients)
            }
        }

        const intervalId = setInterval(fetchAsyncProcessedAmount, 5000); // Поллинг каждые 5 секунд
        loadValidRequests();
        fetchAsyncProcessedAmount(); // Загрузка сразу

        return () => clearInterval(intervalId);

    }, []);

    //short-polling
    useEffect(() => {
        const intervalId = setInterval(() => {
            const loadPollRequests = async () => {
                const result = await getRequestByStatus(userToken?.toString(),
                    userRole, userName, status || "client", reqStartDate, reqFinDate, /*reqClient*/);
                if (result) {
                    setTransfReqs(result);
                }
            };
            loadPollRequests();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [userToken, userRole, userName, status, reqStartDate, reqFinDate]);

    const applyFilters = async () => {
        try {
            if (status === '') {
                setStatus('client');
            }
            dispatch(filtersSlice.actions.setReqStartDate(startDate));
            dispatch(filtersSlice.actions.setReqFinDate(finDate));
            dispatch(filtersSlice.actions.setRequestStatus(status));
            dispatch(filtersSlice.actions.setReqClient(client));

            if (status !== undefined && status !== null) {
                const result = await getRequestByStatus(userToken?.toString(),
                    userRole, userName, status, startDate, finDate, /*reqClient*/);
                if (result) {
                    //фильтр по клиенту => убрать фильтр по клиенту с бэка (не используется)
                    const filteredRequests = result.filter(
                        (request) => request.Client && request.Client.Name === client
                    );
                    setTransfReqs(filteredRequests);
                    navigate('/border_crossing_facts', { state: { result } });
                }
            }
        } catch (error) {
            console.error("Ошибка при получении заявок:", error);
        }
    };

    const clearFilters = async () => {
        setStatus('');
        setStartDate('');
        setFinDate('');
        setClient('');

        dispatch(filtersSlice.actions.setRequestStatus(''));
        dispatch(filtersSlice.actions.setReqStartDate(''));
        dispatch(filtersSlice.actions.setReqFinDate(''));
        dispatch(filtersSlice.actions.setReqClient(''));

        try {
            const result = await getRequestByStatus(userToken?.toString(),
                userRole, userName, 'client', '', '', /*''*/);
            if (result) {
                setTransfReqs(result);
            }
        } catch (error) {
            console.error("Ошибка:", error);
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

    const itemsPerPage = 5;
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
                        <Button className="button" onClick={() => navigate(`/login`)} variant="primary" style={{ marginTop: '10px' }}>
                            Войти
                        </Button>
                    </div>
                </>
            )}
            {userToken && (
                <>
                     <RequestFilter
                        status={status}
                        setStatus={setStatus}
                        reqStartDate={startDate}
                        setReqStartDate={setStartDate}
                        reqFinDate={finDate}
                        setReqFinDate={setFinDate}
                        reqClient={client}
                        setReqClient={setClient}
                        allClients={allClients}
                        applyFilters={applyFilters}
                        clearFilters={clearFilters}>
                    </RequestFilter>
                    {transfReqs.length === 0 && <h3 style={{ textAlign: 'center', marginTop: '20px' }}> Заявки не найдены</h3>}

                    {userToken && userRole === '2' &&
                        <p>Обработанных записей: {asyncProcessedAmount}</p>
                        }
                    {transfReqs.length !== 0 && (
                        <>
                            <Table striped bordered hover responsive className="custom-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        {userRole == '2' && <th>Клиент</th>}
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
                                            {userRole == '2' && <td>{item.Client?.Name}</td>}
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
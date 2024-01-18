import React, { FC } from 'react';
import { Button, Col, Form, FormLabel, FormSelect, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import store from '../../store/store';
import "./RequestFilter.styles.css"

interface RequestFilterProps {
    status: string | null | undefined;
    setStatus: React.Dispatch<React.SetStateAction<string | string | null>>;
    reqStartDate: string | null | undefined;
    setReqStartDate: React.Dispatch<React.SetStateAction<string | string | null>>;
    reqFinDate: string | null | undefined;
    setReqFinDate: React.Dispatch<React.SetStateAction<string | string | null>>;
    reqClient: string | null | undefined;
    setReqClient: React.Dispatch<React.SetStateAction<string | string | null>>;
    allClients: string[];
    applyFilters: () => void;
    clearFilters: () => void;
}

const RequestFilter: FC<RequestFilterProps> = ({
    status,
    setStatus,
    reqStartDate,
    setReqStartDate,
    reqFinDate,
    setReqFinDate,
    reqClient,
    setReqClient,
    allClients,
    applyFilters,
    clearFilters
}) => {
    const { userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    return (
        <div className="request-filter-container">
            {userRole == '1' &&
                <Form className="request-filter-form">
                    <Row>
                        <Col>
                            <FormLabel className="request-filter-label">Статус:</FormLabel>
                        </Col>
                        <Col>
                            <FormSelect
                                className="request-filter-select"
                                value={status?.toString()}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="client">Все</option>
                                <option value="На рассмотрении">На рассмотрении</option>
                                <option>Оказана</option>
                                <option>Отклонена</option>
                            </FormSelect>
                        </Col>
                    </Row>
                </Form>
            }
            {userRole === '2' &&
                <div className="label-container">
                    <Row>
                        <Col>
                            <label className="date-label">Дата начала:</label>
                            <input
                                type="date"
                                className="date-input"
                                value={reqStartDate?.toString()}
                                onChange={(e) => setReqStartDate(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <label className="date-label">Дата конца:</label>
                            <input
                                type="date"
                                className="date-input"
                                value={reqFinDate?.toString()}
                                onChange={(e) => setReqFinDate(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Form.Label className="request-filter-label">Клиент:</Form.Label>
                            <Form.Select
                                className="request-filter-select"
                                value={reqClient?.toString()}
                                onChange={(e) => setReqClient(e.target.value)}
                            >
                                <option value="">Выберите клиента</option>
                                {allClients.map(client => (
                                    <option key={client} value={client}>{client}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </div>
            }
            <Row>
                <Col><Button className="button" onClick={applyFilters}>Применить</Button></Col>
                <Col><Button className="button" onClick={clearFilters}>Очистить</Button></Col>
            </Row>
        </div>

    );
}

export default RequestFilter;
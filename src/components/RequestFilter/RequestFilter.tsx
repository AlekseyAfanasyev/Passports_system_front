import React, { FC } from 'react';
import { Button, Col, Form, FormLabel, FormSelect, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import store from '../../store/store';
import "./RequestFilter.styles.css"

interface RequestFilterProps {
  status: string | null | undefined;
  setStatus: React.Dispatch<React.SetStateAction<string | string | null>>;
  applyFilters: () => void;
}

const RequestFilter: FC<RequestFilterProps> = ({ status, setStatus, applyFilters }) => {
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
                            <option value=''>Все</option>
                            <option>Черновик</option>
                            <option value="На рассмотрении">На рассмотрении</option>
                            <option>Удалена</option>
                            <option>Оказана</option>
                            <option>Отклонена</option>
                        </FormSelect>
                    </Col>
                </Row>
                <Button className="request-filter-button" onClick={applyFilters}>Применить</Button>
            </Form>
        }
    </div>
);
}

export default RequestFilter;
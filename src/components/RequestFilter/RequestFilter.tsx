import React, { FC } from 'react';
import { Form, FormLabel, FormSelect, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux/es/hooks/useSelector'
import store from '../../store/store';

interface RequestFilterProps {
  status: string | null | undefined;
  setStatus: React.Dispatch<React.SetStateAction<string | string | null>>;
  applyFilters: () => void;
}

const RequestFilter: FC<RequestFilterProps> = ({ status, setStatus, applyFilters }) => {
    const { userRole } = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    return (
        <>
        <div style={{ border: "1px solid black" }}>
        {userRole == '1' &&
        <Form>
            <Row>
                <Col>
                    <FormLabel>Статус:</FormLabel>
                </Col>
                <Col>
                    <FormSelect value={status?.toString()} onChange={(e) => setStatus(e.target.value)}>
                        <option value=''>Все</option>
                        <option>Черновик</option>
                        <option value="На рассмотрении">Сформирована</option>
                        <option>Удалена</option>
                        <option>Оказана</option>
                        <option>Отклонена</option>
                    </FormSelect>

                </Col>
            </Row>
            <Button onClick={applyFilters}>Применить</Button>
        </Form>
    }
    </div>
    </>
    )
}

export default RequestFilter;
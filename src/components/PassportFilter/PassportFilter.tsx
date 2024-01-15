import React from 'react';
import { Form, Row, Col, FormControl, FormLabel, FormCheck, Button } from 'react-bootstrap';

interface PassportFilterProps {
  name: string | null;
  isGender: string | null;
  setName: (value: string) => void;
  setIsGender: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const PassportFilter: React.FC<PassportFilterProps> = ({
  name,
  isGender,
  setName,
  setIsGender,
  applyFilters,
  clearFilters,
}) => {
  return (
    <Form>
      <Row>
        <Col>
          <FormLabel>Название паспорта:</FormLabel>
          <FormControl
            type="text"
            value={name?.toString()}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormCheck
            type="checkbox"
            label="Мужчины"
            checked={isGender === "1"}
            onChange={() => setIsGender(isGender === "1" ? "" : "1")}
          />
          <FormCheck
            type="checkbox"
            label="Женщины"
            checked={isGender === "0"}
            onChange={() => setIsGender(isGender === "0" ? "" : "0")}
          />
        </Col>
      </Row>
      <Col>
        <Button onClick={applyFilters}>Поиск</Button>
      </Col>
      <Col>
        <Button variant="secondary" onClick={clearFilters}>Очистить</Button>
      </Col>
    </Form>
  );
};

export default PassportFilter;
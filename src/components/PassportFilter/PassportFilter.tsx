import React from 'react';
import { Form, Row, Col, FormControl, FormLabel, FormCheck, Button } from 'react-bootstrap';
import './PassportFilter.styles.css';


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
    <Form className="passport-filter-container">
      <Row>
        <Col>
          <FormControl
            placeholder='Название паспорта'
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
      <Row className="passport-buttons">
        <Col>
          <Button className="passport-button" onClick={applyFilters}>
            Поиск
          </Button>
        </Col>
        <Col>
          <Button variant="secondary" className="passport-button" onClick={clearFilters}>
            Очистить
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PassportFilter;
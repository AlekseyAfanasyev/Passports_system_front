import { FC, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Form, FormControl, FormGroup, Button, FormSelect } from "react-bootstrap";
import { getDetailedReq } from '../modules/get-detailed-request';
import {  BorderCrossingFactRequest } from "../modules/ds";
import store from '../store/store';

const BorderCrossFactDetPage: FC = () => {
    const { userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    const [reqId, setReqId] = useState(0);
    const [req, setReq] = useState<BorderCrossingFactRequest | undefined>();

    useEffect(() => {
        const pathname = window.location.pathname;
        const parts = pathname.split('/');
        const reqIdString = parts[parts.length - 1];

        if (reqIdString) {
            setReqId(+reqIdString);
        }

        const loadReq = async () => {
            try {
                const loadedReq = await getDetailedReq(userToken?.toString(), String(reqIdString));
                setReq(loadedReq);
            } catch (error) {
                console.error("Ошибка загрузки заявки:", error);
            }
        };

        loadReq();
    }, [userToken]);

    const handleSaveChanges = async () => {
        console.log("Saving changes...");
    };

    return(
        <>
        <h1>Редактирование заявки #{reqId}</h1>
        <Form>
            <FormGroup>
                <label htmlFor="statusInput">Статус</label>
                <FormSelect id="statusInput" defaultValue={req?.Status}>
                    <option>Черновик</option>
                    <option>Удалена</option>
                    <option>Сформирована</option>
                    <option>Завершена</option>
                    <option>Отклонена</option>
                </FormSelect>
            </FormGroup>
            <FormGroup>
                <label htmlFor="dateCreatedInput">Дата создания</label>
                <FormControl id="dateCreatedInput" defaultValue={req?.DateCreated}></FormControl>
            </FormGroup>
            <FormGroup>
                <label htmlFor="dateProcessedInput">Дата обработки</label>
                <FormControl id="dateProcessedInput" defaultValue={req?.DateProcessed}></FormControl>
            </FormGroup>
            <FormGroup>
                <label htmlFor="dateFinishedInput">Дата завершения</label>
                <FormControl id="dateFinishedInput" defaultValue={req?.DateFinished}></FormControl>
            </FormGroup>
        </Form>
        <Button>Сохранить изменения</Button>
        <p></p>
        <Button href='/border_crossing_facts'>К заявкам</Button>
        <p></p>
        <Button href='/passports'>К паспортам</Button>
        <p></p>
        </>
    )

}

export default BorderCrossFactDetPage;
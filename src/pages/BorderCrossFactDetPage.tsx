import { FC, useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { Form, FormControl, FormGroup, Button, FormSelect, 
    ListGroup, ListGroupItem, FormLabel } from "react-bootstrap";
import { getDetailedReq } from '../modules/get-detailed-request';
import {  BorderCrossingFactRequest, Passport } from "../modules/ds";
import store from '../store/store';
import { getRequestPassports } from "../modules/get-request-passports";
import { setRequestPassports } from "../modules/set-request-passports";
import { changeReqStatus } from "../modules/change-req-status";

interface InputChangeInterface {
    target: HTMLInputElement;
  }

const BorderCrossFactDetPage: FC = () => {

    const newPassportInputRef = useRef<any>(null)

    const [passportNames, setPassportNames] = useState<string[]>()
    const [newPassport, setNewPassport] = useState('')
    const statusRef = useRef<any>(null)

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
            if (userToken === null) {
                return
            }

            const passports = await getRequestPassports(+reqIdString, userToken)
            var passportNames: string[] = []
            for (let passport of passports) {
                passportNames.push(passport.Name)
            }
            setPassportNames(passportNames)

        }

        loadReq();
    }, [userToken]);

    const removePassport = (removedPassportName: string) => {
        return (event: React.MouseEvent) => {
            if (!passportNames) {
                return
            }

            setPassportNames(passportNames.filter(function(passportName) {
                return passportName !== removedPassportName
            }))

            event.preventDefault()
        }
    }

    const addPassport = () => {
        if (!passportNames || !newPassport) {
            return
        }

        setPassportNames(passportNames.concat([newPassport]))
        setNewPassport('')

        if (newPassportInputRef.current != null) {
            newPassportInputRef.current.value = ""
        }
    }

    const handleNewPassportChange = (event: InputChangeInterface) => {
        setNewPassport(event.target.value)
    }

    const sendChanges = async() => {
        if (!userToken) {
            return;
        }

        var req_id = 0
        var status = ''

        if (req?.ID !== undefined) {
            req_id = req?.ID
        }
        if (statusRef.current != null) {
            status = statusRef.current.value
        }

        const editResult = await changeReqStatus(userToken, {
            ID: req_id,
            Status: status,
        })
        console.log(editResult)


        if (!passportNames || !userToken) {
            return;
        }
        const regionsResult = await setRequestPassports(req?.ID, passportNames, userToken)
        console.log(regionsResult)

    }

    return(
        <>
        <h1>Редактирование заявки #{reqId}</h1>
        <h4>Паспорта:</h4>
        <ListGroup style={{width: '500px'}}>
            {passportNames?.map((passportName, passportID) => (
                <ListGroupItem key={passportID}> {passportName}
                    <span className="pull-right button-group" style={{float: 'right'}}>
                        <Button variant="danger" onClick={removePassport(passportName)}>Удалить</Button>
                    </span>
                </ListGroupItem>
            ))
            }
        </ListGroup>
        <span>
            <input ref={newPassportInputRef} onChange={handleNewPassportChange}></input>
            <Button onClick={addPassport}>Добавить</Button>
        </span>
        <h4>Характеристики:</h4>
        <Form>
            <FormGroup>
                <label htmlFor="statusInput">Статус</label>
                <FormSelect id="statusInput" defaultValue={req?.Status} ref={statusRef}>
                    <option>Черновик</option>
                    <option>Удалена</option>
                    <option>На рассмотрении</option>
                    <option>Завершена</option>
                    <option>Отклонена</option>
                </FormSelect>
            </FormGroup>
        
        </Form>
        <Button onClick={sendChanges}> Сохранить изменения</Button>
        <p></p>
        <Button href='/border_crossing_facts'>К заявкам</Button>
        <p></p>
        <Button href='/passports'>К паспортам</Button>
        <p></p>
        </>
    )

}

export default BorderCrossFactDetPage;
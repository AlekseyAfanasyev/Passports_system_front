import { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { Row, Col } from 'react-bootstrap'

import BorderCrossFactReqCard from '../components/BorderCrossFactReqCard/BorderCrossFactReqCard'
import store from '../store/store'
import { getTransfReqs } from '../modules/get-all-requests'
import { BorderCrossingFactRequest } from '../modules/ds'

const BorderCrossFact: FC = () => {
    const {userToken, userRole, userName} = useSelector((state: ReturnType<typeof store.getState>) => state.auth)

    const [bordercrfactReqs, setBordercrfactReqs] = useState<BorderCrossingFactRequest[]>([])

    useEffect(() => {
        const loadBordercrfactReqs = async()  => {
            if (userToken !== undefined) {
                const result = (await getTransfReqs(userToken?.toString(), '')).filter((item) => {
                    if (userRole === '1') {
                        return item.Client?.Name === userName;
                    } else {
                        console.log(userName)
                        return item.Moder?.Name === userName;
                    }
                  });
                  setBordercrfactReqs(result)
            }

        }

        loadBordercrfactReqs()

    }, []);

    return (
        <>
            {!userToken &&
                <h3> Вам необходимо войти в систему! </h3>

            }
            {userToken && bordercrfactReqs.length == 0 &&
                <h3> Заявки не найдены</h3>
            }
            <Row xs={4} md={4} className='g-4' >
                {bordercrfactReqs.map((item, index) => (
                    <Col key={index}> 
                        <BorderCrossFactReqCard {...{
                            id: item.ID,
                            status: item.Status,
                            dateCreated: item.DateCreated,
                            dateProcessed: item.DateProcessed,
                            dateFinished: item.DateFinished,
                        }}></BorderCrossFactReqCard>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default BorderCrossFact
import { FC, useEffect, useState } from 'react'
import './styles/style.css'
import { useParams } from 'react-router-dom';
import { getPassportByName } from './modules/get-passport-by-name'
import { Passport } from './modules/ds'
import NavigationMain from './components/NavigationMain';
import Breadcrumbs from './components/Breadcrumbs';


const PassportPage: FC = () => {
    const [passport, setPassport] = useState<Passport>()

    const { passport_name } = useParams();

    useEffect(() => {
        console.log("passport_name: ", passport_name)

        const loadOrbit = async () => {
            const result = await getPassportByName(String(passport_name))
            setPassport(result)
        }

        loadOrbit()
    }, [passport_name]);

    return (
        <div>
            <NavigationMain/>
            <Breadcrumbs/>
            
            <div className="card-sub">
          
                <div className="card-content-sub">
                    <img src={`data:image/png;base64, ${passport?.Image}`} className="card_image" alt="картинка" />
                    <div className="right-content-sub">
                        <p><span className="passport-label">Статус:</span> {passport?.IsFree ? 'Доступен' : 'Недоступен'}</p>
                        <p><span className="passport-label">Серия:</span> {passport?.Seria}</p>
                        <p><span className="passport-label">Дата выдачи:</span> {passport?.Issue}</p>
                        <p><span className="passport-label">Код отделения:</span> {passport?.Code}</p>
                        <p><span className="passport-label">Пол:</span> {passport?.Gender}</p>
                        <p><span className="passport-label">Дата рождения:</span> {passport?.Birthdate}</p>
                        <p><span className="passport-label">Место рождения:</span> {passport?.BDplace}</p>
                    </div>
                </div>
                <a className="button page_button" href="../passports">Назад</a>
            </div>
        </div>
    )
}

export default PassportPage

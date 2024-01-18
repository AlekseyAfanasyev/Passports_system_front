import { FC, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Passport } from '../../modules/ds';
import store from '../../store/store';
import { getPassportByName } from '../../modules/get-passport-by-name';
import { editPassport } from '../../modules/EditPassport';
import { addNewPassport } from '../../modules/AddNewPassport';
import { uploadPassportImage } from '../../modules/UploadPassportImage';
import "./PassportForm.styles.css"

const PassportForm: FC = () => {
    const navigate = useNavigate();
    const { passport_name } = useParams();
    const [passport, setPassport] = useState<Passport | null>(null);
    const [passportAdd, setPassportAdd] = useState<string | null>();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    useEffect(() => {
        if (passport_name && passport_name !== 'add') {
            localStorage.setItem("flag", "edit")
            getPassportByName(passport_name)
                .then((response) => setPassport(response))
                .catch((error) => console.error('Ошибка при получении данных о паспорте:', error));
        } else {
            setPassport({
                Name: '',
                Seria: '',
                Issue: '',
                Code: '',
                Gender: '',
                Birthdate:'',
                BDplace:'',
                ID: 0,
                Image: '',
                IsFree: false
            });
            localStorage.setItem("flag", "add")
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === 'file') {
            const file = e.target.files && e.target.files[0];
            if (file) {
                setImageFile(file);
            }
        } else {
            setPassport((prevPassport) => ({
                ...prevPassport!,
                [e.target.name]: e.target.value,
            }));
        }
    };    

    const handleImageUpload = async () => {
        try {
            if (imageFile) {
                const imageUrl = await uploadPassportImage(userToken?.toString(), imageFile, passport?.Name);
                setPassport((prevPassport) => ({
                    ...prevPassport!,
                    ImageURL: imageUrl,
                }));
                console.log("new image: ", imageUrl);
                console.log("passport image: ", passport?.Image);
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
        }
    };

    const handlePassportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await handleImageUpload();

            if (passport) {
                if (passport_name && localStorage.getItem("flag") == "edit") {
                    console.log("passport image edit: ", passport?.Image);
                    const updatedPassport = await editPassport(userToken?.toString(), passport);
                    setPassport(updatedPassport);
                    navigate(`/passports/${updatedPassport.Name}/edit`);
                } else {
                    console.log("passport image add: ", passport?.Image);
                    const newPassport = await addNewPassport(userToken?.toString(), passport);
                    setPassport(newPassport);
                    localStorage.setItem("flag", "edit")
                    navigate(`/passports/${newPassport.Name}/edit`);
                }
                await handleImageUpload();
            }
        } catch (error) {
            console.error('Ошибка при сохранении паспорта:', error);
        }
    };

    return (
        <div className="form-container">
        <Form onSubmit={handlePassportSubmit} encType="multipart/form-data">
        <Form.Group controlId="formPassportImage">
            
            <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
            />
            {passport?.Image && (
            <img
                src={passport.Image}
                alt={`Passport ${passport.Name} Image`}
                style={{ maxWidth: '40%', marginBottom: '10px' }}
            />
        )}
        </Form.Group>
            <Form.Group controlId="formPassportName">
                <Form.Label>Название паспорта</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите название"
                    name="Name"
                    value={passport?.Name || ''}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formPassportSeria">
                <Form.Label>Серия</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите серию"
                    name="Seria"
                    value={passport?.Seria || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formPassportSeria">
                <Form.Label>Дата выдачи</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите дату выдачи"
                    name="Issue"
                    value={passport?.Issue || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formPassportSeria">
                <Form.Label>Код подразделения</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите код подразделения"
                    name="Code"
                    value={passport?.Code || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formPassportSeria">
                <Form.Label>Пол</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите пол"
                    name="Gender"
                    value={passport?.Gender || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formPassportSeria">
                <Form.Label>Дата рождения</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите дату рождения"
                    name="Birthdate"
                    value={passport?.Birthdate || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formPassportSeria">
                <Form.Label>Место рождения</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите место рождения"
                    name="BDplace"
                    value={passport?.BDplace || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                {passport_name && passport_name !== 'add' ? 'Сохранить изменения' : 'Добавить паспорт'}
            </Button>
        </Form>
        </div>
    );
};

export default PassportForm;
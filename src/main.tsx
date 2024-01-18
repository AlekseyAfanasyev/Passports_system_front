
import ReactDOM from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom'
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import NavigationMain from './components/NavigationMain/NavigationMain';
import PassportsPage from './pages/PassportsPage'
import PassportPage from './pages/PassportPage'
import PassportForm from './components/PassportForm/PassportForm';

import LoginPage from './pages/AuthPage';
import Register from './pages/RegisterPage/RegisterPage';
import Profile from './pages/ProfilePage';
// import BorderCrossFact from './pages/BorderCrossFactPage';
import TransfReq from './pages/RequestsAllPage/RequestsAllPage';
import BorderCrossFactDetPage from './pages/BorderCrossFactDetPage';
import Cart from './pages/CartPage';
import NotFoundPage from './NotFoundPage';
import store from './store/store';
import { Provider } from 'react-redux';
import Footer from './components/Footer/Footer';

ReactDOM.createRoot(document.getElementById('root')!).render(
     <Provider store={store}>
      <BrowserRouter>
        <NavigationMain />
        <Breadcrumbs />
        <Routes>
          <Route path="/Passports_system_front" Component={PassportsPage} />
          <Route path="/Passports_system_front/:passport_name" Component={PassportPage} />
          <Route path="/border_crossing_facts" Component={TransfReq} />
          <Route path="/border_crossing_facts/:req_id" Component={BorderCrossFactDetPage} />
          <Route path="/Passports_system_front/:passport_name/edit" element={<PassportForm />} />
          <Route path="/Passports_system_front/add_new_passport" element={<PassportForm />} />
          <Route path="/cart" Component={Cart} />
          <Route path="/profile" Component={Profile} />
          <Route path="/login" Component={LoginPage} />
          <Route path="/register" Component={Register} />
          <Route path="*" Component={NotFoundPage} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
)
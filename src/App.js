import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TablePage from './pages/TablePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<LoginPage />} />
        <Route path={'/register'} element={<RegisterPage />} />
        <Route path={'/employees'} element={<TablePage />} />
        <Route path={'/profile'} element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

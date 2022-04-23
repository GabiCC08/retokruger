import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { useEffect, useState } from 'react';
import data from './data.json';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TablePage from './pages/TablePage';

function App() {
  const [users, setUsers] = useState({ ...data });
  const getUsers = JSON.parse(localStorage.getItem('userList'));

  useEffect(() => {
    setUsers(getUsers);
  }, []);

  // Iniciar sesión
  const loginUser = (userData) => {
    localStorage.setItem('userLog', JSON.stringify(userData));
  };

  // Añadir usuario
  const addUser = (newUser) => {
    setUsers([...users, newUser]);
    localStorage.setItem('userList', JSON.stringify([...users, newUser]));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={'/'}
          element={users ? <LoginPage usersData={users} onLogin={loginUser} /> : ''}
        />
        <Route
          path={'/register'}
          element={users ? <RegisterPage usersData={users} onSave={addUser} /> : ''}
        />
        <Route path={'/employees'} element={users ? <TablePage usersData={users} /> : ''} />
        <Route path={'/profile'} element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

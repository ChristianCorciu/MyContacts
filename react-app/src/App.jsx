// filepath: react-app/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import ContactsPage from './pages/ContactsPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
    </>
  );
}

export default App;
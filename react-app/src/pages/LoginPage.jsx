
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:3000/auth/login', formData);
            localStorage.setItem('token', response.data.token); 
            navigate('/contacts');
        } catch (err) {
            setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Mot de passe:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Se connecter</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
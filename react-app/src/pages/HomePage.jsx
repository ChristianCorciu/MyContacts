import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1> App My contact Christian Corciu </h1>
            
            <nav>
                <Link to="/register">Inscription</Link>
            </nav>
        </div>
    );
};

export default HomePage;
import React, { useContext, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const UserAuth = ({ children }) => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        setTimeout(() => {
            const user = sessionStorage.getItem('user');
            const token = sessionStorage.getItem('token');

            console.log("Authentication Check - User:", user);
            console.log("Authentication Check - Token:", token);

            if (token) {
                setUser(user);
                setLoading(false);
            } else {
                navigate('/login');
            }
        }, 100); // Small delay to ensure sessionStorage is updated
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default UserAuth;

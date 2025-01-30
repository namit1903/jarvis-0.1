import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie';
import chatBotAnimation from '../assets/robot.json'; // Import AI chat bot animation (Download from LottieFiles)

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault();

        axios.post('/users/login', { email, password })
            .then((res) => {
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('user', JSON.stringify(res.data.user));
                Cookies.set('token', res.data.token, { expires: 1, sameSite: 'Strict' });
                Cookies.set('user', JSON.stringify(res.data.user), { expires: 1, secure: true, sameSite: 'Strict' });
                setUser(res.data.user);
                navigate('/');
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: chatBotAnimation, // Adjust this path based on your downloaded animation
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <motion.div 
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-800 p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
        >
            <motion.div 
                className="bg-gray-900 p-10 rounded-lg shadow-2xl w-full max-w-md border-t-4 border-blue-400"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl font-extrabold text-white mb-6 text-center">AI Chat Login</h2>
                
                {/* Lottie Chat Bot Animation */}
                <div className="flex justify-center mb-6">
                    <Lottie options={defaultOptions} height={150} width={150} />
                </div>
                
                <form onSubmit={submitHandler}>
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2 text-sm font-medium" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2 text-sm font-medium" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full p-4 rounded-lg bg-blue-500 text-white font-semibold text-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Login
                    </motion.button>
                </form>
                <p className="text-gray-400 mt-4 text-center text-sm">
                    Don't have an account? 
                    <Link to="/register" className="text-blue-400 hover:text-blue-500 transition duration-300">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Login;

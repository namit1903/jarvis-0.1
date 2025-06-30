import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { motion } from 'framer-motion';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault();
        console.log("email:",email)
        console.log("password:",password)
        axios.post('/users/register', { email, password })
            .then((res) => {
                console.log("registered successfully");
                console.log(res.data);
                sessionStorage.setItem('token', res.data.token);
                localStorage.setItem('token', res.data.token);
                setUser(res.data.user);
                navigate('/');
            })
            .catch((err) => {
                console.log("register error");
                console.log(err.response);
            });
    }

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
                <h2 className="text-3xl font-extrabold text-white mb-6 text-center">AI Chat Registration</h2>

                {/* Animated Chatbot Icon (using CSS animation) */}
                <div className="flex justify-center mb-6">
                    <div className="animate-bounce">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500 h-24 w-24"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12h8M8 8h8" />
                        </svg>
                    </div>
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
                            autoComplete="new-password"
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full p-4 rounded-lg bg-blue-500 text-white font-semibold text-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Register
                    </motion.button>
                </form>

                <p className="text-gray-400 mt-4 text-center text-sm">
                    Already have an account? 
                    <Link to="/login" className="text-blue-400 hover:text-blue-500 transition duration-300">
                        Login
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;

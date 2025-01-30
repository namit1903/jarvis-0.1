import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const [token, setToken] = useState('');

    function createProject(e) {
        e.preventDefault();
        axios.post('/projects/create', { name: projectName })
            .then((res) => {
                setIsModalOpen(false);
                setProjects((prev) => [...prev, res.data.project]);
            })
            .catch((error) => console.log(error));
    }

    function handleLogout() {
        axios.get('/users/logout', {}, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                setUser(null);
                navigate('/login');
            })
            .catch((err) => console.log('Logout error:', err));
    }

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const storedToken = localStorage.getItem('token') || 
                    document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
                setToken(storedToken);
                if (storedToken) {
                    const res = await axios.get('/projects/all', {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });
                    setProjects(res.data.projects);
                }
            } catch (err) {
                console.log('Cannot get all projects in HOME', err);
            }
        };
        fetchProjects();
    }, []);

    return (
        <motion.main 
            className="relative min-h-screen p-4 max-w-6xl mx-auto flex flex-col"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
        >
            {/* Animated Background */}
            <motion.div 
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{
                    background: 'radial-gradient(circle, rgba(34,193,195,0.3) 0%, rgba(253,187,45,0.2) 100%)',
                    height: '100%',
                    width: '100%',
                }}
            />

            {/* Top Bar with Logout */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Your Chatrooms</h1>
                <button 
                    onClick={handleLogout} 
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                    Logout
                </button>
            </div>

            {/* Project Chatrooms */}
            <div className="projects grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Create Project Button */}
                <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className="p-4 border border-slate-300 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    New Chatroom <i className="ri-add-line ml-2"></i>
                </motion.button>

                {projects.map((project) => (
                    <motion.div 
                        key={project._id}
                        onClick={() => navigate(`/project`, { state: { project } })}
                        className="flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md hover:bg-slate-200 transition-all"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <h2 className='font-semibold'>{project.name}</h2>
                        <p className="text-sm text-gray-600">Collaborators: {project.users.length}</p>
                    </motion.div>
                ))}
            </div>

            {/* Create Chatroom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <motion.div 
                        className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl mb-4">Create New Chatroom</h2>
                        <form onSubmit={createProject}>
                            <label className="block text-sm font-medium text-gray-700">Chatroom Name</label>
                            <input
                                onChange={(e) => setProjectName(e.target.value)}
                                value={projectName}
                                type="text" 
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                                required 
                            />
                            <div className="flex justify-end mt-4">
                                <button 
                                    type="button" 
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <motion.button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Create
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.main>
    );
};

export default Home;

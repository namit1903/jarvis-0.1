import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/user.context';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../config/axios';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js';
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { RiUserFill, RiCloseFill, RiSendPlaneFill, RiAddFill, RiGroupFill } from 'react-icons/ri';

function SyntaxHighlightedCode(props) {
    const ref = useRef(null);

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current);
            ref.current.removeAttribute('data-highlighted');
        }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
}

const Project = () => {
    const location = useLocation();
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(new Set());
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const messageBox = useRef(null);

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [fileTree, setFileTree] = useState({});

    const [currentFile, setCurrentFile] = useState(null);
    const [openFiles, setOpenFiles] = useState([]);

    const [webContainer, setWebContainer] = useState(null);
    const [iframeUrl, setIframeUrl] = useState(null);
    const [runProcess, setRunProcess] = useState(null);

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }
            return newSelectedUserId;
        });
    };

    const send = () => {
        sendMessage('project-message', {
            message,
            sender: user,
        });
        setMessages(prevMessages => [...prevMessages, { sender: user, message }]);
        setMessage('');
    };

    useEffect(() => {
        initializeSocket(project._id);
        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container);
                console.log('container started');
            });
        }

        receiveMessage('project-message', data => {
            if (data.sender._id === 'ai') {
                const message = JSON.parse(data.message);
                webContainer?.mount(message.fileTree);
                if (message.fileTree) {
                    setFileTree(message.fileTree || {});
                }
                setMessages(prevMessages => [...prevMessages, data]);
            } else {
                setMessages(prevMessages => [...prevMessages, data]);
            }
        });

        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            setProject(res.data.project);
            setFileTree(res.data.project.fileTree || {});
        });

        axios.get('/users/all').then(res => {
            setUsers(res.data.users);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <main className='h-screen w-screen flex flex-col md:flex-row bg-gray-100'>
            {/* Left Section - Chat */}
            <section className="left relative flex flex-col h-full md:h-screen w-full md:min-w-96 bg-slate-300">
                <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100'>
                    <button className='flex gap-2 items-center hover:bg-slate-200 p-2 rounded-md' onClick={() => setIsModalOpen(true)}>
                        <RiAddFill className="text-xl" />
                        <p>Add collaborator</p>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 hover:bg-slate-200 rounded-md'>
                        <RiGroupFill className="text-xl" />
                    </button>
                </header>
                <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
                    <SimpleBar className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'} message flex flex-col p-2 bg-slate-50 w-fit rounded-md hover-scale`}>
                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                <div className='text-sm'>
                                    {msg.sender._id === 'ai' ? WriteAiMessage(msg.message) : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </SimpleBar>
                    <div className="inputField w-full flex absolute bottom-0">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className='p-2 px-4 border-none outline-none flex-grow bg-white'
                            type="text"
                            placeholder='Enter message'
                        />
                        <button
                            onClick={send}
                            className='px-5 bg-slate-950 text-white hover:bg-slate-800 transition-colors'>
                            <RiSendPlaneFill className="text-xl" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Right Section - Code Editor and Preview */}
            <section className="right flex-grow h-full flex flex-col md:flex-row bg-red-50">
                {/* File Explorer */}
                <div className="explorer h-full w-full md:max-w-64 md:min-w-52 bg-slate-200">
                    <div className="file-tree w-full">
                        {Object.keys(fileTree).map((file, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentFile(file);
                                    setOpenFiles([...new Set([...openFiles, file])]);
                                }}
                                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full hover:bg-slate-400 transition-colors">
                                <p className='font-semibold text-lg'>{file}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Code Editor */}
                <div className="code-editor flex flex-col flex-grow h-full shrink">
                    <div className="top flex justify-between w-full p-2 bg-slate-300">
                        <div className="files flex overflow-x-auto">
                            {openFiles.map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentFile(file)}
                                    className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''} hover:bg-slate-400 transition-colors`}>
                                    <p className='font-semibold text-lg'>{file}</p>
                                </button>
                            ))}
                        </div>
                        <div className="actions flex gap-2">
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree);
                                    const installProcess = await webContainer.spawn("npm", ["install"]);
                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk);
                                        },
                                    }));
                                    if (runProcess) {
                                        runProcess.kill();
                                    }
                                    let tempRunProcess = await webContainer.spawn("npm", ["start"]);
                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk);
                                        },
                                    }));
                                    setRunProcess(tempRunProcess);
                                    webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url);
                                        setIframeUrl(url);
                                    });
                                }}
                                className='p-2 px-4 bg-slate-950 text-white hover:bg-slate-800 transition-colors'>
                                Run
                            </button>
                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                        {fileTree[currentFile] && (
                            <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                <pre className="hljs h-full">
                                    <code
                                        className="hljs h-full outline-none"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const updatedContent = e.target.innerText;
                                            const ft = {
                                                ...fileTree,
                                                [currentFile]: {
                                                    file: {
                                                        contents: updatedContent,
                                                    },
                                                },
                                            };
                                            setFileTree(ft);
                                            saveFileTree(ft);
                                        }}
                                        dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            paddingBottom: '25rem',
                                            counterSet: 'line-numbering',
                                        }}
                                    />
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview */}
                {iframeUrl && webContainer && (
                    <div className="flex min-w-96 flex-col h-full">
                        <div className="address-bar">
                            <input
                                type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl}
                                className="w-full p-2 px-4 bg-slate-200"
                            />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full"></iframe>
                    </div>
                )}
            </section>

            {/* Modal for Adding Collaborators */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-slate-200 rounded-md'>
                                <RiCloseFill className="text-xl" />
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ''} p-2 flex gap-2 items-center`}
                                    onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <RiUserFill className="absolute" />
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Project;
import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js'
import { getWebContainer } from '../config/webcontainer'

function SyntaxHighlightedCode(props) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && props.className?.includes('lang-') && window.hljs) {
      window.hljs.highlightElement(ref.current)
      ref.current.removeAttribute('data-highlighted')
    }
  }, [props.className, props.children])

  return <code {...props} ref={ref} />
}

const Project = () => {
  const location = useLocation()
  const { user } = useContext(UserContext)

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(new Set())
  const storedProject = JSON.parse(sessionStorage.getItem('project')) || location.state?.project || null
  const [project, setProject] = useState(storedProject)
  const [message, setMessage] = useState('')
  const messageBox = useRef(null)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [fileTree, setFileTree] = useState({})
  const [currentFile, setCurrentFile] = useState(null)
  const [openFiles, setOpenFiles] = useState([])
  const [webContainer, setWebContainer] = useState(null)
  const [iframeUrl, setIframeUrl] = useState(null)
  const [runProcess, setRunProcess] = useState(null)

  // Handle scrolling on new messages
  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight
    }
  }, [messages])

  const handleUserClick = id => {
    setSelectedUserId(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function addCollaborators() {
    axios
      .put('/projects/add-user', {
        projectId: project._id,
        users: Array.from(selectedUserId),
      })
      .then(res => {
        console.log(res.data)
        setIsModalOpen(false)
      })
      .catch(console.log)
  }

  const send = () => {
    if (!message.trim()) return
    sendMessage('project-message', { message, sender: user })
    setMessages(prev => [...prev, { sender: user, message }])
    setMessage('')
  }

  function WriteAiMessage(msg) {
    const { text } = JSON.parse(msg)
    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
        <Markdown
          children={text}
          options={{ overrides: { code: SyntaxHighlightedCode } }}
        />
      </div>
    )
  }

  // Initial data fetch & container setup
  useEffect(() => {
    if (!webContainer) {
      getWebContainer().then(container => {
        setWebContainer(container)
        console.log('container started')
      })
    }
    axios.get(`/projects/get-project/${project._id}`).then(res => {
      setProject(res.data.project)
      setFileTree(res.data.project.fileTree || {})
    })
    axios
      .get('/users/all')
      .then(res => setUsers(res.data.users))
      .catch(console.log)
  }, [])

  // Socket init and message listener
  useEffect(() => {
    if (!project) return
    initializeSocket(project._id)

    const handleMessage = data => {
      if (data.sender._id === 'ai') {
        const parsed = JSON.parse(data.message)
        webContainer?.mount(parsed.fileTree)
        if (parsed.fileTree) setFileTree(parsed.fileTree)
        setMessages(prev => [...prev, data])
      } else {
        setMessages(prev => [...prev, data])
      }
    }

    receiveMessage('project-message', handleMessage)

    return () => {
      if (window.socket?.off) {
        window.socket.off('project-message', handleMessage)
        console.log('Removed project-message listener')
      }
    }
  }, [project, webContainer])

  // Persist project
  useEffect(() => {
    if (project) sessionStorage.setItem('project', JSON.stringify(project))
  }, [project])

  function saveFileTree(ft) {
    axios
      .put('/projects/update-file-tree', { projectId: project._id, fileTree: ft })
      .then(res => console.log(res.data))
      .catch(console.log)
  }

  return (
    <main className="h-screen w-screen flex">
      {/* ... rest of your UI unchanged ... */}
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        {/* Conversation + input */}
        <div
          ref={messageBox}
          className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message flex flex-col p-2 bg-slate-50 w-fit rounded-md
                ${msg.sender._id === user?._id?.toString() ? 'ml-auto' : ''}
                ${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'}`}
            >
              <small className="opacity-65 text-xs">{msg.sender.email}</small>
              <div className="text-sm">
                {msg.sender._id === 'ai' ? WriteAiMessage(msg.message) : <p>{msg.message}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="inputField w-full flex absolute bottom-0">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="p-2 px-3 h-20 border-none outline-none flex-grow"
            placeholder="Enter message or Type @ai <talk to Gemini>"
          />
          <button onClick={send} className="px-5 bg-slate-950 text-white">
            <i className="ri-send-plane-fill" />
          </button>
        </div>
      </section>
      {/* Include the rest of your panels, code editor, iframe, modals, etc. unchanged */}
    </main>
  )
}

export default Project

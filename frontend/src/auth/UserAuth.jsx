import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'

const UserAuth = ({ children }) => {
    const user = sessionStorage.getItem('user')
    // const { user } = useContext(UserContext)
    console.log("authentication",user)
    const [ loading, setLoading ] = useState(true)
    const token = sessionStorage.getItem('token')
    // const token = localStorage.getItem('token')
    console.log("token",token)
    
    const navigate = useNavigate()




    useEffect(() => {
        if (user) {
            setLoading(false)
        }
        // if (token) {
        //     setLoading(false)
        // }

        if (!token) {
            navigate('/login')
        }

        // if (!user) {
        //     navigate('/login')
        // }

    }, [])

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <>
            {children}</>
    )
}

export default UserAuth
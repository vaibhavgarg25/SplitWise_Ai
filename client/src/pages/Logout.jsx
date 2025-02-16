import React,{useEffect} from 'react'
import { useAuth } from '../context/Context'
import { Navigate } from 'react-router-dom'

const Logout = () => {

    const {LogoutUser} = useAuth() 

    useEffect(() => {
        LogoutUser()
    }, [LogoutUser])
    
  return (
    <div>
        <Navigate to="/" />
    </div>
)
}

export default Logout
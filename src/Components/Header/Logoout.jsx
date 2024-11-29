import React from 'react'
import { useDispatch } from 'react-redux'
import authservice from '../../appwrite/auth'
import {logout} from '../../Store/AuthSlice'

function Logoout() {
    const dispatch = useDispatch()
    const logouthandler = ()=>{
        authservice.logout().then(()=>{
            dispatch(logout())
        })
    }
  return (
   <button className='inline-block px-6 py-2 duration-200 hover:bg-blue-700 rounded-full'>Logout</button>
  )
}

export default Logoout

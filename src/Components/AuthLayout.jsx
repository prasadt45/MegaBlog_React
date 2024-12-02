import React ,  {useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Protected({children , authentication = true }) {
    // It is Mechanism to protect our route kind of protected component 
    const navigate = useNavigate() 
    const [loader , setLoader] = useState(true) ; 
    const authStatus = useSelector(state=> state.auth.status)

    useEffect(()=>{
        if(authentication && authStatus!==authentication){
            navigate('/login')
        }else if(!authentication && authStatus!==authentication){
            navigate('/login')
        }
         setLoader(false)
    } , [authStatus , navigate , authentication])// whenever there is change in navaigtae , authentication this hook will run agin

    return loader ? <h1>Loading...</h1> : <>{children}</>
}



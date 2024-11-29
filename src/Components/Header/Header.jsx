import React from 'react'
import {Container , Logo , Logoout} from '../index'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authstuats = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const navitems =[
    {
      name : "Home" , 
      slug : "/" ,
      active : true
    } ,
    {
      name : "Login" , 
      slug : "/login" , 
      active : !authstuats

    } ,
     {
      name : "Signup" , 
      slug: "/signup" , 
      active : !authstuats

    } ,
    {
      name : "All Posts" , 
      slug: "/allposts" ,
      active : authstuats

    }
    ,{
      name : "Add Posts " , 
      slug : "/addpost" ,
      active : authstuats
    }
  ]
  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to = '/'>
            <Logo width = '70px'>

            </Logo>
            </Link>
          </div>

          <ul className='flex ml-auto '>
            {navitems.map((item)=>
            item.active ?(
              <li key={item.name}>
                <button onClick={()=>navigate(item.slug)}
                  className='inline-block px-6 py-2 duration-200 hover:bg-blue-500 rounded-full'>{item.name}</button>
              </li>
            ) :null
            )}
 
          {authstuats && (
            <li>
              <Logoout/>
            </li>
          )}

          </ul>
        </nav>
      </Container>
    </header>
    
  )
}

export default Header

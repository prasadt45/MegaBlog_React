import React from 'react'
import logo from '../assets/logo.jpg'

function Logo({width = '50px'}) {
  return (
    <img width={'100px'} src= {logo} alt="" />
  )
}

export default Logo
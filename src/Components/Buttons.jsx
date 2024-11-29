import React from 'react'

function Buttons({
    childeren,
    type = 'button',
    bgColor = 'bg-blue-200',
    textColor = 'text-white',
    className = '',
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props}>
            {childeren}
        </button>
        // when we create a login page so input filed is a diff seprate component to get state of that comeponent in login page we use forwardref hook by react  
        
    )
}

export default Buttons

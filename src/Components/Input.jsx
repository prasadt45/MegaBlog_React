import React , {useId} from 'react'

const Input = React.forwardRef(function Input({
    label , 
    type = 'text',
    className = "" , 
    ...props
} , ref){// need to pass ref when forwardref used
    
    const id = useId()
    return (
        <div className='w-full'>
            { label && 
            <label className='block text-sm font-medium text-gray-700' htmlFor={props.id}>{label}</label>
            }

            <input type={type}
              className= {`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full {${className}`}
              ref={ref} // will give refrence from parent component 
              {...props}
              id={id}
              
              />
        </div>
    )
})

export default Input

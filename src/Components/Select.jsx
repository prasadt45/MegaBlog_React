import React , {useId} from 'react'
function Select(
    {
        options,
        label , 
        className = "" ,
        ...props
    } , ref 
) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor = {id} className='text-sm'></label>}
        <select
        {...props}
        id={id} 
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        >
            // if options has value then loop
            {options?.map((option)=>(
                <option key={option} value={option.value}>{option}</option>
            ))}

        </select>

    </div>
  )
}

export default React.forwardRef(Select)  // forward ref can also be used like this

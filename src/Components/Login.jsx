import React , {useState } from 'react'
import { Link  , useNavigate} from 'react-router-dom'
import { login as AuthLogin } from '../Store/AuthSlice'
import {Buttons , Input , Logo} from '../Components'
import {useDispatch} from 'react-redux' 
import authservice from '../appwrite/auth'
import { useForm } from 'react-hook-form'

function Login() {
    const navigate = useNavigate() 
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error , setError] = useState(null)
   
    const login = async(data)=>{
        setError("")
        try {
            // whenever user logged in session is created 
           const session =  await authservice.login(data)
           if(session){
            const userdata = await authservice.getCurrentUser()
            if(userdata){
                dispatch(AuthLogin(userdata))
            }
            navigate('/') // by using navigate it will automatically go to home page if logged in 
            // Link not used as it required click to go anywhere
           }
        } catch (error) {
            setError(error.message) ; 
            
        }
    }

  return ( 
  <div className='flex items-center justify-center w-full'>
      <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
      <div className="mb-2 flex justify-center">
                  <span className="inline-block w-full max-w-[100px]">
                      <Logo width="100%" />
                  </span>
      </div>
      <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
      <p className="mt-2 text-center text-base text-black/60">
                  Dont have any account?&nbsp;
                  <Link
                      to="/signup"
                      className="font-medium text-primary transition-all duration-200 hover:underline"
                  >
                      Sign Up
                  </Link>
      </p>
       { /*     to display error  */}
      {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
       {/* Handle Submit ispredefined method  */}
      <form onSubmit={handleSubmit(login)} className='mt-8'>
          <div className='space-y-5'>
             {/* BVelow Input is cOMPNENT WHICH WE HAVE DEFINED   */}
              <Input 
              label="Email: "
              placeholder="Enter your email"
              type="email"
              
              {...register("email", 
                {
                  required: true,
                  validate: {
                      /*  Bellow is regualr expression to validae email   */
                      matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  }
              })}
              />
              <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                  required: true,
              })}
              />
              <Buttons
              type="submit"
              className="w-full"
              >Sign in</Buttons>
          </div>
      </form>
      </div>
  </div>
  )

}

export default Login

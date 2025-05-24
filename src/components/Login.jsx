import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login as authLogin } from '../store/authSlice';
import authService from '../appwrite/auth';
import { Button, Input, Logo } from './index';
import loginImage from '../assets/login.png'; 

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const login = async (data) => {
        setError('');
        setSuccess('');
        try {
            await authService.login({
                email: data.email,
                password: data.password,
            });

            const userData = await authService.getCurrentUser();
            if (userData) {
                dispatch(authLogin(userData));
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError('User data missing after login.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError(err?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-200 to-blue-100 p-4">
            <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl">

                {/* Left Image Section */}
                <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-tr from-blue-300 via-blue-100 to-blue-300 h-[560px]">
                    <img
                        src={loginImage}
                        alt="Login"
                        className="max-w-[85%] object-contain rounded-3xl shadow-md"
                    />
                </div>

                {/* Right Form Section - Taller */}
                <div className="w-full md:w-1/2 p-6  bg-white h-[560px] flex flex-col justify-center">
                    <div className="mb-4 flex justify-center">
                        <Logo width="60px" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800">Sign in to your account</h2>
                    <p className="text-center text-sm text-gray-500 mt-1">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>

                    {error && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm animate-pulse">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm animate-fade-in">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">
                        <Input
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        'Email address must be valid',
                                },
                            })}
                        />
                        <Input
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password', {
                                required: 'Password is required',
                            })}
                        />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Sign in
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

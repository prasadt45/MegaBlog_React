import React, { useState } from 'react';
import authService from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from './index.js';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import signupimage from '../assets/signup.jpg';

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const create = async (data) => {
        setError('');
        setSuccess('');
        try {
            await authService.createAccount(data);
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                dispatch(authLogin(currentUser));
                setSuccess('🎉 Signup successful! Redirecting...');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (err) {
            console.error('Error during signup:', err);
            setError(err.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 p-4">
            <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl transition-all duration-300">
                
                {/* Left Side Image */}
                <div className="hidden md:flex md:w-2/3 bg-gradient-to-tr from-blue-300 via-blue-100 to-blue-300 items-center justify-center p-6">
                    <img
                        src={signupimage}
                        alt="Signup Illustration"
                        className="w-100 max-w-[90%] object-contain rounded-2xl shadow-md"
                    />
                </div>

                {/* Right Side Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-10 bg-white">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Logo width="60px" />
                    </div>

                    <h2 className="text-3xl font-bold text-center text-gray-800">Create your account</h2>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold hover:underline transition duration-200"
                        >
                            Sign In
                        </Link>
                    </p>

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm animate-shake">
                            ❌ {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm animate-pulse">
                            ✅ {success}
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit(create)} className="mt-6 space-y-5">
                        <Input
                            label="Full Name:"
                            placeholder="Enter your full name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        <Input
                            label="Email:"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email', {
                                required: 'Email is required',
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid email address',
                                },
                            })}
                        />
                        <Input
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password', { required: 'Password is required' })}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition duration-300"
                        >
                            Create Account
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;

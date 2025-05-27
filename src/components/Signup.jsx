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
                setSuccess('Signup successful! Redirecting...');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (err) {
            console.error('Error during signup:', err);
            setError(err.message || 'Signup failed. Please try again.')
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-200 to-blue-100 p-8">
            <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl">
                
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-300 via-blue-100 to-blue-300 items-center justify-center">
                    <img
                        src={signupimage}
                        alt="Signup Illustration"
                        className="max-w-[75%] object-contain rounded-3xl shadow-lg"
                    />
                </div>

                <div className="w-full md:w-1/3 p-10 bg-white">
                    <div className="mb-4 flex justify-center">
                        <Logo width="60px" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800">Create your account</h2>
                    <p className="text-center text-sm text-gray-500 mt-1">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Sign In
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
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Create Account
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;

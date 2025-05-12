import React, { useState } from 'react';
import authService from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from './index.js';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const create = async (data) => {
        setError('');
        try {
            // Call authService to create a new account
            await authService.createAccount(data);

            // Fetch current user information after successful account creation
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                dispatch(authLogin(currentUser));
                navigate('/'); // Redirect to the home page
            }
        } catch (err) {
            console.error('Error during signup:', err);
            setError(err.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create an account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(create)} className="mt-8 space-y-5">
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
                    <Button type="submit" className="w-full">
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Signup;

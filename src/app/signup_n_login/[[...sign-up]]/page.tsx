'use client';

import React, { useState } from 'react';

const SignUpAndLogin = () => {
    const [formType, setFormType] = useState('signup'); // login or signup 폼 구분 상태변수
    // SignUp 폼 요소값 상태변수
    const [signUpFields, setSignUpFields] = useState({
        username: '',
        emailAddress: '',
        password: '',
    });
    // Login 폼 요소값 상태변수
    const [loginFields, setLoginFields] = useState({
        identifire: '', // email (id 대신)
        password: '',
    });

    const handleSignUpFieldChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        setSignUpFields({
            ...signUpFields,
            [name]: value,
        });
    };

    const handleLoginFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        setLoginFields({
            ...loginFields,
            [name]: value,
        });
    };

    const changeFormType = () => {
        if (formType === 'login') {
            setFormType('signup');
        } else {
            setFormType('login');
        }
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className='px-46 py-56 bg-gray-50'>
            <div className='flex relative w-full min-w-[700px] max-w-[800px] h-[340px] space-y-5 rounded-lg border-1 border-gray-200 shadow-xl mx-auto'>
                {/* --- Login Form --- */}
                <form
                    onSubmit={handleLoginSubmit}
                    className='flex-1 content-center max-w-[50%] h-full rounded-l-lg py-10 px-10 bg-gray-900'
                >
                    <div className='relative mt-2 w-full z-2'>
                        <input
                            type='email'
                            name='identifier'
                            placeholder=''
                            onChange={handleLoginFieldChange}
                            className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                        />
                        <label
                            htmlFor='email'
                            className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'
                        >
                            Email
                        </label>
                    </div>
                    <div className='relative mt-2 w-full z-2'>
                        <input
                            type='password'
                            name='password'
                            placeholder=''
                            onChange={handleLoginFieldChange}
                            className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                        />
                        <label
                            htmlFor='password'
                            className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'
                        >
                            Password
                        </label>
                    </div>
                    <button className='relative z-5 w-full mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-600/90 hover:cursor-pointer'>
                        Login
                    </button>
                </form>
                {/* --- 분리 패널 --- */}
                <div className='absolute w-0 top-0 left-[45%] h-full border-t-170 border-r-70 border-b-168 border-l-70 border-t-gray-900 border-r-white border-b-white border-l-gray-900 z-1'></div>
                {/* --- Login title --- */}
                <div className='flex items-center justify-center w-[50%] h-full py-10 px-5 rounded-lg bg-white'>
                    <div className='flex flex-col mx-auto'>
                        <h1 className='text-3xl text-center text-gray-800 font-bold mb-2'>
                            LOGIN
                        </h1>
                        <p className='text-gray-500 text-center z-2'>
                            Do Not Have An Account
                            <button
                                className='text-gray-500 bg-gray-50 hover:bg-blue-500 hover:text-white hover:cursor-pointer ml-4 p-2 rounded-lg'
                                onClick={changeFormType}
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SignUpAndLogin;

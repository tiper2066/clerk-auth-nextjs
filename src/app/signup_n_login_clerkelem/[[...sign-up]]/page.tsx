'use client';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import * as SignIn from '@clerk/elements/sign-in';
import { ClerkLoaded } from '@clerk/nextjs';
import { useState } from 'react';

const SignUpAndLoginClerkElem = () => {
    const [formType, setFormType] = useState('signup'); // UI 의 상태 구분 변수 ( login or signup )

    const changeFormType = () => {
        if (formType === 'login') {
            setFormType('signup'); // 현재 login 타입이면.. signup 폼을 출력
        } else {
            setFormType('login'); // 현재 signup 타입이면.. login 폼을 출력
        }
    };

    return (
        <div className='container mx-auto h-screen'>
            <div className='flex items-center h-full'>
                <ClerkLoaded>
                    <div className='block card w-full min-h-[310px] p-8 mx-auto rounded-lg border border-gray-200 shadow-lg'>
                        {/* ------------------------- Login Form ------------------------- */}
                        <div
                            className={
                                formType === 'login'
                                    ? 'flex items-center justify-between gap-2 my-auto min-h-[240px] login-form'
                                    : 'hidden'
                            }
                        >
                            <div className='w-[50%]'>
                                <SignIn.Root>
                                    <SignIn.Step name='start'>
                                        {/* --- 이메일 요소 --- */}
                                        <Clerk.Field
                                            name='identifier'
                                            className='relative mb-3'
                                        >
                                            <Clerk.Input
                                                className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                                placeholder='email'
                                            />
                                            <Clerk.Label className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'>
                                                E-mail
                                            </Clerk.Label>
                                            <Clerk.FieldError className='text-red-500' />
                                        </Clerk.Field>
                                        {/* --- 비밀번호 요소 --- */}
                                        <Clerk.Field
                                            name='password'
                                            className='relative mb-3'
                                        >
                                            <Clerk.Input
                                                className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                                placeholder='password'
                                            />
                                            <Clerk.Label className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'>
                                                Password
                                            </Clerk.Label>
                                            <Clerk.FieldError className='text-red-500' />
                                        </Clerk.Field>

                                        {/* ----- Login Submit 버튼 ----- */}
                                        <SignUp.Action
                                            submit
                                            className='w-full relative z-5 mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-600/90 hover:cursor-pointer'
                                        >
                                            Login
                                        </SignUp.Action>
                                    </SignIn.Step>
                                </SignIn.Root>
                            </div>
                            <div className='w-[5%]'></div>
                            <div className='w-[45%] flex flex-col'>
                                <div className='m-auto'>
                                    <h1 className='h1 text-center text-gray-500 font-bold text-4xl'>
                                        LOGIN
                                    </h1>
                                    {/* --- 회원가입 UI 링크 --- */}
                                    <p className='text-gray-800 text-center'>
                                        Do Not Have An Account{' '}
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

                        {/* ------------------------- SignUp Form ------------------------- */}
                        <div
                            className={
                                formType === 'signup'
                                    ? 'flex items-center justify-between gap-2 my-auto signup-form'
                                    : 'hidden'
                            }
                        >
                            <div className='w-[45%]flex flex-col'>
                                <div className='m-auto'>
                                    <h1 className='h1 text-center text-gray-500 font-bold text-4xl'>
                                        SIGNUP
                                    </h1>
                                    {/* --- 로그인 UI 링크 --- */}
                                    <p className='text-gray-800 text-center'>
                                        Already Have An Account{' '}
                                        <button
                                            className='text-gray-500 bg-gray-50 hover:bg-blue-500 hover:text-white hover:cursor-pointer ml-4 p-2 rounded-lg'
                                            onClick={changeFormType}
                                        >
                                            Lognin
                                        </button>
                                    </p>
                                </div>
                            </div>
                            <div className='w-[5%]'></div>
                            <div className='w-[50%]'>
                                <SignUp.Root>
                                    {/* --- 회원가입 최초 화면 --- */}
                                    <SignUp.Step name='start'>
                                        {/* ----- User Name ----- */}
                                        <Clerk.Field
                                            className='relative mb-3'
                                            name='username'
                                        >
                                            <Clerk.Input
                                                className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                                placeholder='Username'
                                            />
                                            <Clerk.Label className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'>
                                                Username
                                            </Clerk.Label>
                                            <Clerk.FieldError className='text-orange-800' />
                                        </Clerk.Field>

                                        {/* ----- Email ----- */}
                                        <Clerk.Field
                                            className='relative mb-3'
                                            name='emailAddress'
                                        >
                                            <Clerk.Input
                                                className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                                placeholder='email'
                                            />
                                            <Clerk.Label className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'>
                                                E-mail
                                            </Clerk.Label>
                                            <Clerk.FieldError className='text-orange-800' />
                                        </Clerk.Field>

                                        {/* ----- PassWord ----- */}
                                        <Clerk.Field
                                            className='relative mb-3'
                                            name='password'
                                        >
                                            <Clerk.Input
                                                className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                                placeholder='password'
                                            />
                                            <Clerk.Label className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'>
                                                Password
                                            </Clerk.Label>
                                            <Clerk.FieldError className='text-orange-800' />
                                        </Clerk.Field>

                                        {/* ----- SignUp Submit 버튼 ----- */}
                                        <SignUp.Action
                                            submit
                                            className='w-full relative z-5 mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-600/90 hover:cursor-pointer'
                                        >
                                            Sign Up
                                        </SignUp.Action>
                                    </SignUp.Step>

                                    {/* --- 회원가입 인증 코드 입력 화면 --- */}
                                    <SignUp.Step name='verifications'>
                                        <Clerk.Field
                                            className='relative mb-3'
                                            name='code'
                                        >
                                            <Clerk.Input
                                                className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                                placeholder='code'
                                            />
                                            <Clerk.Label className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'>
                                                Code
                                            </Clerk.Label>
                                            <Clerk.FieldError className='text-orange-800' />
                                        </Clerk.Field>

                                        {/* ----- Verify Submit 버튼 ----- */}
                                        <SignUp.Action
                                            submit
                                            className='w-full relative z-5 mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-600/90 hover:cursor-pointer'
                                        >
                                            Verify
                                        </SignUp.Action>
                                    </SignUp.Step>
                                </SignUp.Root>
                            </div>
                        </div>

                        <div className='black-panel'></div>
                    </div>
                </ClerkLoaded>
            </div>
        </div>
    );
};
export default SignUpAndLoginClerkElem;

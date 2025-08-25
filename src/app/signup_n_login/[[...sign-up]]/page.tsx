'use client';

import { useSignIn, useSignUp } from '@clerk/nextjs'; //  Clerk useSignUp 와 useSignIn 추가
import { useRouter } from 'next/navigation'; //  라우터
import React, { useState } from 'react';

const SignUpAndLogin = () => {
    const { signUp } = useSignUp(); //  Clerk hooks (로딩여부, 가입처리 함수, 활성여부) 활용,  isLoaded, setActive 는 중복되므로 여기서는 제거함
    const { isLoaded, signIn, setActive } = useSignIn(); //  useSignIn 관련 메소드
    const [verify, setVerify] = useState(false); //  유효성 검증여부 상태 변수
    const [code, setCode] = useState(''); //  Clerk 데이터를 받아 확인할 경우 사용함
    const router = useRouter(); //  라우터 객체 생성

    const [formType, setFormType] = useState('signup'); // login or signup 폼 구분 상태변수
    // SignUp 폼 요소값 상태변수
    const [signUpFields, setSignUpFields] = useState({
        username: '',
        emailAddress: '',
        password: '',
    });
    // Login 폼 요소값 상태변수
    const [loginFields, setLoginFields] = useState({
        identifier: '', // email (id 대신)
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

    // login or signup 폼 간의 애니메이션을 위한 함수
    const changeFormType = () => {
        if (formType === 'login') {
            setFormType('signup'); // 현재 login 타입이면.. signup 폼을 출력
        } else {
            setFormType('login'); // 현재 signup 타입이면.. login 폼을 출력
        }
    };

    //  로그인 Submint 핸들러 함수 ( 비동기로 변경 )
    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoaded) return; // isLoaded가 false면 signIn이나 setActive 호출 방지
        try {
            const signInAttempt = await signIn?.create({ ...loginFields });

            if (signInAttempt?.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.push('/dashboard');
            } else {
                console.error();
            }
        } catch (error) {
            console.log(error);
        }
    };

    //  회원 가입 Submit 핸들러 함수:
    // verify 값에 따라서 검증 전이면 회원가입화면을 출력, 검증이 완료되면 전송 코드 입력화면을 출력함
    const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoaded) return; //  setActive가 undefined일 가능성 방지

        try {
            await signUp?.create({ ...signUpFields }); // 폼필드 데이터값 이용하여 가입처리 함수 실행(이름, 이메일, 비번)
            // 가입확인 방법 설정 : 가입에 사용한 이메일 주소로 확인 코드 전송 방법
            await signUp?.prepareEmailAddressVerification({
                strategy: 'email_code',
            });
            setVerify(true); // 유효성 검증 완료 상태로 업데이트
        } catch (error) {
            console.log(error);
        }
    };

    //  전송 코드 검증 핸들러 함수
    const handleVerificationSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            // 이메일로 전송된 code 검증
            const signupAttempt = await signUp?.attemptEmailAddressVerification(
                {
                    code,
                }
            );

            // 코드 검증이 완료인 경우
            if (!isLoaded) return; // setActive가 undefined일 가능성 방지
            if (signupAttempt?.status === 'complete') {
                // await setActive({ session: signupAttempt.createdSessionId }); // 세션 id 생성함
                // router.push('/dashboard');
                setFormType('login'); //  회원가입 완료 후 로그인화면이 보이도록 한다
            } else {
                console.error(signupAttempt);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!isLoaded) return null; //  Clerk loading 인되면 아무것도 반환하지 않움

    return (
        <div className='px-46 py-56 bg-gray-50 h-screen'>
            {/* ------------------------------ 로그인 UI ------------------------------ */}
            <div className={formType === 'login' ? 'block' : 'hidden'}>
                <div className='flex relative w-full min-w-[700px] max-w-[800px] h-[340px] space-y-5 rounded-lg border-1 border-gray-200 shadow-xl mx-auto'>
                    {/* --- Form 영역 --- */}
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

            {/* ------------------------------ 회원 가입 UI ------------------------------ */}
            <div className={formType === 'signup' ? 'block' : 'hidden'}>
                <div className='flex relative w-full min-w-[700px] max-w-[800px] h-[340px] space-y-5 rounded-lg border-1 border-gray-200 shadow-xl mx-auto'>
                    {/* --- Sign title --- */}
                    <div className='flex items-center justify-center w-[50%] h-full py-10 px-5 rounded-lg bg-white'>
                        <div className='flex flex-col mx-auto'>
                            <h1 className='text-3xl text-center text-gray-800 font-bold mb-2'>
                                Sign Up
                            </h1>
                            <p className='text-gray-500 text-center z-2'>
                                Already Have An Account
                                <button
                                    className='text-gray-500 bg-gray-50 hover:bg-blue-500 hover:text-white hover:cursor-pointer ml-4 p-2 rounded-lg'
                                    onClick={changeFormType}
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
                    {/* --- 분리 패널 --- */}
                    <div className='absolute w-0 top-0 right-[45%] h-full border-t-170 border-r-70 border-b-168 border-l-70 border-t-gray-900 border-r-gray-900 border-b-white border-l-white z-1'></div>
                    {/* --- Form 영역 --- */}
                    {verify ? (
                        // ------------------- 유효성 검증 후 Form : 전송 코드 입력 필드 표시
                        <form
                            onSubmit={handleVerificationSubmit}
                            className='flex-1 content-center max-w-[50%] h-full rounded-r-lg py-10 px-10 bg-gray-900'
                        >
                            <div className='relative mt-2 w-full z-2'>
                                <input
                                    type='text'
                                    name='code'
                                    placeholder=''
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)} // 입력된 코드 갱신
                                    className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                />
                                <label
                                    htmlFor='code'
                                    className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'
                                >
                                    Code
                                </label>
                            </div>
                            <button className='relative z-5 w-full mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-600/90 hover:cursor-pointer'>
                                Verify
                            </button>
                        </form>
                    ) : (
                        // ------------------- 유효성 검증 전 Form
                        <form
                            onSubmit={handleSignUpSubmit}
                            className='flex-1 content-center max-w-[50%] h-full rounded-r-lg py-10 px-10 bg-gray-900'
                        >
                            <div className='relative mt-2 w-full z-2'>
                                <input
                                    type='text'
                                    name='username'
                                    placeholder=''
                                    onChange={handleSignUpFieldChange}
                                    className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                />
                                <label
                                    htmlFor='username'
                                    className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'
                                >
                                    User Name
                                </label>
                            </div>
                            <div className='relative mt-2 w-full z-2'>
                                <input
                                    type='email'
                                    name='emailAddress'
                                    placeholder=''
                                    onChange={handleSignUpFieldChange}
                                    className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                />
                                <label
                                    htmlFor='emailAddress'
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
                                    onChange={handleSignUpFieldChange}
                                    className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                />
                                <label
                                    htmlFor='password'
                                    className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'
                                >
                                    Password
                                </label>
                            </div>
                            {/*  Clerk CAPTCHA DOM */}
                            <div
                                id='clerk-captcha'
                                style={{ marginTop: '1rem' }}
                            ></div>
                            <button className='relative z-5 w-full mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-600/90 hover:cursor-pointer'>
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default SignUpAndLogin;

'use client';

import { useAuth, useSignIn } from '@clerk/nextjs'; //  Clerk useSignIn, useAuth 추가
import { useRouter } from 'next/navigation'; //  라우터
import { useState } from 'react';

const PasswordResetPage = () => {
    const { isSignedIn } = useAuth(); // clerk 로그인 상태 여부 체크
    const { isLoaded, signIn, setActive } = useSignIn(); //  useSignIn 관련 메소드
    const [email, setEmail] = useState(''); //  email 상태변수
    const [password, setPassword] = useState(''); //  password 상태변수
    const [code, setCode] = useState(''); //  Clerk 데이터를 확인할 경우 사용함
    const [successfulCreation, setSuccessfulCreation] = useState(false); //  가입 완료 여부 상태변수( 이메일 확인후 true로 변경됨 )
    const router = useRouter(); //  라우터 객체 생성

    // 사용자 이메일 검증 함수
    const verifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await signIn
                ?.create({
                    strategy: 'reset_password_email_code', // '이메일 코드'로 비번리셋 처리
                    identifier: email, // 이메일 코드 입력 요소
                })
                .then(() => {
                    setSuccessfulCreation(true); // 이메일 검증이 완료되면 true로 변경
                });
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
    };

    // 비밀번호 리셋 함수 (비밀번호 변경)
    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await signIn
                ?.attemptFirstFactor({
                    strategy: 'reset_password_email_code', // '이메일 코드'로 비번리셋 처리
                    code, // 이메일로 전송된 인증코드번호
                    password, // 새로 설정한 비밀번호
                })
                .then((result) => {
                    // 응답상태가 설공(complete) 이면...
                    if (result.status === 'complete') {
                        setActive({ session: result.createdSessionId }); // 자동로그인을 위한 사용자 세션을 생성함
                        router.push('/dashboard'); // 자동로그인되기 때문에 대시보드 페이지로 이동
                    }
                });
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
    };

    // 이미 로그인 상태라면 대시보드로 리다이렉트함 (비번 리셋 기능은 로그인 상태가 아니어야 함)
    if (isSignedIn) {
        router.push('/dashboard');
    }

    if (!isLoaded) return; // 아직 clerk 정보 검증 결과가 반환되지 않었다면.. 아무것도 안함

    return (
        <div className='px-46 py-56 bg-gray-50 h-screen'>
            {/* ------------------------------ 이메일 Verify UI ------------------------------ */}
            <div>
                <div className='flex relative w-full min-w-[700px] max-w-[800px] h-[340px] space-y-5 rounded-lg border-1 border-gray-200 shadow-xl mx-auto'>
                    {/* --- Form 영역 --- */}
                    <form
                        // successfulCreation true면 이메일이 검증 완료이므로 비밀번호 리셋 함수 실행, false 면 이메일 검증 함수 실행
                        onSubmit={
                            successfulCreation ? handleReset : verifyEmail
                        }
                        className='flex-1 content-center max-w-[50%] h-full rounded-l-lg py-10 px-10 bg-gray-900'
                    >
                        {/* ----------------------- 가입 검증이 안된 경우: 이메일과 검증 버튼 UI ----------------------- */}
                        {!successfulCreation && (
                            <>
                                <div className='relative mt-2 w-full z-2'>
                                    <input
                                        type='email'
                                        name='identifier'
                                        placeholder=''
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                    />
                                    <label
                                        htmlFor='email'
                                        className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'
                                    >
                                        Email
                                    </label>
                                </div>
                                <button className='relative z-5 w-full mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-600/90 hover:cursor-pointer'>
                                    Verify
                                </button>
                            </>
                        )}
                        {/* ----------------------- 가입 검증된 경우: 비번, code 필드와 비밀번호 리셋 버튼 UI ----------------------- */}
                        {successfulCreation && (
                            <>
                                <div className='relative mt-2 w-full z-2'>
                                    <input
                                        type='password'
                                        name='password'
                                        placeholder=''
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className='peer block w-full appearance-none rounded-lg border-1 border-gray-300 bg-white px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0'
                                    />
                                    <label
                                        htmlFor='password'
                                        className='absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:rounded-lg'
                                    >
                                        New Password
                                    </label>
                                </div>
                                <div className='relative mt-2 w-full z-2'>
                                    <input
                                        type='text'
                                        name='code'
                                        placeholder=''
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
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
                                    Reset
                                </button>
                            </>
                        )}
                    </form>

                    {/* --- 분리 패널 --- */}
                    <div className='absolute w-0 top-0 left-[45%] h-full border-t-170 border-r-70 border-b-168 border-l-70 border-t-gray-900 border-r-white border-b-white border-l-gray-900 z-1'></div>
                    {/* --- Reset Password title --- */}
                    <div className='flex items-center justify-center w-[50%] h-full py-10 px-5 rounded-lg bg-white'>
                        <div className='flex flex-col mx-auto'>
                            <h1 className='text-3xl text-center text-gray-800 font-bold mb-2'>
                                Reset
                                <br />
                                Password
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PasswordResetPage;

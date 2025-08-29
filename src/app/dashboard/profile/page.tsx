'use client';

import { UserButton } from '@clerk/nextjs'; //  사용자 계정 아바타 메뉴
import Link from 'next/link';
import { useUser } from '@clerk/nextjs'; // clerk user check
import Image from 'next/image'; // next.js image 컴포넌트
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; //  useRouter 가져옴

type inputValuesType = {
    image: string | null; // Base64 문자열 또는 null
    username: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ProfileUpdatePage = () => {
    const { isLoaded, isSignedIn, user } = useUser(); // clerk user 및 isLoaded 정보 가져옴
    const router = useRouter(); //  라우터 객체 생성
    // console.log('user: ', user);

    // 폼 요소 값을 위한 - 배열 객체 상태 변수 설정
    const [inputValues, setInputValues] = useState<inputValuesType>({
        image: null, // 아바타 이미지
        username: '', // 사용자 이름
        email: '', // 이메일 주소
        currentPassword: '', // 현재 비번
        newPassword: '', // 신규 비번
        confirmPassword: '', // 신규 비번 확인
    });

    const [error, setError] = useState<string | null>(null); // 에러 상태 변수

    // 사용자 정보 로드 시 초기값 설정
    useEffect(() => {
        if (isLoaded && user) {
            setInputValues({
                image: null,
                username: user.username || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    }, [isLoaded, user]);

    // Base64로 변환된 이미지를 Blob으로 변환
    const base64ToBlob = (base64: string, contentType = 'image/jpeg') => {
        const byteCharacters = atob(base64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    };

    // 폼 제출 함수
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!isSignedIn || !user) {
            setError('로그인이 필요합니다.');
            return;
        }

        // 비밀번호 유효성 검사
        if (
            inputValues.newPassword &&
            (inputValues.newPassword.length < 8 ||
                inputValues.newPassword !== inputValues.confirmPassword)
        ) {
            setError(
                '새 비밀번호는 8자 이상이어야 하며, 비밀번호 확인과 일치해야 합니다.'
            );
            return;
        }

        try {
            // 프로필 이미지 업데이트
            if (inputValues.image) {
                const blob = base64ToBlob(inputValues.image);
                await user.setProfileImage({ file: blob });
            }

            // 사용자 이름 업데이트
            if (
                inputValues.username &&
                inputValues.username !== user.username
            ) {
                await user.update({ username: inputValues.username });
            }

            // 비밀번호 업데이트
            if (inputValues.currentPassword && inputValues.newPassword) {
                try {
                    await user.updatePassword({
                        currentPassword: inputValues.currentPassword,
                        newPassword: inputValues.newPassword,
                    });
                } catch (err: any) {
                    if (err.message.includes('additional verification')) {
                        setError(
                            '비밀번호 변경을 위해 추가 인증이 필요합니다. Clerk 대시보드에서 2FA 설정을 확인하세요.'
                        );
                        return;
                    }
                    throw err;
                }
            }

            alert('프로필이 성공적으로 업데이트되었습니다!');
            router.push('/dashboard'); //  dashboard로 이동
        } catch (error) {
            console.error('프로필 업데이트 중 오류 발생:', error);
            alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 기존 아바타 이미지 제거하기
    const clearImage = () => {
        setInputValues((prev) => ({
            ...prev,
            image: null,
        }));
    };

    // 이미지 파일을 base64로 변환하고 폼 요소값을 담는 함수
    const convertToBase64AndSetImage = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setInputValues((prev) => ({
                ...prev,
                image: reader.result as string,
            }));
        };
    };

    //  드롭다운 이미지 이벤트 함수
    const setImageOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0]; // 드롭다운 이벤트 시 파일을 가져오기
        // convertToBase64AndSetImage(file); // 이미지 파일을 base64로 변환하고 폼요소 배열에 저장
        if (file && file.type.startsWith('image/')) {
            // 이미지 파일인지 확인
            convertToBase64AndSetImage(file); // Base64로 변환하여 inputValues에 저장

            // input 요소의 files 속성 업데이트
            const inputElement = document.getElementById(
                'image'
            ) as HTMLInputElement;
            if (inputElement) {
                const dataTransfer = new DataTransfer(); // 새로 가져온 이미지 데이터
                dataTransfer.items.add(file); // 가져온 새 이미지 데이터를 추가함
                inputElement.files = dataTransfer.files; // input 요소에 파일 설정
            }
        }
    };

    // 입력 필드 값이 변경될 때마다 업데이트해서 폼 요소값을 담는 inputValue 배열에 추가함
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files?.[0]) {
            convertToBase64AndSetImage(files[0]); // 폼 요소가 이미지라면...
        } else {
            // 폼 요소가 기타 문자열이라면...
            setInputValues((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // 세션 정보가 로딩안되면.. 아무일도 안일어남
    if (!isLoaded || !user) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className='flex flex-col h-screen'>
            {/* ---- 헤더 네비게이션 ---- */}
            <nav className='bg-white border-b border-1 border-gray-200'>
                <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
                    <div className='relative flex h-16 items-center justify-between'>
                        {/* ---- 로고 ---- */}
                        <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                            <div className='flex flex-shrink-0 items-center'>
                                <p className='text-dark text-xl font-bold'>
                                    Logo
                                </p>
                            </div>
                        </div>
                        {/* ----  사용자 계정 아바타 메뉴 ---- */}
                        <div className='flex items-center justify-center gap-2'>
                            <Link
                                href='/dashboard/profile'
                                className='rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-600/90 hover:cursor-pointer'
                            >
                                Custom Profile Update
                            </Link>
                            <UserButton />
                        </div>
                    </div>
                </div>
            </nav>
            {/* ---- 프로필 컨텐츠 ---- */}
            <div className='w-2xl m-auto'>
                <h1 className='text-3xl font-bold mb-4'>Update Profile</h1>
                <form onSubmit={submitForm} className='flex flex-col'>
                    {/*  Image Deop & Drop 영역 표시하기   */}
                    {/* 사용자의 아바타 이미지 정보가 없다면.. 아무것도 표시하지 않음 */}
                    {!inputValues.image && ''}

                    {/* 사용자의 아바타 이미지 정보가 있다면.. 드롭앤드롭 영역을 표시함 */}
                    <div
                        className='bg-gray-100 flex justify-center items-center border-dashed border-1 border-gray-400 w-full min-h-[100px] rounded mb-3'
                        onDrop={setImageOnDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        Drop Image
                    </div>
                    {/* ------------ Image 아바타 파일 업로드 영역  ------------ */}
                    <div className='flex justify-start items-center '>
                        <Image
                            className='rounded-full'
                            // 기본 이미지 추가
                            src={
                                inputValues.image ||
                                user.imageUrl ||
                                '/next.svg'
                            }
                            alt='프로필이미지'
                            width={150}
                            height={150}
                            priority
                        />
                        <label htmlFor='image' className='mb-3'>
                            <input
                                type='file'
                                id='image'
                                name='image'
                                accept='image/*' // 이미지 파일만 허용하도록하는 속성
                                onChange={handleInput}
                                className='min-w-0 w-[250px] ml-4 py-1.5 text-base text-gray-900 placeholder:text-gray-400 bg-white border-none rounded-md pl-3 outline-1 -outline-offset-1 outline-gray-300'
                            />
                            {/* ----- 이미지 파일이 존재하면 delete 버튼도 함께 보인다.--- */}
                            {inputValues.image && (
                                <button
                                    type='button'
                                    className='text-white bg-red-500 px-2 py-1 rounded ml-4 hover:bg-red-600 hover:cursor-pointer'
                                    onClick={clearImage}
                                >
                                    Delete
                                </button>
                            )}
                        </label>
                    </div>
                    {/* ------------ User Name  ------------ */}
                    <div className='mb-3'>
                        <label
                            htmlFor='username'
                            className='block font-medium mb-1'
                        >
                            Username
                        </label>
                        <input
                            type='text'
                            className='block min-w-0 w-full grow py-1.5 text-base text-gray-900 placeholder:text-gray-400 bg-white border-none rounded-md pl-3 outline-1 -outline-offset-1 outline-gray-300'
                            name='username'
                            placeholder='Enter Username'
                            value={inputValues.username}
                            onChange={handleInput}
                        />
                    </div>
                    {/* ------------ Email  ------------ */}
                    <div className='mb-3'>
                        <label
                            htmlFor='email'
                            className='block font-medium mb-1'
                        >
                            E-mail
                        </label>
                        <input
                            type='email'
                            className='block min-w-0 w-full grow py-1.5 text-base text-gray-900 placeholder:text-gray-400 bg-white border-none rounded-md pl-3 outline-1 -outline-offset-1 outline-gray-300'
                            name='email'
                            placeholder='Enter E-mail'
                            value={inputValues.email}
                            onChange={handleInput}
                            disabled // 이메일은 Clerk에서 별도로 관리
                        />
                    </div>
                    {/* ------------ Current Password / New Password / Confirm Password  ------------ */}
                    <div className='flex items-center justify-between w-full'>
                        {/* Current Password */}
                        <div className='mb-3 w-[32%]'>
                            <label
                                htmlFor='currentPassword'
                                className='block font-medium mb-1'
                            >
                                Current Password
                            </label>
                            <input
                                type='password'
                                className='w-full min-w-0 py-1.5 text-base text-gray-900 placeholder:text-gray-400 bg-white border-none rounded-md pl-3 outline-1 -outline-offset-1 outline-gray-300'
                                name='currentPassword'
                                placeholder='Enter Current Password'
                                value={inputValues.currentPassword}
                                onChange={handleInput}
                            />
                        </div>
                        {/* New Password */}
                        <div className='mb-3 w-[32%]'>
                            <label
                                htmlFor='newPassword'
                                className='block font-medium mb-1'
                            >
                                New Password
                            </label>
                            <input
                                type='password'
                                className='w-full min-w-0 py-1.5 text-base text-gray-900 placeholder:text-gray-400 bg-white border-none rounded-md pl-3 outline-1 -outline-offset-1 outline-gray-300'
                                name='newPassword'
                                placeholder='Enter New Password'
                                value={inputValues.newPassword}
                                onChange={handleInput}
                            />
                        </div>
                        {/* Confirm Password */}
                        <div className='mb-3 w-[32%]'>
                            <label
                                htmlFor='confirmPassword'
                                className='block font-medium mb-1'
                            >
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                className='w-full min-w-0 py-1.5 text-base text-gray-900 placeholder:text-gray-400 bg-white border-none rounded-md pl-3 outline-1 -outline-offset-1 outline-gray-300'
                                name='confirmPassword'
                                placeholder='Enter Confirm Password'
                                value={inputValues.confirmPassword}
                                onChange={handleInput}
                            />
                        </div>
                    </div>
                    {/* ------------ Submit Button ------------ */}
                    <div>
                        <button
                            type='submit'
                            className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ProfileUpdatePage;

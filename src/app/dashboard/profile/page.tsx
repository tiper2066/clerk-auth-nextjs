'use client';

import { useUser } from '@clerk/nextjs'; // clerk user check
import Image from 'next/image'; // next.js image 컴포넌트
import { useState } from 'react';

const ProfileUpdatePage = () => {
    const { isLoaded, user } = useUser(); // clerk user 및 isLoaded 정보 가져옴
    // 폼 요소 값을 위한 - 배열 객체 상태 변수 설정
    const [inputValues, setInputValues] = useState({
        image: '', // 아바타 이미지
        username: '', // 사용자 이름
        email: '', // 이메일 주소
        currentPassword: '', // 현재 비번
        newPassword: '', // 신규 비번
        confirmPassword: '', // 신규 비번 확인
    });

    // 폼 서브밋 함수
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (inputValues.image.length > 0) {
            user?.setProfileImage({ file: inputValues.image });
        }
    };

    // 기존 아바타 이미지 제거하기
    const clearImage = () => {};

    // 이미지 파일을 base64로 변환하고 폼 요소값을 담는 함수
    const convertToBase64AndSetImage = (file) => {
        const reader = new FileReader(); // FileReader 객체 생성, new File
        reader.readAsDataURL(file);
        reader.onloadend = () =>
            setInputValues({
                ...inputValues,
                image: reader.reault,
            });
    };

    // 입력 필드 값이 변경될 때마다 업데이트해서 폼 요소값을 담는 inputValue 배열에 추가함
    const handleInput = async (e: React.FormEvent<HTMLFormElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === 'image') {
            convertToBase64AndSetImage(files[0]);
        } else {
            setInputValues({
                ...inputValues, // 이전 설정된 요소의 값 배열 추가
                [name]: value, // 현재 폼 요소의 name 속성 값을 배열에 추가
            });
        }
    };

    if (!isLoaded) return; // 세션 정보가 로딩안되면.. 아무일도 안일어남

    return (
        <div className='flex flex-col min-h-[90vh]'>
            <div className='m-auto'>
                <h1 className='text-white text-3xl font-bold mb-4'>
                    Update Profile
                </h1>
                <form onSubmit={submitForm} className='flex flex-col'>
                    <label htmlFor='image' className='mb-3'>
                        <Image
                            className='rounded-full'
                            src={inputValues.image || user.imageUrl}
                            alt=''
                            width={150}
                            height={150}
                            priority
                        />
                        <input
                            type='file'
                            id='image'
                            name='image'
                            hidden
                            onChange={handleInput}
                        />
                    </label>
                    <div className='mb-3'>
                        <label
                            htmlFor='username'
                            className='block font-medium text-white mb-1'
                        >
                            Username
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ProfileUpdatePage;

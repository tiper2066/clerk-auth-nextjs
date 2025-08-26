import { UserButton } from '@clerk/nextjs'; //  사용자 계정 아바타 메뉴
import Link from 'next/link';

const DashboardPage = () => {
    return (
        <div className='flex flex-col h-100'>
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
            {/* ---- 대시보드 컨텐츠 ---- */}
            <div className='m-auto'>
                <h1 className='text-center text-black text-4xl font-bold'>
                    Dashboard
                </h1>
            </div>
        </div>
    );
};
export default DashboardPage;

import { SignIn } from '@clerk/nextjs';

const LoginPage = () => {
    return (
        <div className='flex flex-col h-100'>
            <div className='m-auto'>
                <SignIn />
            </div>
        </div>
    );
};
export default LoginPage;

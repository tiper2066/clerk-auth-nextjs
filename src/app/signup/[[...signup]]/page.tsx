import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
    return (
        <div className='flex flex-col h-100'>
            <div className='m-auto'>
                <SignUp />
            </div>
        </div>
    );
};
export default SignUpPage;

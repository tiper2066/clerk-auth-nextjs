'use client'; //  client 적용

import { Protect, useAuth } from '@clerk/nextjs'; //   useAuth 추가

// **************************** 컴포넌트 페이지를 프롭으로 받는다.
const DashboardLayout = ({
    children,
    userDashboard,
    adminDashboard,
}: {
    children: React.ReactNode;
    userDashboard: React.ReactNode;
    adminDashboard: React.ReactNode;
}) => {
    const { isLoaded, orgRole } = useAuth(); //  useAuth 에서 isLoaded, orgRole 추출
    if (!isLoaded) return;
    // console.log('orgRole: ', orgRole); //   orgRole 정보 출력

    return (
        <Protect>
            {/* {children} *********************** 잠시 주석처리함  */}
            {/* ************************ orgRole 에 따라 조건 분기처리함  */}
            {orgRole === 'org:admin' ? adminDashboard : userDashboard}
        </Protect>
    );
};
export default DashboardLayout;

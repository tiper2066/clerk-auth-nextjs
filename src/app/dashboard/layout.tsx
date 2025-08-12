import { Protect } from '@clerk/nextjs';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return <Protect>{children}</Protect>;
};
export default DashboardLayout;

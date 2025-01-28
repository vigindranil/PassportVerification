'use client'
import { getDistrictNodalDashBoard, getApplicationStatus } from '@/app/dashboard/api';
import { CircleDashed, TrendingDown, ArrowRightToLine } from 'lucide-react'
import { useEffect, useState } from 'react';
import Cookies from "react-cookies";
import DashboardCard from './dashboard-cards';


const DashboardCards = () => {
    const [data, setData] = useState(null);
    const login_type = Cookies.load('type')

    const fetchDashboard = async () => {
        const response = await getDistrictNodalDashBoard();
        setData(response.data);
    }

    useEffect(() => {
        fetchDashboard();
    }, [login_type])
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {login_type == 10 && <DashboardCard
                type="10"
                title="Total Pending Applications"
                value={data?.TotalPendingApplications || 0}
                icon={CircleDashed}
                //description="10% increase from last month"
                color="lime"
                link="/totalPending"
            />}
            {login_type == 10 && <DashboardCard
                type="10"
                title="Last 15 Days Pending"
                value={data?.Last15DaysPendingApplications || 0}
                icon={TrendingDown}
                //description="5% increase from last week"
                color="blue"
                link="/last15DaysPending"
            />}
            {login_type == 10 && <DashboardCard
                type="10"
                title="EO Accepted"
                value={data?.EOAccepectButNotStartedVerify || 0}
                icon={ArrowRightToLine}
                //description="15% increase from yesterday"
                color="purple"
                link="/eoAcceptedFile"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending Verification (EO)"
                value={data?.EOStartedVerify || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
                color="yellow"
                link="/pendingVerificatonEO"
            />}
            {login_type == 10 && <DashboardCard
                title="Verification Completed (EO)"
                value={data?.EOComplete || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
               color="bg-gradient-to-br from-blue-600 to-blue-300"
               link="/verificationCompletedEO"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN OC"
                value={data?.OCPending || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
               color="teal"
               link="/pendingInOC"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN SP/DIB"
                value={data?.SPPending || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
               color="purple"
               link="/pendingInSPDIB"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN Enquiry Officer"
                value={data?.SEPending || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
                color="green"
                link="/pendingInEnquiryOfficer"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Verification Pending"
                value={data?.TotalPendingApplications || 0}
                icon={CircleDashed}
                //description="10% increase from last month"
                color="lime"
                link="/totalPending"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Verification Started"
                value={data?.EOAccepectButNotStartedVerify || 0}
                icon={TrendingDown}
                //description="5% increase from last week"
                color="bg-gradient-to-br from-blue-600 to-blue-300"
                link="/verificationStartedEO"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Verification Completed"
                value={data?.EOComplete || 0}
                icon={ArrowRightToLine}
                //description="15% increase from yesterday"
                color="bg-gradient-to-br from-purple-600 to-purple-300"
                link="/processed"
            />}
            
            {/* <DashboardCard
                title="Total Feedback Message"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-indigo-600 to-indigo-300"
            />
            <DashboardCard
                title="Urgent Message From OC"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-purple-600 to-purple-300"
            />
            <DashboardCard
                title="Urgent Message From OC"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-green-600 to-green-300"
            />
            <DashboardCard
                title="Adverse Files"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-violet-600 to-violet-300"
            />
            <DashboardCard
                title="Urgent Message From Operator"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-yellow-600 to-yellow-300"
            />
            <DashboardCard
                title="Urgent Message From DC"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-blue-600 to-blue-300"
            />
            <DashboardCard
                title="Dispatch Files"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-lime-600 to-lime-300"
            /> */}
        </div>

    )
}

export default DashboardCards


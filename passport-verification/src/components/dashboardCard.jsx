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
                color="bg-gradient-to-br from-lime-400 to-lime-600"
                link="/totalPending"
            />}
            {login_type == 10 && <DashboardCard
                type="10"
                title="Last 15 Days Pending"
                value={data?.Last15DaysPendingApplications || 0}
                icon={TrendingDown}
                //description="5% increase from last week"
                color="bg-gradient-to-br from-blue-400 to-blue-600"
                link="/last15DaysPending"
            />}
            {login_type == 10 && <DashboardCard
                type="10"
                title="EO Accepted"
                value={data?.EOAccepectButNotStartedVerify || 0}
                icon={ArrowRightToLine}
                //description="15% increase from yesterday"
                color="bg-gradient-to-br from-purple-400 to-purple-600"
                link="/eoAcceptedFile"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending Verification (EO)"
                value={data?.EOStartedVerify || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-yellow-400 to-yellow-600"
                link="/pendingVerificatonEO"
            />}
            {login_type == 10 && <DashboardCard
                title="Verification Completed (EO)"
                value={data?.EOComplete || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
               color="bg-gradient-to-br from-blue-400 to-blue-600"
               link="/verificationCompletedEO"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN OC"
                value={data?.OCPending || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
               color="bg-gradient-to-br from-teal-400 to-teal-600"
               link="/pendingInOC"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN SP/DIB"
                value={data?.SPPending || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
               color="bg-gradient-to-br from-purple-400 to-purple-600"
               link="/pendingInSPDIB"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN Enquiry Officer"
                value={data?.SEPending || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-green-400 to-green-600"
                link="/pendingInEnquiryOfficer"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Verification Pending"
                value={data?.TotalPendingApplications || 0}
                icon={CircleDashed}
                //description="10% increase from last month"
                color="bg-gradient-to-br from-lime-400 to-lime-600"
                link="/totalPending"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Verification Started"
                value={data?.EOAccepectButNotStartedVerify || 0}
                icon={TrendingDown}
                //description="5% increase from last week"
                color="bg-gradient-to-br from-blue-400 to-blue-600"
                link="/verificationStartedEO"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Verification Completed"
                value={data?.EOComplete || 0}
                icon={ArrowRightToLine}
                //description="15% increase from yesterday"
                color="bg-gradient-to-br from-purple-400 to-purple-600"
                link="/verificationCompletedEO"
            />}
            
            {/* <DashboardCard
                title="Total Feedback Message"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-indigo-400 to-indigo-600"
            />
            <DashboardCard
                title="Urgent Message From OC"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-purple-400 to-purple-600"
            />
            <DashboardCard
                title="Urgent Message From OC"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-green-400 to-green-600"
            />
            <DashboardCard
                title="Adverse Files"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-violet-400 to-violet-600"
            />
            <DashboardCard
                title="Urgent Message From Operator"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-yellow-400 to-yellow-600"
            />
            <DashboardCard
                title="Urgent Message From DC"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-blue-400 to-blue-600"
            />
            <DashboardCard
                title="Dispatch Files"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-lime-400 to-lime-600"
            /> */}
        </div>

    )
}

export default DashboardCards


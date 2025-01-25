'use client'
import { getDistrictNodalDashBoard, getApplicationStatus } from '@/app/dashboard/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDashed, TrendingDown, ArrowRightToLine } from 'lucide-react'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from "react-cookies";

const DashboardCard = ({ title, value, icon: Icon, description, color, link, type }) => (
    <Link href={link}>
        <Card className={`${color} text-white`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs opacity-70">{description}</p>
            </CardContent>
        </Card>
    </Link>
)


const DashboardCards = () => {
    const [data, setData] = useState(null);
    const login_type = Cookies.load('type')

    const fetchDashboard = async () => {
        const response = await getDistrictNodalDashBoard();
        setData(response.data);
    }

    useEffect(() => {
        fetchDashboard();
    }, [])
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
                value={data?.TotalProcessedApplications || 0}
                icon={TrendingDown}
                //description="5% increase from last week"
                color="bg-gradient-to-br from-blue-400 to-blue-600"
                link="/last15DaysPending"
            />}
            {login_type == 10 && <DashboardCard
                type="10"
                title="Processed"
                value={data?.TotalCompleteApplications || 0}
                icon={ArrowRightToLine}
                //description="15% increase from yesterday"
                color="bg-gradient-to-br from-purple-400 to-purple-600"
                link="/processed"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending EO"
                value={data?.TotalCompleteApplications || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-yellow-400 to-yellow-600"
                link="/processed"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN OC"
                value={data?.TotalCompleteApplications || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
               color="bg-gradient-to-br from-teal-400 to-teal-600"
               link="/processed"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN SP/DIB"
                value={data?.TotalCompleteApplications || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
               color="bg-gradient-to-br from-purple-400 to-purple-600"
               link="/processed"
            />}
            {login_type == 10 && <DashboardCard
                title="Pending IN Enquiry Officer"
                value={data?.TotalCompleteApplications || 0}
                icon={ArrowRightToLine}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-green-400 to-green-600"
                link="/processed"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Total Pending Applications"
                value={data?.TotalPendingApplications || 0}
                icon={CircleDashed}
                //description="10% increase from last month"
                color="bg-gradient-to-br from-lime-400 to-lime-600"
                link="/totalPending"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Last 15 Days Pending"
                value={data?.TotalProcessedApplications || 0}
                icon={TrendingDown}
                //description="5% increase from last week"
                color="bg-gradient-to-br from-blue-400 to-blue-600"
                link="/last15DaysPending"
            />}
            {login_type == 40 && <DashboardCard
                type="40"
                title="Processed"
                value={data?.TotalCompleteApplications || 0}
                icon={ArrowRightToLine}
                //description="15% increase from yesterday"
                color="bg-gradient-to-br from-purple-400 to-purple-600"
                link="/processed"
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


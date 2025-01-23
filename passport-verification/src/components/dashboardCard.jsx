'use client'
import { getDistrictNodalDashBoard } from '@/app/dashboard/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Users, DollarSign, TrendingUp, ShoppingBag, CircleDashed, TrendingDown, ArrowRightToLine, Send } from 'lucide-react'
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DashboardCard = ({ title, value, icon: Icon, description, color}) => (
    <Link href="/allFiles">
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

    const fetchDashboard = async () => {
        const response = await getDistrictNodalDashBoard();
        setData(response.data);

    }
    useEffect(() => {
        fetchDashboard();
    }, [])
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
                title="Total Pending"
                value={data?.Pending || 0}
                icon={CircleDashed}
                //description="10% increase from last month"
                color="bg-gradient-to-br from-lime-400 to-lime-600"
            />
            <DashboardCard
                title="Last 15 Days Pending"
                value={data?.Last15DaysPending || 0}
                icon={TrendingDown}
                //description="5% increase from last week"
                color="bg-gradient-to-br from-blue-400 to-blue-600"
            />
            <DashboardCard
                title="Proceed"
                value={data?.Processed || 0}
                icon={ArrowRightToLine}
                //description="15% increase from yesterday"
                color="bg-gradient-to-br from-purple-400 to-purple-600"
            />
            {/* <DashboardCard
                title="Re-Submit"
                value="0"
                icon={Send}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-yellow-400 to-yellow-600"
            />
            <DashboardCard
                title="Urgent Message to EO"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
               color="bg-gradient-to-br from-teal-400 to-teal-600"
            />
            <DashboardCard
                title="Urgent Message to OC"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
               color="bg-gradient-to-br from-purple-400 to-purple-600"
            />
            <DashboardCard
                title="Last Uploaded by SCOuser"
                value="0"
                icon={Users}
                //description="Steady growth over the past quarter"
                color="bg-gradient-to-br from-green-400 to-green-600"
            />
            <DashboardCard
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


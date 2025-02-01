'use client'

import { useEffect, useState } from 'react';
import Cookies from "react-cookies";
import { getDistrictNodalDashBoard } from '@/app/dashboard/api';
import { CircleDashed, TrendingDown, ArrowRightToLine } from 'lucide-react';
import DashboardCard from './dashboard-cards';
import { Skeleton } from "@/components/ui/skeleton";

const dashboardConfig = {
    10: [
        { title: "Total Pending Applications", key: "TotalPendingApplications", icon: CircleDashed, color: "purple", link: "/totalPending" },
        { title: "Last 15 Days Pending", key: "Last15DaysPendingApplications", icon: TrendingDown, color: "blue", link: "/last15DaysPending" },
        { title: "EO Accepted", key: "EOAccepectButNotStartedVerify", icon: ArrowRightToLine, color: "green", link: "/eoAcceptedFile" },
        { title: "Pending Verification (EO)", key: "EOStartedVerify", icon: ArrowRightToLine, color: "yellow", link: "/pendingVerificatonEO" },
        { title: "Verification Completed (EO)", key: "EOComplete", icon: CircleDashed, color: "lime", link: "/verificationCompletedEO" },
        { title: "Pending IN OC", key: "OCPending", icon: CircleDashed, color: "red", link: "/pendingInOC" },
        { title: "Completed By OC", key: "OCComplete", icon: CircleDashed, color: "teal", link: "/verificationCompletedEO" },
        { title: "Pending IN SP/DIB", key: "SPPending", icon: CircleDashed, color: "orange", link: "/pendingInSPDIB" },
        { title: "Pending IN Enquiry Officer", key: "SEPending", icon: CircleDashed, color: "pink", link: "/pendingInEnquiryOfficer" },
    ],
    40: [
        { title: "Verify Pending (PS)", key: "TotalPendingApplications", icon: CircleDashed, color: "lime", link: "/totalPending" },
        { title: "Accept & Verify Pending (EO)", key: "EOAccepectButNotStartedVerify", icon: TrendingDown, color: "blue", link: "/acceptedAndVerificationPending-eo" },
        { title: "Verify Completed (EO)", key: "EOComplete", icon: ArrowRightToLine, color: "purple", link: "/verificationCompletedEO" },
    ],
    30: [
        { title: "Pending In OC", key: "OCPending", icon: ArrowRightToLine, color: "yellow", link: "/allFiles-oc" },
        { title: "Completed By OC", key: "OCComplete", icon: ArrowRightToLine, color: "blue", link: "/completed-oc" },
    ],
    20: [
        { title: "Total Pending Applications", key: "TotalPendingApplications", icon: CircleDashed, color: "purple", link: "/totalPending" },
        { title: "Last 15 Days Pending", key: "Last15DaysPendingApplications", icon: TrendingDown, color: "blue", link: "/last15DaysPending" },
        { title: "EO Accepted", key: "EOAccepectButNotStartedVerify", icon: ArrowRightToLine, color: "green", link: "/eoAcceptedFile" },
        { title: "Pending Verification (EO)", key: "EOStartedVerify", icon: ArrowRightToLine, color: "yellow", link: "/pendingVerificatonEO" },
        { title: "Verification Completed (EO)", key: "EOComplete", icon: ArrowRightToLine, color: "lime", link: "/verificationCompletedEO" },
        { title: "Pending IN OC", key: "OCPending", icon: ArrowRightToLine, color: "red", link: "/pendingInOC" },
        { title: "Completed By OC", key: "OCComplete", icon: ArrowRightToLine, color: "teal", link: "/verificationCompletedEO" },
        { title: "Pending IN SP/DIB", key: "SPPending", icon: ArrowRightToLine, color: "orange", link: "/pendingInSPDIB" },
        { title: "Complete IN SP/DIB", key: "SPDone", icon: ArrowRightToLine, color: "pink", link: "/completed-sp" },
        { title: "Pending IN Enquiry Officer", key: "SEPending", icon: ArrowRightToLine, color: "yellow", link: "/pendingInEnquiryOfficer" },
        { title: "Complete IN Enquiry Officer", key: "SEComplete", icon: ArrowRightToLine, color: "blue", link: "/completed-se" },
    ],
    50: [
        { title: "Pending In SE", key: "SEPending", icon: ArrowRightToLine, color: "purple", link: "/allFiles-oc" },
        { title: "Completed By SE", key: "SEComplete", icon: ArrowRightToLine, color: "lime", link: "/verificationCompletedEO" },
    ],
};

const DashboardCards = () => {
    const [data, setData] = useState(null);
    const auth_type = Cookies.load('type');
    const [login_type, setLogin_type] = useState(auth_type);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchDashboard = async () => {
            const response = await getDistrictNodalDashBoard();
            setData(response?.data);
        };
        fetchDashboard();
        setLogin_type(auth_type);
    }, [login_type]);

    return (
        data ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {dashboardConfig[login_type]?.map((item, index) => (
                    <DashboardCard
                        key={index}
                        title={item.title}
                        value={data[item.key] || 0}
                        icon={item.icon}
                        color={item.color}
                        link={item.link}
                    />
                ))}
            </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, index) => (
                    <Skeleton key={index} className="h-[125px] w-[230px] rounded-xl bg-slate-300 p-5 m-2s">
                        <div className='flex items-center justify-between gap-4'>
                            <Skeleton className="h-4 w-[80%] bg-slate-100" />
                            <Skeleton className="h-[28px] w-[30px] p-0 m-0 rounded-full bg-slate-100" />
                        </div>
                        <Skeleton className="h-6 w-[20%] bg-slate-100 mt-5" />
                    </Skeleton>
                ))}
            </div>
        )
    );
};

export default DashboardCards;
'use client'

import { useEffect, useState } from 'react';
import Cookies from "react-cookies";
import { getDistrictNodalDashBoard } from '@/app/dashboard/api';
import { CircleDashed, TrendingDown, ArrowRightToLine, Clock, CalendarClock, CircleCheckBig, FileClock, FileCheck2, ClockAlert, CircleCheck, CheckCheck, BadgeCheck } from 'lucide-react';
import DashboardCard from './dashboard-cards';
import { Skeleton } from "@/components/ui/skeleton";

const dashboardConfig = {
    10: [
        { title: "Total Pending Applications", key: "TotalPendingApplications", icon: Clock, color: "purple", link: "/totalPending" },
        { title: "Last 15 Days Pending\nApplications", key: "Last15DaysPendingApplications", icon: CalendarClock, color: "blue", link: "/last15DaysPending" },
        { title: "Accepted but Verification Pending (EO)", key: "EOAccepectButNotStartedVerify", icon: CircleCheckBig, color: "green", link: "/eoAcceptedFile" },
        // { title: "Verification Pending \n(EO)", key: "EOStartedVerify", icon: FileClock, color: "yellow", link: "/pendingVerificatonEO" },
        { title: "Verified by EO\n ", key: "EOComplete", icon: FileCheck2, color: "lime", link: "/verificationCompletedEO" },
        { title: "Verification Pending \n(OC)", key: "OCPending", icon: ClockAlert, color: "red", link: "/pendingInOC" },
        { title: "Verified By OC\n ", key: "OCComplete", icon: BadgeCheck, color: "teal", link: "/verificationCompletedEO" },
        { title: "Verification Pending \n(SP/DIB)", key: "SPPending", icon: Clock, color: "orange", link: "/pendingInSPDIB" },
        { title: "Verification Pending \n(Enquiry Officer)", key: "SEPending", icon: Clock, color: "pink", link: "/pendingInEnquiryOfficer" },
    ],
    40: [
        { title: "Verification Pending \n(at Police Station)", key: "TotalPendingApplications", icon: Clock, color: "yellow", link: "/allFiles" },
        { title: "Applications Accepted\nbut Verifiaction Pending", key: "EOAccepectButNotStartedVerify", icon: CheckCheck, color: "blue", link: "/acceptedAndVerificationPending-eo" },
        { title: "Verification Completed\nBy EO", key: "EOComplete", icon: BadgeCheck, color: "purple", link: "/verificationCompletedEO" },
    ],
    30: [
        { title: "Verification Pending", key: "OCPending", icon: Clock, color: "yellow", link: "/allFiles-oc" },
        { title: "Verified Applications", key: "OCComplete", icon: BadgeCheck, color: "purple", link: "/completed-oc" },
    ],
    20: [
        { title: "Total Pending Applications", key: "TotalPendingApplications", icon: CircleDashed, color: "purple", link: "/totalPending" },
        { title: "Verification Pending (SP/DIB)", key: "SPPending", icon: ArrowRightToLine, color: "orange", link: "/allFiles-sp" },
        { title: "Verified By SP/DIB", key: "SPDone", icon: ArrowRightToLine, color: "pink", link: "/completed-sp" },
        { title: "Last 15 Days Pending", key: "Last15DaysPendingApplications", icon: TrendingDown, color: "blue", link: "/last15DaysPending" },
        { title: "Accepted by EO", key: "EOAccepectButNotStartedVerify", icon: ArrowRightToLine, color: "green", link: "/eoAcceptedFile" },
        // { title: "Verification Pending (EO)", key: "EOStartedVerify", icon: ArrowRightToLine, color: "yellow", link: "/pendingVerificatonEO" },
        { title: "Verified by EO", key: "EOComplete", icon: ArrowRightToLine, color: "lime", link: "/verificationCompletedEO" },
        { title: "Verification Pending (OC)", key: "OCPending", icon: ArrowRightToLine, color: "red", link: "/pendingInOC" },
        { title: "Verified By OC", key: "OCComplete", icon: ArrowRightToLine, color: "teal", link: "/verificationCompletedEO" },
        { title: "Verification Pending \n(Enquiry Officer)", key: "SEPending", icon: ArrowRightToLine, color: "yellow", link: "/pendingInEnquiryOfficer" },
        { title: "Verified by Enquiry Officer", key: "SEComplete", icon: ArrowRightToLine, color: "blue", link: "/completed-se" },
        // { title: "re", key: "SEComplete", icon: ArrowRightToLine, color: "blue", link: "/completed-se" },
    ],
    50: [
        { title: "Verification Pending (SE)", key: "SEPending", icon: ArrowRightToLine, color: "purple", link: "/allFiles-oc" },
        { title: "Verified By (SE)", key: "SEComplete", icon: ArrowRightToLine, color: "lime", link: "/verificationCompletedEO" },
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
                            <Skeleton className="h-3 w-[80%] bg-slate-100" />
                            <Skeleton className="h-[28px] w-[30px] p-0 m-0 rounded-full bg-slate-100" />
                        </div>
                        <Skeleton className="h-2 w-[60%] bg-slate-100" />
                        <Skeleton className="h-6 w-[20%] bg-slate-100 mt-5" />
                    </Skeleton>
                ))}
            </div>
        )
    );
};

export default DashboardCards;
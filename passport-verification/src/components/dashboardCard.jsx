'use client'

import { useEffect, useState } from 'react';
import Cookies from "react-cookies";
import { getDistrictNodalDashBoard } from '@/app/dashboard/api';
import { CircleDashed, TrendingDown, ArrowRightToLine, Clock, CalendarClock, CircleCheckBig, FileClock, FileCheck2, ClockAlert, CircleCheck, CheckCheck, BadgeCheck, Ban } from 'lucide-react';
import DashboardCard from './dashboard-cards';
import { Skeleton } from "@/components/ui/skeleton";
import { getCountEO } from '@/app/dashboard-eo/api';
import { getCountSE } from '@/app/dashboard-se/api';

const dashboardConfig = {
    10: [
        { title: "Total Pending \nApplications to Accept", key: "TotalPendingApplications", icon: Clock, color: "purple", link: "/totalPending" },
        { title: "Last 15 Days Pending\nApplications to Accept", key: "Last15DaysPendingApplications", icon: CalendarClock, color: "blue", link: "/last15DaysPending" },
        { title: "Accepted but Verification Pending (EO)", key: "EOAccepectButNotStartedVerify", icon: CircleCheckBig, color: "green", link: "/eoAcceptedFile" },
        // { title: "Verification Pending \n(EO)", key: "EOStartedVerify", icon: FileClock, color: "yellow", link: "/pendingVerificatonEO" },
        { title: "Verified by EO\n ", key: "EOComplete", icon: FileCheck2, color: "lime", link: "/verificationCompletedEO" },
        { title: "Verification Pending \n(OC)", key: "OCPending", icon: ClockAlert, color: "red", link: "/pendingInOC" },
        { title: "Verified By OC\n ", key: "OCComplete", icon: BadgeCheck, color: "teal", link: "/completed-oc" },
        { title: "Verification Pending \n(SP/DIB)", key: "SPPending", icon: Clock, color: "orange", link: "/pendingInSPDIB" },
        { title: "Verification Pending \n(Spl. Enquiry Officer)", key: "SEPending", icon: Clock, color: "pink", link: "/pendingInEnquiryOfficer" },
    ],
    40: [
        { title: "Verification Pending \n(at Police Station)", key: "TotalPendingApplications", icon: Clock, color: "yellow", link: "/allFiles" },
        { title: "Applications Accepted\nbut Verifiaction Pending", key: "EOAccepectButNotStartedVerify", icon: CheckCheck, color: "blue", link: "/acceptedAndVerificationPending-eo" },
        { title: "Verification Completed\nBy EO", key: "EOComplete", icon: BadgeCheck, color: "purple", link: "/verificationCompletedEO" },
        { title: "Application Rejected\nBy SP/DIB", key: "SPReject", icon: Ban, color: "red", link: "/rejected-sp" },
        { title: "Approved\nBy SP/DIB", key: "SPApprove", icon: FileCheck2, color: "teal", link: "/completed-sp" },
    ],
    30: [
        { title: "Verification Pending", key: "OCPending", icon: Clock, color: "yellow", link: "/allFiles-oc" },
        { title: "Verified Applications", key: "OCComplete", icon: BadgeCheck, color: "purple", link: "/completed-oc" },
    ],
    20: [
        { title: "Total Pending Applications to Accept", key: "TotalPendingApplications", icon: CircleDashed, color: "purple", link: "/totalPending" },
        { title: "Verification Pending (SP/DIB)", key: "SPPending", icon: ArrowRightToLine, color: "orange", link: "/allFiles-sp" },
        { title: "Verified By SP/DIB", key: "SPDone", icon: ArrowRightToLine, color: "pink", link: "/completed-sp" },
        { title: "Last 15 Days Pending to Accept", key: "Last15DaysPendingApplications", icon: TrendingDown, color: "blue", link: "/last15DaysPending" },
        { title: "Accepted by EO", key: "EOAccepectButNotStartedVerify", icon: ArrowRightToLine, color: "green", link: "/eoAcceptedFile" },
        // { title: "Verification Pending (EO)", key: "EOStartedVerify", icon: ArrowRightToLine, color: "yellow", link: "/pendingVerificatonEO" },
        { title: "Verified by EO", key: "EOComplete", icon: ArrowRightToLine, color: "lime", link: "/verificationCompletedEO" },
        { title: "Verification Pending (OC)", key: "OCPending", icon: ArrowRightToLine, color: "red", link: "/pendingInOC" },
        { title: "Verified By OC", key: "OCComplete", icon: ArrowRightToLine, color: "teal", link: "/completed-oc" },
        { title: "Verification Pending \n(Spl. EO)", key: "SEPending", icon: ArrowRightToLine, color: "yellow", link: "/pendingInEnquiryOfficer" },
        { title: "RE-Verified by Spl. EO", key: "SPPendingReverify", icon: ArrowRightToLine, color: "orange", link: "/re-verifiedBy-se" },
        // { title: "Transferd Case", key: "transferCaseCompleted", icon: ArrowRightToLine, color: "green", link: "/transferCaseCompleted" },
        // { title: "Pending Transfer Case", key: "transferCasePending", icon: ArrowRightToLine, color: "red", link: "/transferCasePending" },
        // { title: "Verified by Enquiry Officer", key: "SEComplete", icon: ArrowRightToLine, color: "blue", link: "/completed-se" },
        // { title: "Verified by Enquiry Officer", key: "SPPendingReverify", icon: ArrowRightToLine, color: "orange", link: "/reverifiedBySE" },
    ],
    50: [
        { title: "Verification Pending (Spl. EO)", key: "SEPending", icon: ArrowRightToLine, color: "purple", link: "/allFiles-se" },
        { title: "Re-Verified By Spl. EO", key: "SEComplete", icon: ArrowRightToLine, color: "lime", link: "/completed-se" },
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

    // // for other users
    // useEffect(() => {
    //     const fetchDashboard = async () => {
    //         const response = await getDistrictNodalDashBoard();
    //         setData(response?.data);
    //     };
    //     console.log("auth_type",auth_type);

    //     auth_type !== 40 && fetchDashboard();
    //     setLogin_type(auth_type);
    // }, [login_type]);

    // // only for eo user
    // useEffect(() => {
    //     const fetchDashboardEO = async () => {
    //         const response = await getCountEO();
    //         setData(response?.data);
    //     };
    //     auth_type == 40 && fetchDashboardEO();
    //     setLogin_type(auth_type);
    // }, [login_type]);


    useEffect(() => {
        const fetchDashboard = async () => {
            if (auth_type == "40") {
                const response = await getCountEO()
                setData(response?.data)
            } else if (auth_type == "50") {
                const response = await getCountSE()
                setData(response?.data)
            } else {
                const response = await getDistrictNodalDashBoard()
                setData(response?.data)
            }
        }

        fetchDashboard()
    }, [auth_type])

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
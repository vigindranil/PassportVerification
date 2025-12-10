"use client";

import { useEffect, useState } from "react";
import Cookies from "react-cookies";
import { getDistrictNodalDashBoard } from "@/app/dashboard/api";
import {
  CircleDashed,
  TrendingDown,
  ArrowRightToLine,
  Clock,
  CalendarClock,
  CircleCheckBig,
  FileClock,
  FileCheck2,
  ClockAlert,
  CircleCheck,
  CheckCheck,
  BadgeCheck,
  Ban,
  Stamp,
} from "lucide-react";
import DashboardCard from "./dashboard-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { getCountEO } from "@/app/dashboard-eo/api";
import { getCountSE } from "@/app/dashboard-se/api";
import { getStateDashBoard } from "@/app/dashboard-stateadmin/api";

const dashboardConfig = {
  10: [ // district nodal officer
    {
      title: "Applications pending to be accepted by the EO",
      key: "TotalPendingApplications",
      icon: Clock,
      color: "purple",
      link: "/totalPending",
    },
    {
      title: "Applications pending for more than 15 days to be accepted by the EO",
      key: "Last15DaysPendingApplications",
      icon: CalendarClock,
      color: "blue",
      link: "/last15DaysPending",
    },
    {
      title: "Accepted but Verification Pending (EO)",
      key: "EOAccepectButNotStartedVerify",
      icon: CircleCheckBig,
      color: "green",
      link: "/eoAcceptedFile",
    },
    // { title: "Verification Pending \n(EO)", key: "EOStartedVerify", icon: FileClock, color: "yellow", link: "/pendingVerificatonEO" },
    {
      title: "Verified by EOs",
      key: "EOComplete",
      icon: FileCheck2,
      color: "lime",
      link: "/verificationCompletedEO",
    },
    {
      title: "Pending with OC/IC",
      key: "OCPending",
      icon: ClockAlert,
      color: "red",
      link: "/pendingInOC",
    },
    {
      title: "Verified by OC/IC",
      key: "OCComplete",
      icon: BadgeCheck,
      color: "teal",
      link: "/completed-oc",
    },
    {
      title: "Pending with SP DIB / DC SB",
      key: "SPPending",
      icon: Clock,
      color: "orange",
      link: "/pendingInSPDIB",
    },
    {
      title: "Endorsed to Spl. EO by SP DIB/ DC SB",
      key: "SEPending",
      icon: Clock,
      color: "pink",
      link: "/pendingInEnquiryOfficer",
    },
  ],
  40: [ // enquiry officer
    {
      title: "Verification Pending \n(at Police Station)",
      key: "TotalPendingApplications",
      icon: Clock,
      color: "yellow",
      link: "/allFiles",
    },
    {
      title: "Applications Accepted\nbut Verifiaction Pending",
      key: "EOAccepectButNotStartedVerify",
      icon: CheckCheck,
      color: "blue",
      link: "/acceptedAndVerificationPending-eo",
    },
    {
      title: "Verification Completed\nBy EO",
      key: "EOComplete",
      icon: BadgeCheck,
      color: "purple",
      link: "/verificationCompletedEO",
    },
    {
      title: "Special Application\nCompleted by EO",
      key: "EOSplApplication",
      icon: Stamp,
      color: "lime",
      link: "/spl-application-eo",
    },
    {
      title: "Application Rejected\nBy SP/DIB",
      key: "SPReject",
      icon: Ban,
      color: "red",
      link: "/rejected-sp",
    },
    {
      title: "Approved\nBy SP/DIB",
      key: "SPApprove",
      icon: FileCheck2,
      color: "teal",
      link: "/completed-sp-approved",
    },
  ],
  30: [ // OC/IC 
    {
      title: "Verification Pending",
      key: "OCPending",
      icon: Clock,
      color: "yellow",
      link: "/allFiles-oc",
    },
    {
      title: "Verified Applications",
      key: "OCComplete",
      icon: BadgeCheck,
      color: "purple",
      link: "/completed-oc",
    },
  ],
  20: [ // SP DIB/ DC SB
    {
      title: "Applications pending to be accepted by the EO",
      key: "TotalPendingApplications",
      icon: CalendarClock,
      color: "purple",
      link: "/totalPending",
    },
    {
      title: "Pending with SP DIB / DC SB",
      key: "SPPending",
      icon: CalendarClock,
      color: "orange",
      link: "/allFiles-sp",
    },
    {
      title: "Special Application\nPending by SP/DIB",
      key: "SPecialApplicationPending",
      icon: CalendarClock,
      color: "purple",
      link: "/spl-application-sp",
    },
    {
      title: "Approved by SP DIB/ DC SB",
      key: "SPApprove",
      icon: FileCheck2,
      color: "green",
      link: "/completed-sp-approved",
    },
    {
      title: "Rejected by SP DIB/ DC SB",
      key: "SPReject",
      icon: Ban,
      color: "red",
      link: "/completed-sp-rejected",
    },
    {
      title: "Pending with the EO for more than 10 days for verification",
      key: "PendingWithEOformorethan10days",
      icon: CalendarClock,
      color: "blue",
      link: "/last10DaysPending",
    },
    {
      title: "Applications pending for more than 15 days to be accepted by the EO",
      key: "Last15DaysPendingApplications",
      icon: CalendarClock,
      color: "blue",
      link: "/last15DaysPending",
    },
    {
      title: "Verification pending with EO",
      key: "EOAccepectButNotStartedVerify",
      icon: ArrowRightToLine,
      color: "green",
      link: "/eoAcceptedFile",
    },
    {
      title: "Transferred Applications",
      key: "TransferApplicationCount",
      icon: CircleDashed,
      color: "purple",
      link: "/transfer-application-count",
    },
    // { title: "Verification Pending (EO)", key: "EOStartedVerify", icon: ArrowRightToLine, color: "yellow", link: "/pendingVerificatonEO" },
    {
      title: "Verified by EOs",
      key: "EOComplete",
      icon: ArrowRightToLine,
      color: "lime",
      link: "/verificationCompletedEO",
    },
    {
      title: "Pending with OC/IC",
      key: "OCPending",
      icon: ArrowRightToLine,
      color: "red",
      link: "/pendingInOC",
    },
    {
      title: "Verified by OC/IC",
      key: "OCComplete",
      icon: ArrowRightToLine,
      color: "teal",
      link: "/completed-oc",
    },
    {
      title: "Endorsed to Spl. EO by SP DIB/ DC SB",
      key: "SEPending",
      icon: ArrowRightToLine,
      color: "yellow",
      link: "/pendingInEnquiryOfficer",
    },
    {
      title: "Re-Verified by Spl. EO",
      key: "SPPendingReverify",
      icon: ArrowRightToLine,
      color: "orange",
      link: "/re-verifiedBy-se",
    },
    {
      title: "Applications Sent back to EO",
      key: "RevertedApplicationswithEO",
      icon: TrendingDown,
      color: "blue",
      link: "/reverted-to-eo",
    },

    // { title: "Transferd Case", key: "transferCaseCompleted", icon: ArrowRightToLine, color: "green", link: "/transferCaseCompleted" },
    // { title: "Pending Transfer Case", key: "transferCasePending", icon: ArrowRightToLine, color: "red", link: "/transferCasePending" },
    // { title: "Verified by Enquiry Officer", key: "SEComplete", icon: ArrowRightToLine, color: "blue", link: "/completed-se" },
    // { title: "Verified by Enquiry Officer", key: "SPPendingReverify", icon: ArrowRightToLine, color: "orange", link: "/reverifiedBySE" },
  ],
  50: [ // Spl. EO
    {
      title: "Verification Pending (Spl. EO)",
      key: "SEPending",
      icon: ArrowRightToLine,
      color: "purple",
      link: "/allFiles-se",
    },
    {
      title: "Re-Verified By Spl. EO",
      key: "SEComplete",
      icon: ArrowRightToLine,
      color: "lime",
      link: "/completed-se",
    },
  ],
  150: [ // state admin
    {
      title: "Total Applications",
      key: "TotalApplications",
      icon: CircleDashed,
      color: "blue",
      link: "/application-state/0",
    },
    {
      title: "Total Pending Applications",
      key: "TotalPendingApplications",
      icon: CircleDashed,
      color: "red",
      link: "/application-state/1",
    },
    {
      title: "Total Approved Applications",
      key: "TotalApplicationsDONE",
      icon: CircleDashed,
      color: "teal",
      link: "/application-state/2",
    },
  ],
};

const DashboardCards = () => {
  const [data, setData] = useState(null);
  const auth_type = Cookies.load("type");
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
        const response = await getCountEO();
        setData(response?.data);
      } else if (auth_type == "50") {
        const response = await getCountSE();
        setData(response?.data);
      } else if (auth_type == "150") {
        const response = await getStateDashBoard();
        setData(response?.data?.dashboardCount);
      } else {
        const response = await getDistrictNodalDashBoard();
        setData(response?.data);
      }
    };

    fetchDashboard();
  }, [auth_type]);

  return data ? (
    <div
      className={`grid gap-4 md:grid-cols-2 ${
        auth_type == 150 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      }`}
    >
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
        <Skeleton
          key={index}
          className="h-[125px] w-[230px] rounded-xl bg-slate-300 p-5 m-2s"
        >
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-3 w-[80%] bg-slate-100" />
            <Skeleton className="h-[28px] w-[30px] p-0 m-0 rounded-full bg-slate-100" />
          </div>
          <Skeleton className="h-2 w-[60%] bg-slate-100" />
          <Skeleton className="h-6 w-[20%] bg-slate-100 mt-5" />
        </Skeleton>
      ))}
    </div>
  );
};

export default DashboardCards;

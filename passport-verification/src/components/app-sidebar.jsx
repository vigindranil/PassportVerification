"use client";

import * as React from "react";
import { LayoutGrid, PackageSearch } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "Passport Verification",
      logo: LayoutGrid,
      plan: "Portal",
    },
  ],
  navMain:
    [
      // District Nodal
      {
        "title": "District Nodal Operations",
        "url": "#",
        "icon": LayoutGrid,
        "isActive": true,
        "type": 10,
        "items": [
          { "title": "Home", "url": "/dashboard" },
          { "title": "Upload Data", "url": "/upload" },
          { "title": "Create User", "url": "/createUserForm" },
          { "title": "Logout", "url": "/logout" }
        ]
      },
      {
        "title": "Application States",
        "url": "#",
        "icon": PackageSearch,
        "isActive": true,
        "type": 10,
        "items": [
          { "title": "Total Pending Applications", "url": "/totalPending" },
          { "title": "Last 15 Days Pending", "url": "/last15DaysPending" },
          { "title": "EO Accepted", "url": "/eoAcceptedFile" },
          { "title": "Pending Verification (EO)", "url": "/pendingVerificatonEO" },
          { "title": "Verification Completed (EO)", "url": "/verificationCompletedEO" },
          { "title": "Pending IN OC", "url": "/pendingInOC" },
          { "title": "Completed By OC", "url": "/verificationCompletedEO" },
          { "title": "Pending IN SP/DIB", "url": "/pendingInSPDIB" },
          { "title": "Pending IN Enquiry Officer", "url": "/pendingInEnquiryOfficer" },
        ]
      },

      // EO
      {
        "title": "EO Operations",
        "url": "#",
        "icon": LayoutGrid,
        "isActive": true,
        "type": 40,
        "items": [
          { "title": "Home", "url": "/dashboard-eo" },
          { "title": "All Files", "url": "/allFiles" },
          { "title": "Logout", "url": "/logout" }
        ]
      },
      {
        "title": "Application States",
        "url": "#",
        "icon": PackageSearch,
        "isActive": true,
        "type": 40,
        "items": [
          { "title": "Verify Pending (PS)", "url": "/allFiles" },
          { "title": "Accept & Verify Pending (EO)", "url": "/acceptedAndVerificationPending-eo" },
          { "title": "Verify Completed (EO)", "url": "/verificationCompletedEO" },
        ]
      },

      // OC
      {
        "title": "OC Operations",
        "url": "#",
        "icon": LayoutGrid,
        "isActive": true,
        "type": 30,
        "items": [
          { "title": "Home", "url": "/dashboard-oc" },
          { "title": "All Files", "url": "/allFiles-oc" },
          { "title": "Logout", "url": "/logout" }
        ]
      },
      {
        "title": "Application States",
        "url": "#",
        "icon": PackageSearch,
        "isActive": true,
        "type": 30,
        "items": [
          { "title": "Pending In OC", "url": "/allFiles-oc" },
          { "title": "Completed By OC", "url": "/completed-oc" },
        ]
      },

      // SP
      {
        "title": "SP Operations",
        "url": "#",
        "icon": LayoutGrid,
        "isActive": true,
        "type": 20,
        "items": [
          { "title": "Home", "url": "/dashboard-sp" },
          { "title": "All Files", "url": "/allFiles-sp" },
          { "title": "Logout", "url": "/logout" }
        ]
      },
      {
        "title": "Application States",
        "url": "#",
        "icon": PackageSearch,
        "isActive": true,
        "type": 20,
        "items": [
          { "title": "Total Pending Applications", "url": "/totalPending" },
          { "title": "Last 15 Days Pending", "url": "/last15DaysPending" },
          { "title": "EO Accepted", "url": "/eoAcceptedFile" },
          { "title": "Pending Verification (EO)", "url": "/pendingVerificatonEO" },
          { "title": "Verification Completed (EO)", "url": "/verificationCompletedEO" },
          { "title": "Pending IN OC", "url": "/pendingInOC" },
          { "title": "Completed By OC", "url": "/verificationCompletedEO" },
          { "title": "Pending IN SP/DIB", "url": "/allFiles-sp" },
          { "title": "Complete IN SP/DIB", "url": "/completed-sp" },
          { "title": "Pending IN Enquiry Officer", "url": "/pendingInEnquiryOfficer" },
          { "title": "Complete IN Enquiry Officer", "url": "/completed-se" },
        ]
      },

      // SE
      {
        "title": "SE Operations",
        "url": "#",
        "icon": LayoutGrid,
        "isActive": true,
        "type": 50,
        "items": [
          { "title": "Home", "url": "/dashboard-se" },
          { "title": "All Files", "url": "/allFiles-se" },
          { "title": "Logout", "url": "/logout" }
        ]
      },
      {
        "title": "Application States",
        "url": "#",
        "icon": PackageSearch,
        "isActive": true,
        "type": 50,
        "items": [
          { "title": "Pending In SE", "url": "/allFiles-oc" },
          { "title": "Completed By SE", "url": "/verificationCompletedEO" },
        ]
      },
    ]
  ,
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

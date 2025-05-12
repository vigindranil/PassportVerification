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
          { "title": "Upload Applications", "url": "/upload" },
          { "title": "Create User", "url": "/createUserForm" },
          { "title": 'Reset Password', "url": '/reset-password' },
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
          { "title": "Applications Accepted by EO", "url": "/eoAcceptedFile" },
          { "title": "Pending in EO", "url": "/pendingVerificatonEO" },
          { "title": "Completed By EO", "url": "/verificationCompletedEO" },
          { "title": "Pending in OC", "url": "/pendingInOC" },
          { "title": "Completed By OC", "url": "/completed-oc" },
          { "title": "Pending in SP/DIB", "url": "/pendingInSPDIB" },
          { "title": "Pending in Enquiry Officer", "url": "/pendingInEnquiryOfficer" },
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
          { "title": 'Reset Password', "url": '/reset-password' },
          { "title": "Logout", "url": "/logout" },
        ]
      },
      {
        "title": "Application States",
        "url": "#",
        "icon": PackageSearch,
        "isActive": true,
        "type": 40,
        "items": [
          { "title": "Verify Pending in (PS)", "url": "/allFiles" },
          { "title": "Accepted but Verification Pending (EO)", "url": "/acceptedAndVerificationPending-eo" },
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
          { "title": 'Reset Password', "url": '/reset-password' },
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
          { "title": 'Reset Password', "url": '/reset-password' },
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
          { "title": "Pending in (EO)", "url": "/pendingVerificatonEO" },
          { "title": "Completed in EO", "url": "/verificationCompletedEO" },
          { "title": "Pending in OC", "url": "/pendingInOC" },
          { "title": "Completed By OC", "url": "/verificationCompletedEO" },
          { "title": "Pending in SP/DIB", "url": "/allFiles-sp" },
          { "title": "Complete in SP/DIB", "url": "/completed-sp" },
          { "title": "Pending in Enquiry Officer", "url": "/pendingInEnquiryOfficer" },
          { "title": "Complete in Enquiry Officer", "url": "/completed-se" },
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
          { "title": 'Reset Password', "url": '/reset-password' },
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
          { "title": "Pending in SE", "url": "/allFiles-oc" },
          { "title": "Completed by SE", "url": "/verificationCompletedEO" },
        ]
      },
      {
        "title": "State Admin",
        "url": "#",
        "icon": LayoutGrid,
        "isActive": true,
        "type": 150,
        "items": [
          { "title": "Home", "url": "/dashboard-stateadmin" },
          // { "title": "Upload Applications", "url": "/upload" },
          { "title": "Current Status Report", "url": "/state-admin-report-current" },
          { "title": "Previous Status Report", "url": "/state-admin-report-previous" },
          { "title": 'Reset Password', "url": '/reset-password' },
          { "title": "Logout", "url": "/logout" }
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

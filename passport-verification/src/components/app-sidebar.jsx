"use client";

import * as React from "react";
import { LayoutGrid } from "lucide-react";
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
      {
        "title": "District Nodal Operations",
        "url": "/",
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
        "title": "EO Operations",
        "url": "/",
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
        "title": "OC Operations",
        "url": "/",
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
        "title": "SP Operations",
        "url": "/",
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
        "title": "SE Operations",
        "url": "/",
        "icon": LayoutGrid,
        "isActive": true,
        "type": 50,
        "items": [
          { "title": "Home", "url": "/dashboard-se" },
          { "title": "All Files", "url": "/allFiles-se" },
          { "title": "Logout", "url": "/logout" }
        ]
      }
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

"use client"

import * as React from "react"
import {
  IconBuilding,
  IconChartBar,
  IconDashboard,
  IconHeart,
  IconHome,
  IconMapPin,
  IconPlus,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "PropertySG User",
    email: "user@propertysg.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      section: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Properties",
      section: "properties",
      icon: IconBuilding,
    },
    {
      title: "Analytics",
      section: "analytics",
      icon: IconChartBar,
    },
    {
      title: "Favorites",
      section: "favorites",
      icon: IconHeart,
    },
    {
      title: "Profile",
      section: "profile",
      icon: IconUser,
    },
  ],
  navClouds: [
    {
      title: "My Properties",
      icon: IconHome,
      isActive: true,
      url: "/dashboard/my-properties",
      items: [
        {
          title: "Listed Properties",
          url: "/dashboard/my-properties/listed",
        },
        {
          title: "Draft Listings",
          url: "/dashboard/my-properties/drafts",
        },
        {
          title: "Sold Properties",
          url: "/dashboard/my-properties/sold",
        },
      ],
    },
    {
      title: "Market Areas",
      icon: IconMapPin,
      url: "/dashboard/areas",
      items: [
        {
          title: "Central Singapore",
          url: "/dashboard/areas/central",
        },
        {
          title: "East Singapore",
          url: "/dashboard/areas/east",
        },
        {
          title: "West Singapore", 
          url: "/dashboard/areas/west",
        },
        {
          title: "North Singapore",
          url: "/dashboard/areas/north",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "List Property",
      url: "/dashboard/list-property",
      icon: IconPlus,
    },
  ],
  documents: [
    {
      name: "Property Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      name: "Market Reports",
      url: "/dashboard/reports",
      icon: IconBuilding,
    },
    {
      name: "Property Agents",
      url: "/dashboard/agents",
      icon: IconUsers,
    },
  ],
}

export function AppSidebar({ 
  activeSection, 
  setActiveSection, 
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  activeSection?: string
  setActiveSection?: (section: string) => void
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconBuilding className="!size-5" />
                <span className="text-base font-semibold">PropertySG</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

'use client'
import { Contact2Icon, DollarSign, FolderArchive, Home, InboxIcon, LogOut, LucideDollarSign, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import useGlobalStore from "@/store/GlobalStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Issues",
    url: "/issues",
    icon: InboxIcon,
  },
  {
    title: "Bounties",
    url: "/bounties",
    icon: LucideDollarSign,
  },
  {
    title: "Talk To Your Repo",
    url: "/talktorepo",
    icon: Contact2Icon
  },
  {
    title: "Folder Structure",
    url: "/folderstructure",
    icon: FolderArchive
  }
  ,
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Account",
    url: "/account",
    icon: User
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
    HandlerFunction: async () => {
      const response = await axios.get('/api/auth/logout')
      if (response.status === 200) {
        toast({ description: "user logged out successfully", className: "bg-green-500 text-white" })
      } else {
        toast({ description: "please try again", className: "bg-red-500 text-white" })

      }
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }
  },
]
const adminitems = [
  {
    title: "Home",
    url: "/adminhome",
    icon: Home,
  },
  {
    title: "User",
    url: "/admin/users",
    icon: User
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: DollarSign
  },
  {
    title: "Account",
    url: "/account",
    icon: User
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
    HandlerFunction: async () => {
      const response = await axios.get('/api/auth/logout')
      if (response.status === 200) {
        toast({ description: "user logged out successfully", className: "bg-green-500 text-white" })
      } else {
        toast({ description: "please try again", className: "bg-red-500 text-white" })

      }
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }
  },
]

export function AppSidebar() {
  const { user } = useGlobalStore()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>GitTracker</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                user?.role === "admin" ?
                  adminitems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton onClick={item.title === 'Logout' ? item.HandlerFunction : () => { }} asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                  :

                  items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton onClick={item.title === 'Logout' ? item.HandlerFunction : () => { }} asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
              }
              {/* make this more interactive now only forgot password pending i guess */}
              <div className="flex w-full flex-col items-center justify-center">
                <Avatar className="w-10 h-10 flex items-center justify-center" >
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback>{user?.email.split('').slice(0, 1)}</AvatarFallback>
                </Avatar>
                <p className="text-xs mt-4 font-bold">{user?.email}</p>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

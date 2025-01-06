'use client'
import { Calendar, Home, Inbox, LogOut, Settings } from "lucide-react"

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
function clearAllCookies() {
  // clear response from the server for clearing cookies thats the possible way
}
// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
    HandlerFunction:async ()=>{
      clearAllCookies()
      const response=await axios.get('/api/auth/logout')
      if(response.status===200){
        toast({description:"user logged out successfully",className:"bg-green-500 text-white"})
      }else{
        toast({description:"please try again",className:"bg-red-500 text-white"})

      }
      setTimeout(()=>{
        window.location.href='/'
      },1000)
    }
  },
  
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.title==='Logout'?item.HandlerFunction:()=>{}} asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

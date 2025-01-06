'use client'
import { Home, InboxIcon, LogOut, LucideDollarSign, Settings } from "lucide-react"

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
function clearAllCookies() {
  // clear response from the server for clearing cookies thats the possible way
}
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
  const {user}=useGlobalStore()
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
              {/* make this more interactive now only forgot password pending i guess */}
              <p>{user?.email}</p>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

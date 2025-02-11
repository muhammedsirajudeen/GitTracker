'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitBranch, Users, DollarSign, AlertCircle, CheckCircle, BarChart2, Activity, Zap, Shield } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import useSWR from "swr"
import { fetcher } from "./RepositoryListing"
import { useEffect, useState } from "react"
import { RecentActivity } from "@/models/RecentActivity"

interface AdminDashboardResponse{
    status:number
    message:string
    userCount:number
    repositoryCount:number
    totalAmount:number
}

interface RecentActivityResponse{
  message:string
  status:number
  recents:RecentActivity[]
}

export default function AdminDashboardComponent(){
    const {data}=useSWR<AdminDashboardResponse>('/api/admin/dashboard',fetcher)
    const {data:recentData}=useSWR<RecentActivityResponse>('/api/admin/recentactivity',fetcher)
    console.log(data)
    const [server,setServer]=useState(false)
    useEffect(()=>{
      setServer(true)
    },[])
    return(
        <div className="p-6 space-y-8 mt-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.userCount}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              <Progress value={data?.userCount} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Repositories</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.repositoryCount}</div>
              {/* <p className="text-xs text-muted-foreground">+15% from last month</p> */}
              <Progress value={data?.repositoryCount} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalAmount}</div>
              {/* <p className="text-xs text-muted-foreground">+12.5% from last month</p> */}
              {/* <Progress value={12.5} className="mt-2" /> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Agent Utilization</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
          <Card className="h-[400px] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {
                  server &&
                  // [...Array(8)].map((_, i) => (
                  //   <div key={i} className="flex items-center p-2 rounded-lg hover:bg-muted">
                  //     {i % 3 === 0 && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                  //     {i % 3 === 1 && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />}
                  //     {i % 3 === 2 && <Users className="h-4 w-4 text-blue-500 mr-2" />}
                  //     <span>{getRandomActivity()}</span>
                  //   </div>
                  // ))
                  recentData?.recents.map((recent,i)=>{
                  return(
                    <div key={i} className="flex items-center p-2 rounded-lg hover:bg-muted">
                      {(recent.type  === "bounty" || recent.type === "chat" || recent.type==="bountycompletion")  && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                      {recent.type==="repository" && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />}
                      {/* {i % 3 === 2 && <Users className="h-4 w-4 text-blue-500 mr-2" />} */}
                      <span>{recent.message}</span>
                    </div>
                  )      
                  })
                }
                
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getSystemStatus().map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{status.name}</span>
                      <span className={`text-${status.color}-500`}>{status.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getKeyMetrics().map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <span className="text-sm font-medium">{metric.value}</span>
                      </div>
                      <Progress value={metric.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>Manage Users</Button>
              <Button>Review Bounties</Button>
              <Button>Monitor AI Agents</Button>
              <Button>Generate Reports</Button>
              <Button>Update System Settings</Button>
              <Button>View Audit Logs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}


  function getSystemStatus() {
    return [
      { name: "GitHub API", status: "Operational", color: "green" },
      { name: "Solana Integration", status: "Operational", color: "green" },
      { name: "AI Context Processing", status: "Partial Outage", color: "yellow" },
      { name: "User Authentication", status: "Operational", color: "green" },
      { name: "Database Cluster", status: "Operational", color: "green" },
    ]
  }
  
  function getKeyMetrics() {
    return [
      { name: "User Retention", value: "78%", percentage: 78 },
      { name: "Bounty Completion Rate", value: "92%", percentage: 92 },
      { name: "AI Task Accuracy", value: "95%", percentage: 95 },
      { name: "System Uptime", value: "99.9%", percentage: 99.9 },
    ]
  }
  
  
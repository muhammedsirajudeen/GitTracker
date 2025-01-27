import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitBranch, Users, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminHome() {
  return (
    <div className="p-6">      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="h-32" >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repositories</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">789</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,231</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>New repository created: &quot;awesome-project&quot;</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Bounty claimed: Fix pagination bug</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 mr-2" />
                <span>New user registered: johndoe123</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>GitHub API</span>
                <span className="text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Solana Integration</span>
                <span className="text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Context Processing</span>
                <span className="text-yellow-500">Partial Outage</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Notification System</span>
                <span className="text-green-500">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

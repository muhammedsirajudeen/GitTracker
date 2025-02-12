import { GetUserGivenAccessToken } from "@/lib/tokenHelper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminDashboardComponent from "@/components/AdminDashboardComponent"
export default async function AdminHome() {
  const user = await GetUserGivenAccessToken(cookies())
  console.log(user)

  if (user && user.role !== "admin") {
    redirect("/")
  }

  return (
  <AdminDashboardComponent user={user}  />
  )
}


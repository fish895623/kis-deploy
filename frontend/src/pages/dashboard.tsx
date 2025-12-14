import { Users, FileText, BarChart3, TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    description: "+12% from last month",
    icon: Users,
  },
  {
    title: "Documents",
    value: "567",
    description: "+8% from last month",
    icon: FileText,
  },
  {
    title: "Analytics Views",
    value: "12.5K",
    description: "+23% from last month",
    icon: BarChart3,
  },
  {
    title: "Growth Rate",
    value: "18.2%",
    description: "+4.1% from last month",
    icon: TrendingUp,
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="size-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Activity item {i}</p>
                    <p className="text-xs text-muted-foreground">
                      Just now
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {["Create new document", "Invite team member", "View reports"].map(
                (action) => (
                  <button
                    key={action}
                    className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent"
                  >
                    {action}
                  </button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

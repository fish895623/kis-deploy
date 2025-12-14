import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage your team members and their permissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            User list and management features will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

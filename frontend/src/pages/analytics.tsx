import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View your performance metrics and insights.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Analytics charts and data will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          View and manage your documents.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Document list and file management will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

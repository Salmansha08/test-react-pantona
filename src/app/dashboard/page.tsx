import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Pantona
        </h1>
        <p className="text-muted-foreground mt-2">
          Your central dashboard for managing application resources
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              About This Dashboard
            </CardTitle>
            <CardDescription>
              Application details and your information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold">Developer:</span>
              <span className="ml-2">Salman Abdul Jabbaar Wiharja</span>
            </div>
            <div>
              <span className="font-semibold">Tech Stack:</span>
              <span className="ml-2">
                Next.js, TypeScript, Tailwind CSS, Shadcn UI
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              This dashboard demonstrates frontend and backend integration with
              Laravel Sanctum authentication.
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>View and manage system users</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access the user management section to view all registered users in
              the system. The page provides details about each user including
              their profile information and status.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full sm:w-auto">
              <Link
                href="/dashboard/user"
                className="flex items-center justify-center"
              >
                View Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used dashboard actions</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 w-full flex flex-col items-center justify-center"
              asChild
            >
              <Link href="/dashboard/user">
                <Users className="mb-2 h-5 w-5" />
                Users
              </Link>
            </Button>
            {/* You can add more quick action buttons here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

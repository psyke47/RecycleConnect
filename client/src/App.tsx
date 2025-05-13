import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import CollectorDashboard from "@/pages/dashboard/CollectorDashboard";
import TransporterDashboard from "@/pages/dashboard/TransporterDashboard";
import BuyerDashboard from "@/pages/dashboard/BuyerDashboard";
import { UserRole } from "@shared/schema";
import { useAuth } from "./lib/auth";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />

      {/* Role-based protected routes */}
      <Route path="/dashboard">
        {() => {
          if (!user) return <Login />;

          switch (user.role) {
            case UserRole.COLLECTOR:
              return <CollectorDashboard />;
            case UserRole.TRANSPORTER:
              return <TransporterDashboard />;
            case UserRole.BUYER:
              return <BuyerDashboard />;
            default:
              return <NotFound />;
          }
        }}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

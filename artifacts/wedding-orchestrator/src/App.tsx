import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Onboarding from "@/pages/Onboarding";
import Generating from "@/pages/Generating";
import Dashboard from "@/pages/Dashboard";
import Timeline from "@/pages/Timeline";
import Stakeholders from "@/pages/Stakeholders";
import VendorPortal from "@/pages/VendorPortal";
import Reminders from "@/pages/Reminders";
import Risks from "@/pages/Risks";
import Admin from "@/pages/Admin";
import VibeAndVision from "@/pages/VibeAndVision";
import BudgetWatch from "@/pages/BudgetWatch";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/generating" component={Generating} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/stakeholders" component={Stakeholders} />
      <Route path="/vendor-portal/:taskId" component={VendorPortal} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/risks" component={Risks} />
      <Route path="/admin" component={Admin} />
      <Route path="/vibe-and-vision" component={VibeAndVision} />
      <Route path="/budget" component={BudgetWatch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="noise-bg min-h-screen">
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

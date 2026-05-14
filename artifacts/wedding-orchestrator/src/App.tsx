import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { onAuthStateChange, getUser } from "@/lib/supabase";
import { syncService } from "@/lib/syncService";
import { GoogleOneTap } from "@/components/GoogleOneTap";
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
  const getAestheticMode = useStore(state => state.getAestheticMode);
  const user = useStore(state => state.user);
  const hydrateFromCloud = useStore(state => state.hydrateFromCloud);
  const triggerCloudSync = useStore(state => state.triggerCloudSync);
  const mode = getAestheticMode();
  
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Auth State Management
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
        };
        
        // Update user in store
        useStore.setState({ user: userData, isAuthClaimed: true });

        // Load data from cloud
        const cloudData = await syncService.loadWeddingFromCloud(session.user.id);
        if (cloudData) {
          hydrateFromCloud(cloudData);
        }
      } else {
        useStore.setState({ user: null, isAuthClaimed: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [hydrateFromCloud]);

  // 2. Debounced Cloud Sync
  // Watch all store changes and sync if logged in
  useEffect(() => {
    if (!user) return;

    const unsubscribe = useStore.subscribe((state, prevState) => {
      // Don't sync if the only thing that changed was syncStatus or lastSyncedAt
      if (state.syncStatus !== prevState.syncStatus || state.lastSyncedAt !== prevState.lastSyncedAt) return;
      
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      
      syncTimeoutRef.current = setTimeout(() => {
        triggerCloudSync();
      }, 3000); // 3 second debounce
    });

    return () => {
      unsubscribe();
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [user, triggerCloudSync]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={cn("noise-bg min-h-screen transition-colors duration-1000", `mode-${mode}`)}>
          <GoogleOneTap />
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

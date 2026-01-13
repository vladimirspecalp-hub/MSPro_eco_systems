import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Contacts from "@/pages/Contacts";
import Calculator from "@/pages/Calculator";
import Documents from "@/pages/Documents";
import MSPROQuad from "@/pages/MSPROQuad";
import RopeAccess from "@/pages/services/RopeAccess";
import FireproofingAtHeight from "@/pages/services/FireproofingAtHeight";
import AnticorrosionAtHeight from "@/pages/services/AnticorrosionAtHeight";
import ServicePage from "@/pages/services/[slug]";
import SEOPage from "@/pages/SEOPage";
import News from "@/pages/News";
import NewsArticle from "@/pages/NewsArticle";
import NewsDistribution from "@/pages/admin/NewsDistribution";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSettings from "@/pages/admin/Settings";
import NotFound from "@/pages/not-found";
import { initAnalytics, useSpaPageView, initEventDelegation } from "@/modules/analytics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/documents" component={Documents} />
      <Route path="/mspro-quad" component={MSPROQuad} />
      <Route path="/services/rope-access" component={RopeAccess} />
      <Route path="/services/fireproofing-at-height" component={FireproofingAtHeight} />
      <Route path="/services/anticorrosion-at-height" component={AnticorrosionAtHeight} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={NewsArticle} />
      <Route path="/admin/news-distribution" component={NewsDistribution} />

      {/* New Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/settings" component={AdminSettings} />
      {/* Legacy admin route redirect or keeping for now? User wants /admin to be the dashboard probably, but specific route provided in spec is /admin/dashboard implicitly via "Lead Management UI" and "Settings tab". Let's map /admin to dashboard too if needed, or just these. */}

      <Route path="/services/:slug" component={ServicePage} />
      <Route path="/:slug" component={SEOPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  useSpaPageView();
  return <>{children}</>;
}

function App() {
  useEffect(() => {
    initAnalytics();
    initEventDelegation();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AnalyticsWrapper>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
          </AnalyticsWrapper>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

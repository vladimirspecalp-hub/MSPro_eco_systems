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
import FAQ from "@/pages/FAQ";
import RopeAccess from "@/pages/services/RopeAccess";
import FireproofingAtHeight from "@/pages/services/FireproofingAtHeight";
import AnticorrosionAtHeight from "@/pages/services/AnticorrosionAtHeight";
import CeilingSanation from "@/pages/services/CeilingSanation";
import Demolition from "@/pages/services/Demolition";
import ChimneyPainting from "@/pages/services/ChimneyPainting";
import FacadeCleaning from "@/pages/services/FacadeCleaning";
import Sandblasting from "@/pages/services/Sandblasting";
import MechanicalCleaning from "@/pages/services/MechanicalCleaning";
import Hydroblast from "@/pages/services/Hydroblast";
import Dedusting from "@/pages/services/Dedusting";
import ServicePage from "@/pages/services/[slug]";
import SEOPage from "@/pages/SEOPage";
import News from "@/pages/News";
import NewsArticle from "@/pages/NewsArticle";
import NewsDistribution from "@/pages/admin/NewsDistribution";
import AdminLeads from "@/pages/AdminLeads";
import PriceGuide from "@/pages/PriceGuide";
import PricesPage from "@/pages/PricesPage";
import TeamPage from "@/pages/company/TeamPage";
import Knowledge from "@/pages/Knowledge";
import KnowledgeArticle from "@/pages/KnowledgeArticle";
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
      <Route path="/faq" component={FAQ} />
      <Route path="/services/rope-access" component={RopeAccess} />
      <Route path="/services/fireproofing-at-height" component={FireproofingAtHeight} />
      <Route path="/services/anticorrosion-at-height" component={AnticorrosionAtHeight} />
      <Route path="/services/ceiling-sanation" component={CeilingSanation} />
      <Route path="/services/demolition" component={Demolition} />
      <Route path="/services/chimney-painting" component={ChimneyPainting} />
      <Route path="/services/facade-cleaning" component={FacadeCleaning} />
      <Route path="/services/sandblasting" component={Sandblasting} />
      <Route path="/services/mechanical-cleaning" component={MechanicalCleaning} />
      <Route path="/services/hydroblast" component={Hydroblast} />
      <Route path="/services/dedusting" component={Dedusting} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={NewsArticle} />
      <Route path="/admin/news-distribution" component={NewsDistribution} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/services/:slug" component={ServicePage} />
      <Route path="/price-guide/:slug" component={PriceGuide} />
      <Route path="/prices" component={PricesPage} />
      <Route path="/company/team" component={TeamPage} />
      <Route path="/knowledge" component={Knowledge} />
      <Route path="/knowledge/:slug" component={KnowledgeArticle} />
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
    console.log("App mounted");
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

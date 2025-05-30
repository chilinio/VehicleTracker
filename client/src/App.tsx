import React from 'react';
import { Route, Router } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "@/pages/Home";
import BookAppointment from "@/pages/BookAppointment";
import AdminPage from './pages/Admin';

function AppRoutes() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/book-appointment" component={BookAppointment} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/:rest*" component={NotFound} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

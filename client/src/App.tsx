import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import TutorialDialog from "./components/TutorialDialog";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
        <TutorialDialog />
        <Toaster />
      </main>
    </QueryClientProvider>
  );
}

export default App;

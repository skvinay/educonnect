import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";
import Exams from "./pages/Exams";
import ExamStreamDetail from "./pages/ExamStreamDetail";
import Colleges from "./pages/Colleges";
import CollegeStreamDetail from "./pages/CollegeStreamDetail";
import Scholarships from "./pages/Scholarships";
import CareerTest from "./pages/CareerTest";
import NotFound from "./pages/NotFound";
import { TranslationLoadingProvider } from "@/components/TranslationLoadingContext";
import { GlobalTranslationLoader } from "@/components/GlobalTranslationLoader";
import StudentRegistration from "./pages/StudentRegistration";
import ReelsRegistration from "./pages/ReelsRegistration";
import ExhibitorRegistration from "./pages/ExhibitorRegistration";
import Opportunities from "./pages/Opportunities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GlobalTranslationLoader />

      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:id" element={<CareerDetail />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:stream" element={<ExamStreamDetail />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/colleges/:stream" element={<CollegeStreamDetail />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/career-test" element={<CareerTest />} />
          <Route
            path="/student-registration"
            element={<StudentRegistration />}
          />
          <Route path="/reels-registration" element={<ReelsRegistration />} />
          <Route
            path="/exhibitor-registration"
            element={<ExhibitorRegistration />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

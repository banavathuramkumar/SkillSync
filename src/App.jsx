import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout & Route Guards
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Public & Auth Pages
import { LandingPage } from "./pages/public/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ProfileSetupPage } from "./pages/auth/ProfileSetupPage";

// Main Protected Platform Pages
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { FindTeamsPage } from "./pages/teams/FindTeamsPage";
import { CreateTeamPage } from "./pages/teams/CreateTeamPage";
import { TeamDetailsPage } from "./pages/teams/TeamDetailsPage";
import { MyTeamsPage } from "./pages/teams/MyTeamsPage";
import { SavedTeamsPage } from "./pages/teams/SavedTeamsPage";
import { CompetitionsPage } from "./pages/competitions/CompetitionsPage";
import { MessagesPage } from "./pages/messages/MessagesPage";
import { NotificationsPage } from "./pages/profile/NotificationsPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { HelpPage } from "./pages/info/HelpPage";
import { GuidelinesPage } from "./pages/info/GuidelinesPage";

export const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Landing & Authentication */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Mandatory Profile Setup Gate (Requires Auth, but allows incomplete profile) */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Application Routes (Enforces Profile Gate) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/teams" element={<FindTeamsPage />} />
          <Route path="/teams/create" element={<CreateTeamPage />} />
          <Route path="/teams/:id" element={<TeamDetailsPage />} />
          <Route path="/my-teams" element={<MyTeamsPage />} />
          <Route path="/saved-teams" element={<SavedTeamsPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

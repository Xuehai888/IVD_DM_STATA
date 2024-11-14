import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginForm } from './components/Auth/LoginForm';
import { ProjectList } from './components/Project/ProjectList';
import { DataEntryForm } from './components/DataEntry/DataEntryForm';
import { RecordList } from './components/DataEntry/RecordList';
import { useProjectStore } from './store/projectStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function DataEntryPage() {
  const currentProject = useProjectStore((state) => state.currentProject);

  if (!currentProject) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          <RecordList />
          <DataEntryForm />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ProjectList />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PrivateRoute>
              <DataEntryPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
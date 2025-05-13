import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { UserRole } from '@shared/schema';
import { useAuth } from '@/lib/auth';
import CollectorDashboard from './CollectorDashboard';
import TransporterDashboard from './TransporterDashboard';
import BuyerDashboard from './BuyerDashboard';
import NotFound from '@/pages/not-found';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      setLocation('/login');
    }
  }, [isLoading, user, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  // Guard against direct access without auth
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Render appropriate dashboard based on user role
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
}
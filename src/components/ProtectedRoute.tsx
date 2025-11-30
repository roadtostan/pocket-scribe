import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/context/FinanceContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, session } = useFinance();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !user) {
      navigate('/auth');
    }
  }, [session, user, navigate]);

  if (!session || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

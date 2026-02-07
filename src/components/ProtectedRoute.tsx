import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/context/FinanceContext';
import HomeSkeleton from '@/components/HomeSkeleton';

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
    return <HomeSkeleton />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

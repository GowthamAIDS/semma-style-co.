import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page container" style={{ textAlign: 'center', paddingTop: 120 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (admin && user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

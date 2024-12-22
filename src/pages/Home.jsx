import React from 'react';
import HomeAdmin from './HomeAdmin.jsx';
import HomeUser from './HomeUser.jsx';
import HomeVisitor from './HomeVisitor.jsx';
import Loading from './Loading.jsx';
import { useAuth } from '@/security/auth/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();
  console.log('[Home] Loading state:', loading, 'User state:', user);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <HomeVisitor />;
  }

  return user.admin ? <HomeAdmin /> : <HomeUser />;
};

export default Home;

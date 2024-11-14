// Home.jsx
import React from 'react';
import HomeAdmin from './HomeAdmin.jsx';
import HomeUser from './HomeUser.jsx';
import HomeVisitor from './HomeVisitor.jsx';
import Loading from './Loading.jsx';


const Home = () => {
  const user = null; 
  const loading = false; 

  if (loading) {
    
    return (
      <Loading />
    );
  }

  if (!user) {
    
    return <HomeVisitor />;
  }

  return user.admin ? <HomeAdmin /> : <HomeUser />;
};

export default Home;

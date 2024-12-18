import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const HomeAdmin = () => {

  const navigate = useNavigate();

  return (
    <Container>
      <Button onClick={() => navigate('/test')} >
        test
      </Button>
    Ce sera la page d'accueil pour les admins
    </Container>
  );
};

export default HomeAdmin;

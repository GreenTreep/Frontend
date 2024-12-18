import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      console.log('Register successful:', response.data);
      alert('Inscription réussie !');
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-cover bg-center bg-no-repeat bg-[url('/image_1.png')]">
      <Card className="w-96 p-6 bg-opacity-80 bg-white rounded-lg shadow-md flex flex-col gap-4 opacity-0 animate-slidein300">
        <CardHeader className="mb-2">
          <CardTitle className="text-4xl text-center font-bold text-gray-700">Inscription</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-row space-x-3">
            <Input
              type="text"
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </CardContent>

        <CardFooter className="flex justify-between mt-2 items-center">
          <a href="/login" className="text-sm text-green-600 hover:underline">
            Vous avez déjà un compte ?
          </a>
          <Button className="rounded-lg" onClick={handleRegister}>
            S'inscrire
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;

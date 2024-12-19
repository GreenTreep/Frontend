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
  const [errors, setErrors] = useState({}); // Gestion des erreurs par champ
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'Le prénom est requis.';
    if (!lastName.trim()) newErrors.lastName = 'Le nom est requis.';
    if (!email.trim()) newErrors.email = 'L\'email est requis.';
    if (!password.trim()) newErrors.password = 'Le mot de passe est requis.';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'La confirmation du mot de passe est requise.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) return;
  
    try {
      setGeneralError('');
      await axios.post('http://localhost:8080/api/v1/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      alert('Inscription réussie !');
      navigate('/login');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setGeneralError('Un compte avec cette adresse email existe déjà. Veuillez vous connecter.');
        } else if (error.response.status === 500) {
          setGeneralError('Erreur interne du serveur. Veuillez réessayer plus tard.');
        } else {
          setGeneralError('Une erreur est survenue. Veuillez vérifier vos informations.');
        }
      } else {
        setGeneralError('Impossible de communiquer avec le serveur. Vérifiez votre connexion.');
      }
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
            <div className="flex flex-col w-full">
              <Input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`border rounded-lg focus:outline-none p-2 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <Input
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`border rounded-lg focus:outline-none p-2 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border rounded-lg focus:outline-none p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border rounded-lg focus:outline-none p-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`border rounded-lg focus:outline-none p-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {generalError && (
            <p className="text-red-500 text-center text-sm">{generalError}</p>
          )}
          <div className="flex justify-between items-center">
            <a href="/login" className="text-sm text-green-600 hover:underline mr-2">
              Vous avez déjà un compte ?
            </a>
            <Button className="rounded-lg" onClick={handleRegister}>
              S'inscrire
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;

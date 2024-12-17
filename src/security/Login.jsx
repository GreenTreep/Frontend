import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Login() {
  return (
    <>
      <div
        className="flex items-center justify-center w-screen h-screen bg-cover bg-center bg-no-repeat bg-[url('/image_1.png')]"
      >
        <Card className="w-96 p-6 bg-opacity-80 bg-white rounded-lg shadow-md flex flex-col gap-4 opacity-0 animate-slidein300">
          {/* Header */}
          <CardHeader className="mb-2">
            <CardTitle className="text-4xl text-center font-bold text-gray-700">Login</CardTitle>
          </CardHeader>

          {/* Content */}
          <CardContent className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email"
              className="border rounded-lg focus:outline-none p-2"
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              className="border rounded-lg focus:outline-none p-2"
            />
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col gap-2 mt-2">
            {/* Ligne avec le bouton et mot de passe oublié */}
            <div className="flex justify-between w-full items-center">
              {/* Lien pour mot de passe oublié */}
              <a
                href="#"
                className="text-sm text-green-600 hover:underline"
              >
                Mot de passe oublié ?
              </a>

              {/* Bouton Se connecter */}
              <Button className="rounded-lg">
                Se connecter
              </Button>
            </div>

            {/* Ligne pour le lien d'inscription */}
            <div className="text-sm text-gray-600 text-center mt-4">
              Vous n'avez pas de compte ?  {" "}
              <a
                href="/register"
                className="text-green-600 font-semibold hover:underline"
              >
                S'inscrire
              </a>
            </div>
          </CardFooter>


        </Card>
      </div>
    </>
  )
}

export default Login

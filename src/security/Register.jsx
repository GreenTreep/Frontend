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

function Register() {
  return (
    <>
    <div 
        className="flex items-center justify-center w-screen h-screen bg-cover bg-center bg-no-repeat bg-[url('/image_1.png')] scale-105"
    >
        <Card className="w-96 p-6 bg-opacity-80 bg-white rounded-lg shadow-md flex flex-col gap-4 opacity-0 animate-slidein300">
        {/* Header */}
        <CardHeader className="mb-2">
            <CardTitle className="text-4xl text-center font-bold text-gray-700">Inscription</CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex flex-col gap-4">
            <div className='flex flex-row space-x-3'>
                <Input 
                type="text" 
                placeholder="Nom" 
                className="border rounded-lg focus:outline-none p-2"
                />
                <Input 
                type="text" 
                placeholder="Prénom" 
                className="border rounded-lg focus:outline-none p-2"
                />
            </div>
            
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
            <Input 
            type="password" 
            placeholder="Confirmer le mot de passe" 
            className="border rounded-lg focus:outline-none p-2"
            />
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between mt-2 items-center">
            <a 
            href="/login" 
            className="text-sm text-green-600 hover:underline"
            >
            Vous avez déjà un compte ?
            </a>

            <Button className="rounded-lg">
            S'inscrire
            </Button>
        </CardFooter>
        </Card>
    </div>
    </>

  )
}

export default Register
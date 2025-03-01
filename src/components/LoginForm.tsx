
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ClipLoader } from 'react-spinners';

const LoginForm: React.FC = () => {
  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const loginResponse = await login(document, password);
      authLogin(loginResponse);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Falha no login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden backdrop-blur-sm bg-white/95 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">CEMIG Account</CardTitle>
        <CardDescription className="text-center">
          Entre com suas credenciais da CEMIG
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document">CPF/CNPJ</Label>
            <Input
              id="document"
              placeholder="Digite seu CPF ou CNPJ"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <ClipLoader size={18} color="#ffffff" /> : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          Acesse o histórico de suas contas CEMIG
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

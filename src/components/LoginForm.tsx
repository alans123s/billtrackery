
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { LockKeyhole, Key } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
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

      // Success animation
      toast({
        title: "Login bem-sucedido!",
        description: "Bem-vindo ao Astro Energy Manager",
        variant: "default",
      });

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto overflow-hidden backdrop-blur-sm bg-white/95 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <motion.div 
          className="absolute -top-10 -right-10 w-40 h-40 bg-astro-green/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-astro-yellow/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
              <img 
                src="/lovable-uploads/20d2e0f2-4085-486e-b7ca-78c9c344ac08.png"
                alt="Astro Energy Logo"
                className="h-16 w-auto"
              />
            </motion.div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-astro-green">Astro Energy Account</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais da Astro Energy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div 
              className="space-y-2"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
            >
              <Label htmlFor="document" className="flex items-center gap-1">
                <LockKeyhole className={`h-4 w-4 ${focusedField === 'document' ? 'text-astro-green' : 'text-gray-500'}`} />
                CPF/CNPJ
              </Label>
              <Input
                id="document"
                placeholder="Digite seu CPF ou CNPJ"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                onFocus={() => setFocusedField('document')}
                onBlur={() => setFocusedField(null)}
                className={`transition-all duration-300 ${focusedField === 'document' ? 'border-astro-green ring-1 ring-astro-green/20' : ''}`}
                required
              />
            </motion.div>
            <motion.div 
              className="space-y-2"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
            >
              <Label htmlFor="password" className="flex items-center gap-1">
                <Key className={`h-4 w-4 ${focusedField === 'password' ? 'text-astro-green' : 'text-gray-500'}`} />
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`transition-all duration-300 ${focusedField === 'password' ? 'border-astro-green ring-1 ring-astro-green/20' : ''}`}
                required
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-astro-green hover:bg-astro-green/90 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ClipLoader size={18} color="#ffffff" />
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Entrar
                  </motion.span>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Acesse o histórico de suas contas Astro Energy
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginForm;

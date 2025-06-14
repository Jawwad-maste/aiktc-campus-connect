
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [department, setDepartment] = useState<'computer_engineering' | 'ai_ml' | 'data_science'>('computer_engineering');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({ 
        title: "Error", 
        description: "Please fill in all required fields", 
        variant: "destructive" 
      });
      return;
    }

    if (!isLogin && !fullName.trim()) {
      toast({ 
        title: "Error", 
        description: "Full name is required for registration", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast({ 
          title: "Welcome back!", 
          description: "You have been signed in successfully." 
        });
        navigate('/dashboard');
      } else {
        await signUp(email, password, { 
          full_name: fullName.trim(), 
          role, 
          department 
        });
        toast({ 
          title: "Account created!", 
          description: "Please check your email for verification if required." 
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = "An error occurred during authentication";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the confirmation link.";
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({ 
        title: "Authentication Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aiktc-ivory flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-aiktc-gold/30 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-aiktc-black">
              {isLogin ? 'Welcome Back' : 'Join AIKTC'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                {!isLogin && (
                  <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={role} onValueChange={(value: 'student' | 'faculty') => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={department} onValueChange={(value: 'computer_engineering' | 'ai_ml' | 'data_science') => setDepartment(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer_engineering">Computer Engineering</SelectItem>
                        <SelectItem value="ai_ml">AI & Machine Learning</SelectItem>
                        <SelectItem value="data_science">Data Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-aiktc-coral hover:bg-red-600 text-white"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  // Clear form when switching
                  setEmail('');
                  setPassword('');
                  setFullName('');
                }}
                className="text-aiktc-coral hover:underline text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;

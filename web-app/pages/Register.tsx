
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    const pw = formData.password;
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 8) strength += 1;
    if (/[A-Z]/.test(pw)) strength += 1;
    if (/[0-9]/.test(pw)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="p-2 premium-gradient rounded-xl shadow-lg">
              <Brain className="text-white" size={32} />
            </div>
            <span className="text-3xl font-bold gradient-text">Context</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Your Second Brain</h1>
          <p className="text-slate-500">Join the thousands organizing their digital life</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
              icon={<User size={18} />}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={18} />}
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                icon={<Lock size={18} />}
              />
              {formData.password && (
                <div className="flex gap-1 px-1">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className={`h-1.5 flex-grow rounded-full transition-colors ${
                        i <= strength ? 'bg-indigo-500' : 'bg-slate-100'
                      }`} 
                    />
                  ))}
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              error={error}
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<ShieldCheck size={18} />}
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight size={20} />}
            >
              Get Started
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

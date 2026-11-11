import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { ApiError } from '../services/api';

interface SigninProps {
  onNavigateToSignup: () => void;
}

export const Signin: React.FC<SigninProps> = ({ onNavigateToSignup }) => {
  const { signin, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      await signin({ username: username.trim(), password });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to sign in. Please verify your connection.');
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access your virtual spaces"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="mc-slot flex items-center gap-2.5 p-3 text-xs text-meta-redstone">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Username"
          placeholder="e.g. explorer_one or admin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<User className="w-4 h-4" />}
          autoComplete="username"
          autoFocus
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          autoComplete="current-password"
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Enter Metaverse
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-[#35353E] text-center">
          <p className="text-xs text-meta-muted">
            Don't have an avatar account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="font-bold text-[#4DEDF3] hover:text-[#2EC4CD] hover:underline transition-colors mc-text-diamond text-xs"
            >
              Create an account
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

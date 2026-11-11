import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ApiError } from '../services/api';

interface SignupProps {
  onNavigateToSignin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigateToSignin }) => {
  const { signup, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }
    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Standard user registration only (as per Rules.md)
      await signup({ username: trimmedUsername, password, type: 'user' });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
  };

  return (
    <AuthLayout
      title="Create Explorer Account"
      subtitle="Register to explore 2D virtual worlds and persistent multiplayer spaces"
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
          placeholder="e.g. cyber_nomad"
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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<ShieldCheck className="w-4 h-4" />}
          autoComplete="new-password"
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            variant="cyan"
            loading={loading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account & Launch
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-[#35353E] text-center">
          <p className="text-xs text-meta-muted">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignin}
              className="font-bold text-[#4DEDF3] hover:text-[#2EC4CD] hover:underline transition-colors mc-text-diamond text-xs"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

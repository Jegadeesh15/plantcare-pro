import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './components/ui/card';
import { Input } from './components/ui/input';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setStep(2);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setStep(3);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reset_token: otp, new_password: newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Password reset successfully! Please login.');
        navigate('/login');
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full border-2 hover:border-green-200 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Password Reset</CardTitle>
          <CardDescription>
            {step === 1 && "Enter your email to receive a verification code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Create a new strong password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded mb-4">{error}</div>}
          {message && <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded mb-4">{message}</div>}
          
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Send Verification Code
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                type="text"
                placeholder="6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full text-center text-lg tracking-widest"
                maxLength={6}
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Verify Code
              </Button>
              <Button type="button" onClick={handleSendOtp} variant="ghost" className="w-full text-sm">
                Resend Code
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full"
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Update Password
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-gray-600 hover:text-green-600">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;

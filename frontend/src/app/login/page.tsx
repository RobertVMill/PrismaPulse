import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Signal7',
  description: 'Login to your Signal7 account to access personalized news and insights.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}

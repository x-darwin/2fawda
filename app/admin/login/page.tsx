import LoginForm from '@/components/admin/LoginForm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;
  const validAccessToken = process.env.ADMIN_ACCESS_TOKEN;

  // Verify access token
  if (!token || token !== validAccessToken) {
    redirect('/');
  }

  // Check if already authenticated
  const authToken = cookies().get('admin_token')?.value;
  if (authToken) {
    try {
      verify(authToken, JWT_SECRET);
      redirect(`/admin?token=${token}`);
    } catch (error) {
      // Token is invalid, continue to login page
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm token={token} />
    </div>
  );
}
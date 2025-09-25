import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '~/config/auth';

export default async function PostSignin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signin');
  }

  const role = (session.user as any).role as string | undefined;

  if (role === 'OWNER' || role === 'ADMIN') {
    redirect('/');
  }

  redirect('/depot');
}

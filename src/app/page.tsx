import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '~/config/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  redirect('/manage');
}

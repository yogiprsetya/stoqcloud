import Link from 'next/link';
import Image from 'next/image';

export const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <Link href="/" className="flex items-center space-x-3 group">
        <div className="size-8 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
          <Image
            src="/logo-stoqcloud.svg"
            alt="StoqCloud Logo"
            width={32}
            height={32}
            className="size-full"
          />
        </div>

        <span className="text-xl font-semibold accent-text">StoqCloud</span>
      </Link>
    </div>
  );
};

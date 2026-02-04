import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#00003f]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">403</h1>
        <p className="text-white/60 mb-6">
          You don't have access to this resource.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

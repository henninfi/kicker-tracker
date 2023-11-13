import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  const handleSignin = (e) => {
    e.preventDefault();
    signIn();
  };

  const handleSignout = (e) => {
    e.preventDefault();
    signOut();
  };

  return (
    <div className="bg-slate-700 text-slate-200 py-3 px-5 flex justify-between items-center">
      <h1 className="text-xl font-semibold">My App</h1>
      {session ? (
        <button onClick={handleSignout} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
          Sign out
        </button>
      ) : (
        <button onClick={handleSignin} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Sign in
        </button>
      )}
    </div>
  );
}

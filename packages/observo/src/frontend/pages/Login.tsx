import { FormEvent } from 'react';

export default function Login() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: login logic here
    console.log('Form submitted');
  };

  return (
    <div className="h-screen flex justify-center items-center text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 w-full max-w-sm p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Sign in</h2>

        <div className="space-y-2">
          <label htmlFor="username" className="block text-lg font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter username"
            className="w-full px-4 py-2 rounded-xl border-2 border-[#646cff] bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#646cff]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-lg font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full px-4 py-2 rounded-xl border-2 border-[#646cff] bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#646cff]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#646cff] hover:bg-[#535bf2] transition-colors py-2 rounded-xl text-lg font-medium"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

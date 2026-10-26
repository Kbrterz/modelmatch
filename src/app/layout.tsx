import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ModelMatch - AI Model Recommender',
  description: 'Find the most suitable AI model for your questions.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <header className="border-b bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="font-bold text-xl text-indigo-600">ModelMatch</h1>
          <nav className="space-x-4 text-sm font-medium">
            <a href="/" className="hover:text-indigo-600">Home</a>
            <a href="/history" className="hover:text-indigo-600">History</a>
            <a href="/settings" className="hover:text-indigo-600">Settings</a>
            <a href="/login" className="text-indigo-600 border border-indigo-600 px-3 py-1 rounded">Sign In</a>
          </nav>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">{children}</main>
        <footer className="text-center py-4 text-xs text-gray-500 border-t bg-white">
          ModelMatch MVP. Privacy Notice: Do not enter personal or customer data.
        </footer>
      </body>
    </html>
  );
}

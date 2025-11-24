import AuthProvider from '@/context/AuthContext.jsx';
import AppHeader from '@/components/AppHeader.jsx';
import '@/app/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppHeader />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

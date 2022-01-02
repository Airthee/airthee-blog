import '../styles/global.css';
import Head from 'next/head';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script src="/js/matomo.js"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

import { ChakraProvider } from '@chakra-ui/react';
import theme from '../chakra-ui.config'; // Adjust path if in root
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;

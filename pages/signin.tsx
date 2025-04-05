'use client';
import { Box, Button, Flex, Input, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirect
import Head from 'next/head';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const bgGradient = useColorModeValue(
    'linear(to-r, brand.500, brand.600)',
    'linear(to-r, #4A25E1, #7B5AFF)'
  );

  const handleSignIn = () => {
    // Dummy credentials
    const dummyEmail = 'test@example.com';
    const dummyPassword = 'password123';

    if (email === dummyEmail && password === dummyPassword) {
      // Fake auth success
      localStorage.setItem('isAuthenticated', 'true'); // Simple flag
      router.push('/chatui/grok'); // Redirect to a main page
    } else {
      setError('Invalid email or password—try test@example.com / password123');
    }
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Flex direction="column" align="center" justify="center" minH="100vh" bgGradient={bgGradient}>
        <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
          <Text fontSize="2xl" mb={4}>Sign In</Text>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={4}
          />
          {error && <Text color="red.500" mb={4}>{error}</Text>}
          <Button colorScheme="teal" onClick={handleSignIn}>
            Sign In
          </Button>
        </Box>
      </Flex>
    </>
  );
}

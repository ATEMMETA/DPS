'use client';
import React, { FormEvent, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import AuthFooter from '@/components/footer/authfooter';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function SignIn() {
  const titleColor = useColorModeValue('white', 'white');
  const textColor = useColorModeValue('gray.400', 'gray.400');
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    const dummyEmail = 'test@example.com';
    const dummyPassword = 'password123';

    if (email === dummyEmail && password === dummyPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: 'Sign-in successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/chatui/grok');
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid email or password—try test@example.com / password123');
      toast({
        title: 'Sign-in failed',
        description: 'Use test@example.com and password123 to sign in.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Flex
        position="relative"
        minH="100vh"
        align="center"
        justify="center"
        bg={bgColor}
      >
        <Box
          w={{ base: '100%', md: '420px' }}
          p="40px"
          mx="auto"
          borderRadius="15px"
          bg="gray.800"
        >
          <Heading color={titleColor} fontSize="32px" mb="10px">
            Sign In
          </Heading>
          <Text mb="20px" color={textColor} fontSize="sm">
            Enter your email and password to sign in
          </Text>
          <FormControl as="form" onSubmit={handleSignIn}>
            <FormLabel color={textColor}>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              mb="15px"
              color={titleColor}
              bg="gray.700"
              borderColor="gray.600"
              _focus={{ borderColor: 'teal.500' }}
            />
            <FormLabel color={textColor}>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              mb="15px"
              color={titleColor}
              bg="gray.700"
              borderColor="gray.600"
              _focus={{ borderColor: 'teal.500' }}
            />
            {error && (
              <Text color="red.500" mb="15px" fontSize="sm">
                {error}
              </Text>
            )}
            <Button type="submit" colorScheme="teal" w="100%">
              Sign In
            </Button>
          </FormControl>
          <AuthFooter />
        </Box>
      </Flex>
    </>
  );
}

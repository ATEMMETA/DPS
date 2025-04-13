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
import GradientBorder from '@/components/GradientBorder/GradientBorder';
import AuthFooter from '@/components/footer/authfooter';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function SignUp() {
  const titleColor = useColorModeValue('white', 'white');
  const textColor = useColorModeValue('gray.400', 'gray.400');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const bgGradient = useColorModeValue(
    'linear(to-r, brand.500, brand.600)',
    'linear(to-r, #4A25E1, #7B5AFF)'
  );

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!email.includes('@')) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    // Dummy sign-up logic (replace with real API later)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Sign-up successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/signin');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast({
        title: 'Sign-up error',
        description: 'Something went wrong. Try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bgGradient={bgGradient}
      >
        <GradientBorder>
          <Box
            w={{ base: '100%', md: '420px' }}
            p="40px"
            mx="auto"
            borderRadius="15px"
            bg="gray.800"
          >
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Sign Up
            </Heading>
            <Text mb="20px" color={textColor} fontSize="sm">
              Create an account
            </Text>
            <FormControl as="form" onSubmit={handleSignUp}>
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
              <Button
                type="submit"
                isLoading={loading}
                colorScheme="teal"
                w="100%"
              >
                Sign Up
              </Button>
            </FormControl>
            <AuthFooter />
          </Box>
        </GradientBorder>
      </Flex>
    </>
  );
}

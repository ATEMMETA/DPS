'use client';
import React, { FormEvent, useState } from "react";
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
} from "@chakra-ui/react";
import AuthFooter from "../src/components/footer/authfooter"; // Fixed path
import { useRouter } from "next/navigation"; // Updated to next/navigation for App Router
import Head from 'next/head';

function SignIn() {
  const titleColor = "white";
  const textColor = "gray.400";
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>(""); // Added for error display
  const toast = useToast();
  const router = useRouter();

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault(); // Keep the form event handling
    // Dummy credentials
    const dummyEmail = 'test@example.com';
    const dummyPassword = 'password123';

    if (email === dummyEmail && password === dummyPassword) {
      // Fake auth success
      localStorage.setItem('isAuthenticated', 'true'); // Simple flag
      toast({ title: "Sign-in successful", status: "success", duration: 3000, isClosable: true });
      router.push("/chatui/grok"); // Redirect to main page
      setEmail("");
      setPassword("");
    } else {
      setError('Invalid email or password—try test@example.com / password123');
      toast({ 
        title: "Sign-in failed", 
        description: "Use test@example.com and password123 to sign in.", 
        status: "warning", 
        duration: 3000, 
        isClosable: true 
      });
    }
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Flex position="relative" minH="100vh" align="center" justify="center">
        <Box w={{ base: "100%", md: "420px" }} p="40px" mx="auto" borderRadius="15px" bg="gray.800">
          <Heading color={titleColor} fontSize="32px" mb="10px">Sign In</Heading>
          <Text mb="20px" color={textColor} fontSize="sm">Enter your email and password to sign in</Text>
          <FormControl>
            <FormLabel color={textColor}>Email</FormLabel>
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Your email" 
              mb="15px" 
            />
            <FormLabel color={textColor}>Password</FormLabel>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Your password" 
              mb="15px" 
            />
            {error && <Text color="red.500" mb="15px">{error}</Text>} {/* Error display */}
            <Button colorScheme="teal" onClick={handleSignIn} w="100%">
              Sign In
            </Button>
          </FormControl>
          <AuthFooter />
        </Box>
      </Flex>
    </>
  );
}

export default SignIn;

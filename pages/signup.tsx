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
  useColorModeValue,
} from "@chakra-ui/react";
import GradientBorder from "../src/components/GradientBorder/GradientBorder"; // Fixed path
import AuthFooter from "../src/components/footer/authfooter";
import { useRouter } from "next/router";
import Head from 'next/head';

interface SignUpProps {}
interface SignUpResponse { message: string; }

function SignUp({}: SignUpProps) {
  const titleColor = useColorModeValue("white", "white"); // Adjust as needed for dark mode
  const textColor = useColorModeValue("gray.400", "gray.400");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  // Use the brand colors from the theme for the background gradient
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.500, brand.600)',
    'linear(to-r, brand.500, brand.600)'
  );

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Validation Error", description: "Please enter both email and password.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    if (!email.includes("@")) {
      toast({ title: "Validation Error", description: "Please enter a valid email address.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        let errorMessage = "Sign-up failed";
        if (response.status === 400) errorMessage = "Bad request. Please check your inputs.";
        else if (response.status === 409) errorMessage = "User already exists.";
        else if (response.status === 500) errorMessage = "Server error. Please try again later.";
        const errorData: SignUpResponse = await response.json();
        throw new Error(errorData.message || errorMessage);
      }
      toast({ title: "Sign-up successful", status: "success", duration: 3000, isClosable: true });
      router.push("/signin");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({ title: "Sign-up error", description: error.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Flex direction="column" align="center" justify="center" minH="100vh" bgGradient={bgGradient}>
        <GradientBorder>
          <Box w={{ base: "100%", md: "420px" }} p="40px" mx="auto" borderRadius="15px" bg="gray.800">
            <Heading color={titleColor} fontSize="32px" mb="10px">Sign Up</Heading>
            <Text mb="20px" color={textColor} fontSize="sm">Create an account</Text>
            <FormControl>
              <FormLabel color={textColor}>Email</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" mb="15px" />
              <FormLabel color={textColor}>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" mb="15px" />
              <Button isLoading={loading} colorScheme="teal" onClick={handleSignUp} w="100%">Sign Up</Button>
            </FormControl>
            <AuthFooter />
          </Box>
        </GradientBorder>
      </Flex>
    </>
  );
}

export default SignUp;

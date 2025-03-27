import React, { FormEvent, useState } from "react";
import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  DarkMode,
  Text,
  useToast, // Import useToast
} from "@chakra-ui/react";
import GradientBorder from "components/GradientBorder/GradientBorder";

interface SignUpProps {}

function SignUp({}: SignUpProps) {
  const titleColor = "white";
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const toast = useToast(); // Initialize useToast

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/signup", { // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign-up failed");
      }

      toast({
        title: "Sign-up successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect user or clear form
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Sign-up error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Flex position="relative" overflow={{ lg: "hidden" }}>
      <FormControl as="form" onSubmit={handleSignUp}>
        <FormLabel color={titleColor} ms="4px" fontSize="sm" fontWeight="normal">
          Name
        </FormLabel>
        <GradientBorder mb="24px" h="50px" w={{ base: "100%", lg: "fit-content" }} borderRadius="20px">
          <Input
            color={titleColor}
            bg={{ base: "rgb(19,21,54)" }}
            border="transparent"
            borderRadius="20px"
            fontSize="sm"
            size="lg"
            w={{ base: "100%", md: "346px" }}
            maxW="100%"
            h="46px"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </GradientBorder>
        <FormLabel color={titleColor} ms="4px" fontSize="sm" fontWeight="normal">
          Email
        </FormLabel>
        <GradientBorder mb="24px" h="50px" w={{ base: "100%", lg: "fit-content" }} borderRadius="20px">
          <Input
            color={titleColor}
            bg={{ base: "rgb(19,21,54)" }}
            border="transparent"
            borderRadius="20px"
            fontSize="sm"
            size="lg"
            w={{ base: "100%", md: "346px" }}
            maxW="100%"
            h="46px"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </GradientBorder>
        <FormLabel color={titleColor} ms="4px" fontSize="sm" fontWeight="normal">
          Password
        </FormLabel>
        <GradientBorder mb="24px" h="50px" w={{ base: "100%", lg: "fit-content" }} borderRadius="20px">
          <Input
            color={titleColor}
            bg={{ base: "rgb(19,21,54)" }}
            border="transparent"
            borderRadius="20px"
            fontSize="sm"
            size="lg"
            w={{ base: "100%", md: "346px" }}
            maxW="100%"
            h="46px"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </GradientBorder>
        <FormControl display="flex" alignItems="center" mb="24px">
          <DarkMode>
            <Switch id="remember-login" colorScheme="brand" me="10px" />
          </DarkMode>
          <FormLabel color={titleColor} htmlFor="remember-login" mb="0" fontWeight="normal">
            Remember me
          </FormLabel>
        </FormControl>
        <Button
          variant="brand"
          fontSize="10px"
          type="submit"
          w="100%"
          maxW="350px"
          h="45"
          mb="20px"
          mt="20px"
          isLoading={loading} // Show loading state
        >
          SIGN UP
        </Button>
      </FormControl>
    </Flex>
  );
}

export default SignUp;
          

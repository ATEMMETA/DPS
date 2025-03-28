import React, { FormEvent, useState } from "react";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  DarkMode,
  useToast,
} from "@chakra-ui/react";
import GradientBorder from "components/GradientBorder/GradientBorder";
import AuthFooter from "components/Footer/AuthFooter";
import signInImage from "assets/img/signInImage.png";
import { useRouter } from "next/router";

interface SignInProps {}

interface SignInResponse {
  message: string;
  // Add other properties if your API returns more data
}

function SignIn({}: SignInProps) {
  const titleColor = "white";
  const textColor = "gray.400";
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Sign-in failed";

        if (response.status === 400) {
          errorMessage = "Bad request. Please check your credentials.";
        } else if (response.status === 401) {
          errorMessage = "Unauthorized. Invalid email or password.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        const errorData: SignInResponse = await response.json();
        throw new Error(errorData.message || errorMessage);
      }

      toast({
        title: "Sign-in successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/chatui/grok");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Sign-in error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your JSX
}

export default SignIn;

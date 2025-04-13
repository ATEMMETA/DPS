'use client';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import AdminNavbar from '@/components/navbar/NavbarAdmin';
import NavbarLinksAdmin from '@/components/navbar/NavbarLinksAdmin';
import routes from '@/routes';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const inputBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const sidebarBgColor = useColorModeValue('white', 'gray.800');
  const bgGradient = useColorModeValue(
    'linear(to-b, brand.500, brand.600)',
    'linear(to-b, #4A25E1, #7B5AFF)'
  );

  const handleSignIn = () => {
    const dummyEmail = 'test@example.com';
    const dummyPassword = 'password123';

    if (email === dummyEmail && password === dummyPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/chatui/grok');
    } else {
      setError('Invalid email or password—try test@example.com / password123');
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Box minH="100vh" bgGradient={bgGradient}>
        <AdminNavbar
          secondary={false}
          brandText="Sign In"
          logoText="DPS"
          setApiKey={() => {}}
          onOpen={toggleSidebar}
        />
        <Flex
          pt={{ base: '220px', md: '220px' }}
          direction="column"
          maxW="500px"
          mx="auto"
          px={4}
          minH="75vh"
          justify="center"
        >
          <Box
            p={8}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg={inputBg}
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              mb={6}
              textAlign="center"
              color={textColor}
            >
              Sign In
            </Text>
            <FormControl>
              <FormLabel color={textColor}>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                bg={inputBg}
                borderColor={borderColor}
                color={textColor}
                mb={4}
                _focus={{ borderColor: 'blue.500' }}
              />
              <FormLabel color={textColor}>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                bg={inputBg}
                borderColor={borderColor}
                color={textColor}
                mb={6}
                _focus={{ borderColor: 'blue.500' }}
              />
              {error && (
                <Text color="red.500" mb={4} fontSize="sm">
                  {error}
                </Text>
              )}
              <Button
                colorScheme="blue"
                w="full"
                onClick={handleSignIn}
                py={6}
              >
                Sign In
              </Button>
            </FormControl>
            <Text
              fontSize="sm"
              color={textColor}
              textAlign="center"
              mt={4}
            >
              Don’t have an account? Contact support.
            </Text>
          </Box>
        </Flex>
        {isOpen && (
          <Box
            position="fixed"
            top="0"
            left="0"
            h="100vh"
            w="250px"
            bg={sidebarBgColor}
            boxShadow="md"
            zIndex="10"
          >
            <NavbarLinksAdmin
              secondary={false}
              setApiKey={() => {}}
              onClose={toggleSidebar}
              routes={routes}
            />
          </Box>
        )}
      </Box>
    </>
  );
                }

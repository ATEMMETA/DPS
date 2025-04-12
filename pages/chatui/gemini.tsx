'use client';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import AdminNavbar from '@/components/navbar/NavbarAdmin';
import NavbarLinksAdmin from '@/components/navbar/NavbarLinksAdmin';
import routes from '@/routes';
import Head from 'next/head';

export default function GeminiHelper() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const inputBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Placeholder: Replace with Google Gemini SDK
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Gemini response: ${input} (stub)` },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Gemini Helper</title>
      </Head>
      <Box minH="100vh" bg={bgColor}>
        <AdminNavbar
          secondary={false}
          brandText="Gemini Helper"
          logoText="DPS"
          setApiKey={() => {}}
        />
        <Flex
          pt={{ base: '220px', md: '220px' }}
          direction="column"
          maxW="1000px"
          mx="auto"
          px={4}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4} color={textColor}>
            Gemini Helper
          </Text>
          <Box flex="1" mb={4}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                p={4}
                mb={2}
                borderRadius="md"
                bg={msg.role === 'user' ? inputBg : 'transparent'}
                border={msg.role === 'user' ? `1px solid ${borderColor}` : 'none'}
              >
                <Text color={textColor}>
                  <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
                </Text>
              </Box>
            ))}
            {loading && <Text color={textColor}>Loading...</Text>}
          </Box>
          <Flex>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini something..."
              bg={inputBg}
              borderColor={borderColor}
              color={textColor}
              mr={2}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button
              colorScheme="brand"
              onClick={handleSubmit}
              isLoading={loading}
              w={{ base: 'full', md: '200px' }}
            >
              Submit23
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Input, Button, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import Head from 'next/head';

export default function ChatUI() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const textColor = useColorModeValue('white', 'gray.200');
  const inputBg = useColorModeValue('gray.700', 'gray.800');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        prompt: input,
        maxTokens: 500,
      });
      setMessages((prev) => [...prev, { role: 'ai' as const, content: text }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai' as const, content: 'Oops, something went wrong. Try again?' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Head>
        <title>Chat with Grok</title>
      </Head>
      <Flex direction="column" minH="100vh" bg={bgColor} color={textColor} p={4}>
        <VStack flex={1} spacing={4} w="full" maxW="800px" mx="auto" overflowY="auto" py={4}>
          {messages.length === 0 ? (
            <Text fontSize="lg" opacity={0.7}>Start the conversation—ask me anything!</Text>
          ) : (
            messages.map((msg, index) => (
              <Box
                key={index}
                alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                bg={msg.role === 'user' ? 'teal.500' : 'gray.700'}
                p={3}
                borderRadius="md"
                maxW="70%"
                wordBreak="break-word"
              >
                <Text>{msg.content}</Text>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </VStack>
        <Flex w="full" maxW="800px" mx="auto" mt={4} align="center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            bg={inputBg}
            border="none"
            p={4}
            flex={1}
            fontSize="lg"
            _focus={{ boxShadow: 'outline' }}
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            colorScheme="teal"
            ml={2}
            px={6}
            isLoading={loading}
            loadingText="Sending"
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import Head from 'next/head';
import {
  Box,
  Button,
  Flex,
  Icon,
  Textarea,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdAutoAwesome, MdPerson, MdExpandMore, MdExpandLess } from 'react-icons/md';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey) throw new Error('NEXT_PUBLIC_OPENAI_API_KEY is not set');
const openai = createOpenAI({ apiKey });
const chatModel = openai('gpt-4o-mini'); // Grok placeholder

export default function GrokChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isInputExpanded, setIsInputExpanded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputColor = useColorModeValue('gray.700', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const aiBgColor = 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)';

  useEffect(() => {
    setMessages([{ role: 'ai', content: 'Hey there! I’m Grok, ready to chat.' }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputCode.trim()) return;

    const userMessage = { role: 'user', content: inputCode };
    setMessages((prev) => [...prev, userMessage]);
    setInputCode('');
    setLoading(true);

    try {
      const { text } = await generateText({
        model: chatModel,
        prompt: inputCode,
        maxTokens: 500,
      });
      setMessages((prev) => [...prev, { role: 'ai', content: text }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
      setMessages((prev) => [...prev, { role: 'ai', content: `Error: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputCode(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleInputSize = () => {
    setIsInputExpanded(!isInputExpanded);
  };

  return (
    <>
      <Head>
        <title>Grok Chat</title>
      </Head>
      <Flex
        direction="column"
        minH="100vh" // Full viewport height
        bg={bgColor}
        w="100%"
        mx="auto"
        maxW="1000px"
        p={4}
      >
        {/* Message Area */}
        <Box
          flex="1" // Grows to fill space
          h="80vh" // Fixed height, adjustable
          overflowY="auto"
          w="100%"
          bg={useColorModeValue('white', 'gray.700')}
          borderRadius="md"
          border="1px solid"
          borderColor={borderColor}
          p={4}
          mb={4}
        >
          {messages.map((msg, index) => (
            <Flex
              key={index}
              w="100%"
              mb={4}
              direction={msg.role === 'user' ? 'row-reverse' : 'row'}
            >
              <Flex
                align="center"
                justify="center"
                w="40px"
                h="40px"
                borderRadius="full"
                bg={msg.role === 'user' ? 'transparent' : aiBgColor}
                border={msg.role === 'user' ? '2px solid' : 'none'}
                borderColor={borderColor}
                mx={2}
              >
                <Icon
                  as={msg.role === 'user' ? MdPerson : MdAutoAwesome}
                  w={5}
                  h={5}
                  color={msg.role === 'user' ? inputColor : 'white'}
                />
              </Flex>
              <Box
                p={4}
                bg={msg.role === 'user' ? useColorModeValue('gray.100', 'gray.600') : 'transparent'}
                borderRadius="md"
                maxW="70%"
                border={msg.role === 'user' ? '1px solid' : 'none'}
                borderColor={borderColor}
              >
                <Text color={textColor} fontSize="md">
                  {msg.content}
                </Text>
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Flex
          direction="column"
          position="sticky"
          bottom={0}
          w="100%"
          bg={bgColor}
          p={2}
          borderTop="1px solid"
          borderColor={borderColor}
          maxH="300px"
          overflowY="auto"
        >
          <Box position="relative" mb={2}>
            <Textarea
              value={inputCode}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              minH={isInputExpanded ? '120px' : '60px'}
              maxH={isInputExpanded ? '200px' : '60px'}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              p="10px 40px 10px 15px"
              fontSize="sm"
              color={inputColor}
              _placeholder={{ color: placeholderColor }}
              _focus={{ borderColor: 'blue.500' }}
              resize="none"
              disabled={loading}
            />
            <Icon
              as={isInputExpanded ? MdExpandLess : MdExpandMore}
              position="absolute"
              right="10px"
              top="50%"
              transform="translateY(-50%)"
              w={5}
              h={5}
              color={gray}
              cursor="pointer"
              onClick={toggleInputSize}
            />
          </Box>
          <Button
            onClick={handleSubmit}
            isLoading={loading}
            colorScheme="blue"
            borderRadius="md"
            py={6}
            px={8}
            mx="auto"
            w={{ base: 'full', md: '200px' }}
          >
            Submit5
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

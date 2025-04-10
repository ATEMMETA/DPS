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
import { MdAutoAwesome, MdEdit, MdPerson, MdExpandMore, MdExpandLess } from 'react-icons/md';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey) throw new Error('NEXT_PUBLIC_OPENAI_API_KEY is not set');
const openai = createOpenAI({ apiKey });
const chatModel = openai('gpt-4o-mini'); // Grok’s stand-in for now

export default function GrokChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isInputExpanded, setIsInputExpanded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'white');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  useEffect(() => {
    const hasApiKey = !!process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    setMessages((prev) => [
      ...prev,
      { role: 'ai', content: `API Key Present: ${hasApiKey ? 'Yes' : 'No'}` },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTranslate = async () => {
    if (!inputCode.trim()) {
      alert('Please enter your message.');
      return;
    }

    const maxCodeLength = 700;
    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    const userMessage = { role: 'user' as const, content: inputCode };
    setMessages((prev) => [...prev, userMessage]);
    setInputCode('');
    setLoading(true);

    try {
      const { text } = await generateText({
        model: chatModel as any,
        prompt: inputCode,
        maxTokens: 500,
      });
      setMessages((prev) => [...prev, { role: 'ai' as const, content: text }]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        { role: 'ai' as const, content: `Error: ${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: any) => {
    setInputCode(event.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
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
        w="100%"
        h="100vh" // Full viewport height
        direction="column"
        position="relative"
        mx="auto"
        maxW="1000px"
      >
        {/* Messages Area */}
        <Box
          flex="1" // Takes available space
          h={{ base: '80vh', md: '85vh' }} // Fixed height, scrolls within
          overflowY="auto"
          w="100%"
          display={messages.length ? 'block' : 'none'}
          mb="20px"
        >
          {messages.map((msg, index) => (
            <Flex key={index} w="100%" align="center" mb="10px">
              <Flex
                borderRadius="full"
                justify="center"
                align="center"
                bg={
                  msg.role === 'user'
                    ? 'transparent'
                    : 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'
                }
                border={msg.role === 'user' ? '1px solid' : 'none'}
                borderColor={borderColor}
                me="20px"
                h="40px"
                minH="40px"
                minW="40px"
              >
                <Icon
                  as={msg.role === 'user' ? MdPerson : MdAutoAwesome}
                  width="20px"
                  height="20px"
                  color={msg.role === 'user' ? brandColor : 'white'}
                />
              </Flex>
              <Flex
                p="22px"
                border="1px solid"
                borderColor={borderColor}
                borderRadius="14px"
                w="100%"
                zIndex="2"
              >
                <Text
                  color={textColor}
                  fontWeight="600"
                  fontSize={{ base: 'sm', md: 'md' }}
                  lineHeight={{ base: '24px', md: '26px' }}
                >
                  {msg.content}
                </Text>
                {msg.role === 'user' && (
                  <Icon
                    cursor="pointer"
                    as={MdEdit}
                    ms="auto"
                    width="20px"
                    height="20px"
                    color={gray}
                  />
                )}
              </Flex>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Chat Input with Scroll Effect */}
        <Flex
          direction="column"
          w="100%"
          position="sticky"
          bottom={0}
          bg={useColorModeValue('white', 'navy.800')}
          py={2}
          maxH="300px"
          overflowY="auto"
        >
          <Box position="relative" mb="10px">
            <Textarea
              minH={isInputExpanded ? '100px' : '54px'}
              maxH={isInputExpanded ? '200px' : '54px'}
              h="100%"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="15px"
              p="15px 40px 15px 20px"
              fontSize="sm"
              fontWeight="500"
              _focus={{ borderColor: 'none' }}
              color={inputColor}
              _placeholder={placeholderColor}
              placeholder="Type your message here..."
              value={inputCode}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              disabled={loading}
              resize="none"
              overflowY="auto"
            />
            <Icon
              as={isInputExpanded ? MdExpandLess : MdExpandMore}
              position="absolute"
              right="10px"
              top="50%"
              transform="translateY(-50%)"
              color={gray}
              w="20px"
              h="20px"
              cursor="pointer"
              onClick={toggleInputSize}
            />
          </Box>
          <Flex justify="center">
            <Button
              variant="primary"
              py="20px"
              px="16px"
              fontSize="sm"
              borderRadius="45px"
              w={{ base: '160px', md: '210px' }}
              h="54px"
              _hover={{
                boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              }}
              onClick={handleTranslate}
              isLoading={loading}
            >
              Submit4
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
    }

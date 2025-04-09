'use client';
import { useState, useRef, useEffect } from 'react';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import Head from 'next/head';
import Link from '@/components/link/Link';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey) throw new Error('NEXT_PUBLIC_OPENAI_API_KEY is not set');
const openai = createOpenAI({ apiKey });
const chatModel = openai('gpt-4o-mini');

export default function Chat(props: { apiKeyApp: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
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

    const maxCodeLength = model === 'gpt-4o' ? 700 : 700;
    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    const userMessage = { role: 'user' as const, content: inputCode };
    setMessages((prev) => [...prev, userMessage]);
    setInputOnSubmit(inputCode);
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

  return (
    <>
      <Head>
        <title>Chat with Grok</title>
      </Head>
      <Flex
        w="100%"
        pt={{ base: '70px', md: '0px' }}
        direction="column"
        position="relative"
        minH="100vh"
      >
        <Flex
          direction="column"
          mx="auto"
          w={{ base: '100%', md: '100%', xl: '100%' }}
          maxW="1000px"
          flex={1}
        >
          {/* Model Selection */}
          <Flex direction="column" w="100%" mb={messages.length ? '20px' : 'auto'}>
            <Flex
              mx="auto"
              zIndex="2"
              w="max-content"
              mb="20px"
              borderRadius="60px"
            >
              <Flex
                cursor="pointer"
                transition="0.3s"
                justify="center"
                align="center"
                bg={model === 'gpt-4o' ? buttonBg : 'transparent'}
                w="174px"
                h="70px"
                boxShadow={model === 'gpt-4o' ? buttonShadow : 'none'}
                borderRadius="14px"
                color={textColor}
                fontSize="18px"
                fontWeight="700"
                onClick={() => setModel('gpt-4o')}
              >
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg={bgIcon}
                  me="10px"
                  h="39px"
                  w="39px"
                >
                  <Icon as={MdAutoAwesome} width="20px" height="20px" color={iconColor} />
                </Flex>
                GPT-4o
              </Flex>
              <Flex
                cursor="pointer"
                transition="0.3s"
                justify="center"
                align="center"
                bg={model === 'gpt-3.5-turbo' ? buttonBg : 'transparent'}
                w="164px"
                h="70px"
                boxShadow={model === 'gpt-3.5-turbo' ? buttonShadow : 'none'}
                borderRadius="14px"
                color={textColor}
                fontSize="18px"
                fontWeight="700"
                onClick={() => setModel('gpt-3.5-turbo')}
              >
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg={bgIcon}
                  me="10px"
                  h="39px"
                  w="39px"
                >
                  <Icon as={MdBolt} width="20px" height="20px" color={iconColor} />
                </Flex>
                GPT-3.5
              </Flex>
            </Flex>

            <Accordion color={gray} allowToggle w="100%" my="0px" mx="auto">
              <AccordionItem border="none">
                <AccordionButton
                  borderBottom="0px solid"
                  maxW="max-content"
                  mx="auto"
                  _hover={{ border: '0px solid', bg: 'none' }}
                  _focus={{ border: '0px solid', bg: 'none' }}
                >
                  <Box flex="1" textAlign="left">
                    <Text color={gray} fontWeight="500" fontSize="sm">
                      No plugins added
                    </Text>
                  </Box>
                  <AccordionIcon color={gray} />
                </AccordionButton>
                <AccordionPanel mx="auto" w="max-content" p="0px 0px 10px 0px">
                  <Text color={gray} fontWeight="500" fontSize="sm" textAlign="center">
                    This is a cool text example.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>

          {/* Dedicated Messages Area */}
          <Box
            w="100%"
            minH={{ base: '100vh', '2xl': '120vh' }}
            overflowY="auto"
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

          {/* Chat Input */}
          <Flex ms={{ base: '0px', xl: '60px' }} mt="20px" justifySelf="flex-end">
            <Input
              minH="54px"
              h="100%"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="45px"
              p="15px 20px"
              me="10px"
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
            />
            <Button
              variant="primary"
              py="20px"
              px="16px"
              fontSize="sm"
              borderRadius="45px"
              ms="auto"
              w={{ base: '160px', md: '210px' }}
              h="54px"
              _hover={{
                boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
                _disabled: {
                  bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
                },
              }}
              onClick={handleTranslate}
              isLoading={loading}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
      }

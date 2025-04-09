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
  Textarea,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson, MdExpandMore, MdExpandLess } from 'react-icons/md';
import AdminNavbar from '@/components/navbar/NavbarAdmin';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey) throw new Error('NEXT_PUBLIC_OPENAI_API_KEY is not set');
const openai = createOpenAI({ apiKey });
const chatModel = openai('gpt-4o-mini');

export default function Chat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKeyApp, setApiKeyApp] = useState<string>('');
  const [isInputExpanded, setIsInputExpanded] = useState<boolean>(false);
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

  const handleDownload = () => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-log.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleInputSize = () => {
    setIsInputExpanded(!isInputExpanded);
  };

  return (
    <>
      <Head>
        <title>Chat with Grok</title>
      </Head>
      <Box minH="100vh" display="flex" flexDirection="column">
        <AdminNavbar
          secondary={false}
          brandText="Chat with Grok"
          logoText="DPS"
          onOpen={() => {}}
          setApiKey={setApiKeyApp}
        />

        <Flex
          flex={1}
          w="100%"
          pt={{ base: '90px', md: '90px' }}
          direction="column"
          position="relative"
          minH={{ base: '150vh', '2xl': '170vh' }} // Double the height
        >
          <Flex
            direction="column"
            mx="auto"
            w={{ base: '100%', md: '100%', xl: '100%' }}
            maxW="1000px"
            h="100%" // Fill the parent
          >
            {/* Model Selection - Up Top */}
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
                    _focus={{ border: '0px solid', bg descriptivenone' }}
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

            {/* Messages Display - Tall and Scrollable */}
            <Flex
              direction="column"
              w="100%"
              mx="auto"
              flex={1}
              overflowY="auto"
              display={messages.length ? 'flex' : 'none'}
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
                    minW={{ base: '300px', md: '400px' }}
                    minH="60px"
                    zIndex="2"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
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
            </Flex>

            {/* Chat Input with Buttons - Scrollable Bottom */}
            <Flex
              direction="column"
              ms={{ base: '0px', xl: '60px' }}
              mt="20px"
              position="sticky"
              bottom={0}
              bg={useColorModeValue('white', 'navy.800')}
              py={2}
              maxH="300px" // Cap height for scroll effect
              overflowY="auto" // Cool scroll is back!
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
              <Flex justify="center" gap={4}>
                <Button
                  variant="primary"
                  bg="blue.200"
                  color="white"
                  py="20px"
                  px="16px"
                  fontSize="sm"
                  borderRadius="45px"
                  w={{ base: '160px', md: '210px' }}
                  h="54px"
                  _hover={{
                    boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
                    bg: 'blue.300',
                  }}
                  onClick={handleTranslate}
                  isLoading={loading}
                >
                  Submit
                </Button>
                <Button
                  onClick={handleDownload}
                  colorScheme="blue"
                  py="20px"
                  px="16px"
                  fontSize="sm"
                  borderRadius="45px"
                  w={{ base: '160px', md: '210px' }}
                  h="54px"
                >
                  Download Chat
                </Button>
              </Flex>
            </Flex>

            <Flex
              justify="center"
              mt="20px"
              direction={{ base: 'column', md: 'row' }}
              alignItems="center"
            >
              <Text fontSize="xs" textAlign="center" color={gray}>
                Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.
              </Text>
              <Link href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
                <Text fontSize="xs" color={textColor} fontWeight="500" textDecoration="underline">
                  ChatGPT May 12 Version
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

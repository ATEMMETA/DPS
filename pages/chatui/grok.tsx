// pages/chatui/grok.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, Button, Flex, Icon, Textarea, Text, useColorModeValue } from '@chakra-ui/react';
import { MdAutoAwesome, MdPerson, MdExpandMore, MdExpandLess } from 'react-icons/md';
import AdminNavbar from '@/components/navbar/NavbarAdmin';
import NavbarLinksAdmin from '@/components/navbar/NavbarLinksAdmin';
import routes from '@/routes';

export default function GrokChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isInputExpanded, setIsInputExpanded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputColor = useColorModeValue('gray.700', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const aiBgColor = 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)';
  const userMsgBgColor = useColorModeValue('gray.100', 'gray.600');
  const msgAreaBgColor = useColorModeValue('white', 'gray.700');
  const sidebarBgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    setMessages([{ role: 'ai' as const, content: 'Hey there! I’m Grok, ready to chat.' }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputCode.trim()) return;

    const userMessage = { role: 'user' as const, content: inputCode };
    setMessages((prev) => [...prev, userMessage]);
    setInputCode('');
    setLoading(true);

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-3',
          messages: [{ role: 'user', content: inputCode }],
          max_tokens: 500,
        }),
      });
      const data = await response.json();
      const reply = data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: 'ai' as const, content: reply }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
      setMessages((prev) => [...prev, { role: 'ai' as const, content: `Error: ${errorMessage}` }]);
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={bgColor}>
      <AdminNavbar
        secondary={false}
        brandText="Grok Chat"
        logoText="DPS"
        onOpen={toggleSidebar}
        setApiKey={() => {}}
      />
      <Flex
        flex={1}
        w="100%"
        pt={{ base: '220px', md: '220px' }}
        direction="column"
        position="relative"
        maxW="1000px"
        mx="auto"
        px={4}
      >
        <Box
          flex="1"
          h="80vh"
          overflowY="auto"
          w="100%"
          bg={msgAreaBgColor}
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
                bg={msg.role === 'user' ? userMsgBgColor : 'transparent'}
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
              color={placeholderColor}
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
            Submit
          </Button>
        </Flex>
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
  );
}

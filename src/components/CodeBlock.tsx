'use client';
import dynamic from 'next/dynamic';
import { Box, Button, Flex, Icon, Img, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import Bg from '../../public/img/chat/bg-image.png';
import Head from 'next/head';

const CodeBlock = dynamic(() => import('@/components/CodeBlock'), { ssr: false });

export default function GeminiHelper() {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const gray = useColorModeValue('gray.500', 'gray.400');

  const handleGenerate = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      alert('Gemini API key missing!');
      setLoading(false);
      return;
    }
    if (!inputCode) {
      alert('Please enter your code.');
      return;
    }
    setOutputCode(' ');
    setLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey as string,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Analyze this code: ${inputCode}` }] }],
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with Gemini.');
      }

      const data = await response.json();
      setOutputCode(data.candidates[0].content.parts[0].text);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Gemini AI Helper</title>
      </Head>
      <Flex w="100%" pt={{ base: '70px', md: '0px' }} direction="column" position="relative">
        <Img src={Bg.src} position="absolute" w="100%" h="100%" opacity="0.1" />
        <Flex
          direction="column"
          mx="auto"
          w={{ base: '100%', md: '100%', xl: '100%' }}
          minH={{ base: '75vh', '2xl': '85vh' }}
          maxW="1000px"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color={textColor}>
            Gemini AI Helper
          </Text>
          <CodeBlock
            code={inputCode || '// Drag or type code here'}
            height="400"
            editable={true}
            onChange={(value) => setInputCode(value)}
          />
          {loading && <Text mt={2} color={gray}>Loading...</Text>}
          {outputCode && (
            <Box mt={4} p="22px" border="1px solid" borderColor={borderColor} borderRadius="14px">
              <Flex align="center" mb="10px">
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg="linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
                  me="20px"
                  h="40px"
                  minH="40px"
                  minW="40px"
                >
                  <Icon as={MdAutoAwesome} width="20px" height="20px" color="white" />
                </Flex>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Gemini Response:
                </Text>
              </Flex>
              <Text color={textColor}>{outputCode}</Text>
            </Box>
          )}
          <Button
            mt={4}
            onClick={handleGenerate}
            isLoading={loading}
            colorScheme="teal"
          >
            Ask Gemini AI
          </Button>
          <Text fontSize="xs" textAlign="center" color={gray} mt="20px">
            Powered by Google’s Gemini. Results may vary.
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

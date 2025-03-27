'use client';
/*eslint-disable*/

import { CodeBlock } from '@/components/CodeBlock';
import { Box, Button, Flex, Icon, Img, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import Bg from '../../public/img/chat/bg-image.png';
import Head from 'next/head';

export default function GeminiHelper() {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // ... (Chakra UI styles)

  const handleGenerate = async () => {
    const apiKey = process.env.GEMINI_API_KEY; // Use environment variable
    if (!inputCode) {
      alert('Please enter your code.');
      return;
    }
    setOutputCode(' ');
    setLoading(true);

    try {
      const response = await fetch('YOUR_GEMINI_API_ENDPOINT', { // Replace with gemini api endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey, // Replace with correct header
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Analyze this code: ${inputCode}` }] }], // Replace with correct payload
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with Gemini.');
      }

      const data = await response.json();
      setOutputCode(data.candidates[0].content.parts[0].text); // Adjust to gemini response
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <>
      <Head>
        {/* ... (Ads) */}
      </Head>
      <Flex w="100%" pt={{ base: '70px', md: '0px' }} direction="column" position="relative">
        {/* ... (Background image) */}
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
          {/* ... (Ads) */}
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
            // ... (Button styles)
            onClick={handleGenerate}
            isLoading={loading}
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

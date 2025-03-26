'use client';
/*eslint-disable*/

import { CodeBlock } from '@/components/CodeBlock';
import { Box, Button, Flex, Icon, Img, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import Bg from '../../public/img/chat/bg-image.png';
import Head from 'next/head';

export default function GrokHelper() {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');

  const handleGenerate = async () => {
    const apiKey = 'YOUR_GROK_API_KEY'; // Replace with your key
    if (!inputCode) {
      alert('Please enter your code.');
      return;
    }
    setOutputCode(' ');
    setLoading(true);

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{ role: 'user', content: `Analyze this code for dependencies: ${inputCode}` }],
      }),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong with Grok.');
      return;
    }

    const data = await response.json();
    setOutputCode(data.choices[0].message.content);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <Flex w="100%" pt={{ base: '70px', md: '0px' }} direction="column" position="relative">
        <Img
          src={Bg.src}
          position="absolute"
          w="350px"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        />
        <Flex
          direction="column"
          mx="auto"
          w={{ base: '100%', md: '100%', xl: '100%' }}
          minH={{ base: '75vh', '2xl': '85vh' }}
          maxW="1000px"
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color={textColor}>
            Grok Helper - Dependency Checker
          </Text>
          <Box mb={4}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="YYYYYYYYYY"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </Box>
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
                  Dependencies:
                </Text>
              </Flex>
              <Text color={textColor}>{outputCode}</Text>
            </Box>
          )}
          <Button
            mt={4}
            bg={buttonBg}
            shadow={buttonShadow}
            color={brandColor}
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
            onClick={handleGenerate}
            isLoading={loading}
          >
            Ask Grok & Generate Dependencies
          </Button>
          <Text fontSize="xs" textAlign="center" color={gray} mt="20px">
            Powered by xAI’s Grok. Results may vary.
          </Text>
        </Flex>
      </Flex>
    </>
  );
  }

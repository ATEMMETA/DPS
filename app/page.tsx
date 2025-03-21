'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import { CodeBlock } from '@/components/CodeBlock';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Head from 'next/head'; // For AdSense script

export default function Chat() {
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const [loading, setLoading] = useState<boolean>(false);

  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );

  const handleTranslate = async () => {
    let apiKey = localStorage.getItem('apiKey');
    setInputOnSubmit(inputCode);
    const maxCodeLength = model === 'gpt-4o' ? 700 : 700;

    if (!apiKey?.includes('sk-')) {
      alert('Please enter an API key.');
      return;
    }
    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }
    if (inputCode.length > maxCodeLength) {
      alert(`Please enter code less than ${maxCodeLength} characters.`);
      return;
    }
    setOutputCode(' ');
    setLoading(true);
    const controller = new AbortController();
    const body: ChatBody = { inputCode, model, apiKey };

    const response = await fetch('./api/chatAPI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong. Check your API key.');
      return;
    }

    const data = response.body;
    if (!data) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setOutputCode((prevCode) => prevCode + chunkValue);
    }
    setLoading(false);
  };

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  return (
    <>
      <Head>
        {/* AdSense Head Script - Replace with your actual code */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
                crossOrigin="anonymous"></script>
      </Head>
      <Flex
        w="100%"
        pt={{ base: '70px', md: '0px' }}
        direction="column"
        position="relative"
      >
        <Box p={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            DPS - Dependency Helper
          </Text>
          {/* AdSense Banner - Replace with your ad unit code */}
          <Box mb={4}>
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="YYYYYYYYYY"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </Box>
          <CodeBlock
            code={inputCode || '// Drag or type code here'}
            height="400"
            editable={true}
            onChange={(value) => setInputCode(value)}
          />
          {loading && <Text mt={2}>Loading...</Text>}
          {outputCode && (
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="bold">
                Response:
              </Text>
              <Text>{outputCode}</Text>
            </Box>
          )}
          <Button
            mt={4}
            bg={buttonBg}
            shadow={buttonShadow}
            color={brandColor}
            onClick={handleTranslate}
            isLoading={loading}
          >
            Generate Dependencies
          </Button>
        </Box>
      </Flex>
    </>
  );
}

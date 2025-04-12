'use client';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import AdminNavbar from '@/components/navbar/NavbarAdmin';
import NavbarLinksAdmin from '@/components/navbar/NavbarLinksAdmin';
import routes from '@/routes';
import Head from 'next/head';

export default function Home() {
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [outputText, setOutputText] = useState<string>('');
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
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setInputFiles(files);
  };

  const handleGenerate = async () => {
    if (!inputFiles.length) {
      alert('Please drop some files.');
      return;
    }
    setOutputText('');
    setLoading(true);

    // Placeholder: Simulate file processing (replace with real API)
    setTimeout(() => {
      setOutputText(
        `Analyzed ${inputFiles.length} file(s):\n- Dependencies: None found (stub).\n- Files: ${inputFiles.map(f => f.name).join(', ')}`,
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>DPS - Drag & Drop</title>
      </Head>
      <Box minH="100vh" bg={bgColor}>
        <AdminNavbar
          secondary={false}
          brandText="DPS - Drag & Drop"
          logoText="DPS"
          setApiKey={() => {}}
        />
        <Flex
          pt={{ base: '220px', md: '220px' }}
          direction="column"
          maxW="1000px"
          mx="auto"
          px={4}
          minH="75vh"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mb={4}
            textAlign="center"
            color={textColor}
          >
            DPS - Drag & Drop
          </Text>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            mb={4}
          >
            {/* Drag-and-Drop Area */}
            <Box
              flex="1"
              border="2px dashed"
              borderColor={borderColor}
              borderRadius="14px"
              p={8}
              textAlign="center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              minH="300px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="lg" color={textColor}>
                {inputFiles.length
                  ? `Files: ${inputFiles.map(f => f.name).join(', ')}`
                  : 'Drag and drop files here'}
              </Text>
            </Box>
            {/* Output Area */}
            <Box
              flex="1"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              p={6}
              minH="300px"
            >
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
              <Text color={textColor}>
                {outputText || 'No output yet.'}
              </Text>
              {loading && <Text mt={2} color={gray}>Loading...</Text>}
            </Box>
          </Flex>
          <Button
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
            mx="auto"
          >
            Analyze Dependencies
          </Button>
          <Text fontSize="xs" textAlign="center" color={gray} mt="20px">
            Powered by DPS.
          </Text>
        </Flex>
      </Box>
    </>
  );
            }

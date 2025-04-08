'use client';
import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Input, Button, Text, VStack, use ColorModeValue } from '@chakra-ui/react';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import Head from 'next/head';

const chatModel = openai('gpt-4o-mini');

export default function ChatUI() {
 const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
 const [input, setInput] = useState('');
 const [loading, setLoading] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const bgColor = useColorModeValue('gray.800', 'gray.900');
 const textColor = useColorModeValue('white', 'gray.200');
 const inputBg = useColorModeValue('gray.700', 'gray.800');

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages]);

 const handleSend = async () => {
 if (!input.trim()) return;

 const userMessage = { role: 'user' as const, content: input };
 setMessages((prev) => [...prev, userMessage]);
 setInput('');
 setLoading(true);

 try {
 console.log('Sending request to OpenAI with prompt:', input);
 const { text } = await generateText({
 model: chatModel as any,
 prompt: input,
 maxTokens: 500,
 });
 console.log('Received response:', text);
 setMessages((prev) => [...prev, { role: 'ai' as const, content: text }]);
 } catch (error: unknown) { // Use unknown as required
 console.error('Error calling OpenAI:', error);
 // Safely handle the error as an Error object
 const errorMessage = error instanceof Error ? error.message : 'Unknown error';
 setMessages((prev) => [
 ...prev,
 { role: 'ai' as const, content: `Error: ${errorMessage}` },
 ]);
 } finally {
 setLoading(false);
 }
 };

 const handleKeyPress = (e: React.KeyboardEvent) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleSend();
 }
 };

 return (
 <>
 <Head>
 <title>Chat with Grok</title>
 </Head>
 <Flex direction="column" minH="100vh" bg={bgColor} color={textColor} 

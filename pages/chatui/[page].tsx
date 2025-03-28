'use client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Input, Button, VStack, Text, Heading } from '@chakra-ui/react';

type Message = { role: string; content: string }; // Define your message

export default function ChatUIPage() {
  const router = useRouter();
  const { page } = router.query;
  const [messages, setMessages] = useState<Message[]>([]); // Type it!
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input || !page) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]); // TS happy now
    setInput('');

    const res = await fetch(`/api/chat/${page}`, {
      method: 'POST',
      body: JSON.stringify({ message: input }),
      headers: { 'Content-Type': 'application/json' },
    });
    const { reply } = await res.json();
    setMessages(prev => [...prev, { role: 'ai', content: reply }]);
  };

  if (!page) return <Box>Loading...</Box>;

  return (
    <VStack spacing={4} align="stretch" p={4} h="100vh">
      <Heading>{page.toUpperCase()} Chat</Heading>
      <Box
        flex="1"
        overflowY="auto"
        border="1px solid gray"
        p={4}
        borderRadius="md"
        minH="400px" // Big chat area
        bg="gray.50"
      >
        {messages.length ? (
          messages.map((msg, idx) => (
            <Text key={idx} color={msg.role === 'user' ? 'blue.500' : 'green.500'}>
              {msg.role === 'user' ? 'You: ' : `${page}: `}{msg.content}
            </Text>
          ))
        ) : (
          <Text>Start chatting!</Text>
        )}
      </Box>
      <Box display="flex" gap={2}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} colorScheme="teal">
          Send
        </Button>
      </Box>
    </VStack>
  );
}

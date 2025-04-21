import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';

const Config = () => {
  const [flaskUrl, setFlaskUrl] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    const storedUrl = localStorage.getItem('flaskUrl');
    if (storedUrl) {
      setFlaskUrl(storedUrl);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (flaskUrl) {
      localStorage.setItem('flaskUrl', flaskUrl);
      toast({
        title: 'Configuration Saved',
        description: `Flask URL set to ${flaskUrl}`,
        status: 'success',
        duration: 3000,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a valid Flask URL',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={8} maxW="500px" mx="auto">
      <Text fontSize="2xl" mb={4}>
        Configure Flask Backend
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Flask API URL</FormLabel>
            <Input
              value={flaskUrl}
              onChange={(e) => setFlaskUrl(e.target.value)}
              placeholder="https://your-ngrok-url.ngrok-free.app"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Save Configuration
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Config;

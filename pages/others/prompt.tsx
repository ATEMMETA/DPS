// pages/others/prompt.tsx
import { useState } from 'react';
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
import { useRouter } from 'next/router';

const CameraConnection = () => {
  const [ip, setIp] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const flaskBackendUrl = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : 'http://localhost:5000/api/connect_camera';
  
  const isValidIp = (ip: string) => {
    // Regex ensures each segment is 0-255 and follows IP format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidIp(ip)) {
      toast({
        title: 'Invalid IP Address',
        description: 'Please enter a valid IP address (e.g., 192.168.100.47).',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(flaskBackendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Backend expects snake_case field names
        body: JSON.stringify({ ip, username, password, wifi_ssid: wifiSsid, wifi_password: wifiPassword }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: { success: boolean; rtsp_url?: string; error?: string } = await response.json();
      if (result.success && result.rtsp_url) {
        toast({ title: 'Camera Connected', status: 'success', duration: 5000 });
        router.push(`/others/register?rtsp=${encodeURIComponent(result.rtsp_url)}`);
      } else {
        toast({
          title: 'Connection Failed',
          description: result.error || 'Unknown error',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Fetch error:', errorMessage);
      toast({ title: 'Error', description: errorMessage, status: 'error', duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxW="500px" mx="auto">
      <Text fontSize="2xl" mb={4}>
        Connect Your Camera
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Camera IP</FormLabel>
            <Input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.168.100.47"
              aria-label="Camera IP Address"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              aria-label="Camera Username"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="12345"
              aria-label="Camera Password"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Wi-Fi SSID</FormLabel>
            <Input
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="Your Wi-Fi Name"
              aria-label="Wi-Fi SSID"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Wi-Fi Password</FormLabel>
            <Input
              type="password"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="Wi-Fi Password"
              aria-label="Wi-Fi Password"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Connect Camera
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CameraConnection;

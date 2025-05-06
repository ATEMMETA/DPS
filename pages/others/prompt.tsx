// pages/others/prompt.tsx
import { useState, useCallback } from 'react';
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
import debounce from 'lodash/debounce';

const CameraConnection = () => {
  const [ip, setIp] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const flaskBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/connect_camera';

  // Debounced IP input handler (300ms delay)
  const debouncedSetIp = useCallback(
    debounce((value: string) => {
      setIp(value);
    }, 300),
    []
  );

  const isValidIp = (ip: string) => {
    // Regex ensures each segment is 0-255 and follows IP format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate IP address
    if (!isValidIp(ip)) {
      toast({
        title: 'Invalid IP Address',
        description: 'Please enter a valid IP address (e.g., 192.168.100.47).',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    // Validate Wi-Fi credentials: if one is provided, both must be
    if (wifiSsid && !wifiPassword) {
      toast({
        title: 'Missing Wi-Fi Password',
        description: 'Please provide a Wi-Fi password if an SSID is specified.',
        status: 'error',
        duration: 5000,
      });
      return;
    }
    if (wifiPassword && !wifiSsid) {
      toast({
        title: 'Missing Wi-Fi SSID',
        description: 'Please provide a Wi-Fi SSID if a password is specified.',
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

  // Reset form fields
  const handleReset = () => {
    setIp('');
    setUsername('');
    setPassword('');
    setWifiSsid('');
    setWifiPassword('');
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
              onChange={(e) => debouncedSetIp(e.target.value)}
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
          <VStack spacing={2} w="100%">
            <Button type="submit" colorScheme="blue" isLoading={isLoading} w="100%">
              Connect Camera
            </Button>
            <Button type="button" colorScheme="gray" onClick={handleReset} w="100%">
              Reset
            </Button>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
};

export default CameraConnection;

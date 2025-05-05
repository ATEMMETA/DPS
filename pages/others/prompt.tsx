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
  const [ip, setIp] = useState<string>('192.168.100.47');
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('12345');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const toast = useToast();
  const router = useRouter();

  // Updated constant for the Flask backend URL
  const flaskBackendUrl = 'https://v0-new-project-pynnff3lkmc.vercel.app/api/connect_camera';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('Submitting to:', flaskBackendUrl);
      const response = await fetch(flaskBackendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, username, password, wifi_ssid: wifiSsid, wifi_password: wifiPassword }),
      });
      const result: { success: boolean; rtsp_url?: string; error?: string } = await response.json();
      console.log('Response:', result);
      if (result.success && result.rtsp_url) {
        toast({ title: 'Camera Connected', status: 'success', duration: 3000 });
        router.push(`/others/register?rtsp=${encodeURIComponent(result.rtsp_url)}`);
      } else {
        toast({
          title: 'Connection Failed',
          description: result.error || 'Unknown error',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Fetch error:', errorMessage);
      toast({ title: 'Error', description: errorMessage, status: 'error', duration: 3000 });
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
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="12345"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Wi-Fi SSID</FormLabel>
            <Input
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="Your Wi-Fi Name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Wi-Fi Password</FormLabel>
            <Input
              type="password"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="Wi-Fi Password"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Connect Camera
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CameraConnection;

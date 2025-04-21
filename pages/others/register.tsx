// pages/others/register.tsx
import { useRouter } from 'next/router';
import { Box, Text, Image } from '@chakra-ui/react';

const VideoStream = () => {
  const router = useRouter();
  const { rtsp } = router.query;

  const rtspUrl = typeof rtsp === 'string' ? rtsp : '';

  return (
    <Box p={8} maxW="800px" mx="auto">
      <Text fontSize="2xl" mb={4}>
        Camera Video Stream
      </Text>
      {rtspUrl ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_FLASK_URL}/video_feed?rtsp=${encodeURIComponent(rtspUrl)}`}
          alt="Camera Feed"
          width="100%"
          fallbackSrc="/placeholder.jpg"
        />
      ) : (
        <Text color="red.500">No camera connected. Please connect a camera first.</Text>
      )}
    </Box>
  );
};

export default VideoStream;

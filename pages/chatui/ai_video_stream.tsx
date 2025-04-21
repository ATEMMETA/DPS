// pages/others/sign-in.tsx
import { useState, useEffect } from 'react';
import { Box, Text, Image, VStack, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface CustomerInsight {
  name: string;
  status?: string;
  lastVisit?: string;
  preferences?: string;
}

const AIVideoStream = () => {
  const router = useRouter();
  const { rtsp } = router.query;
  const [faceData, setFaceData] = useState<string[]>([]);
  const [insights, setInsights] = useState<CustomerInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFaceData = async () => {
      setLoading(true);
      try {
        // Placeholder: /detect_face requires an image frame
        // For now, fetch insights based on connected camera
        const response = await fetch('https://your-flask-ngrok-url/customer_insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ face_names: faceData }),
        });
        const data: { success: boolean; insights: CustomerInsight[]; error?: string } =
          await response.json();
        if (data.success) {
          setInsights(data.insights);
        } else {
          console.error('Failed to fetch insights:', data.error);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error fetching face data:', errorMessage);
      }
      setLoading(false);
    };

    // Poll every 5 seconds
    const interval = setInterval(fetchFaceData, 5000);
    return () => clearInterval(interval);
  }, [faceData]);

  // Ensure rtsp is a string
  const rtspUrl = typeof rtsp === 'string' ? rtsp : '';

  return (
    <Box p={8} maxW="800px" mx="auto">
      <Text fontSize="2xl" mb={4}>
        AI Video Stream
      </Text>
      {rtspUrl ? (
        <Image
          src={`https://your-flask-ngrok-url/video_feed?rtsp=${encodeURIComponent(rtspUrl)}`}
          alt="Camera Feed"
          width="100%"
          fallbackSrc="/placeholder.jpg"
        />
      ) : (
        <Text color="red.500">No camera connected. Please connect a camera first.</Text>
      )}
      <VStack mt={4} align="start">
        <Text fontSize="lg">Detected Faces:</Text>
        {loading ? (
          <Spinner />
        ) : (
          faceData.length > 0 ? (
            faceData.map((name, index) => (
              <Text key={index}>
                {name === 'Unknown' ? 'Unknown Visitor' : `Customer: ${name}`}
              </Text>
            ))
          ) : (
            <Text>No faces detected yet.</Text>
          )
        )}
        <Text fontSize="lg" mt={4}>
          Customer Insights:
        </Text>
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <Text key={index}>
              {insight.name}: {insight.status || (insight.lastVisit ? `Last Visit: ${insight.lastVisit}` : 'New Visitor')}
              {insight.preferences ? `, Preferences: ${insight.preferences}` : ''}
            </Text>
          ))
        ) : (
          <Text>No insights available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default AIVideoStream;

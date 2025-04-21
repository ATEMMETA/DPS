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
    const fetchAnalytics = async () => {
      if (!rtsp || typeof rtsp !== 'string') return;
      setLoading(true);
      try {
        // Fetch face detection data for the connected camera
        const response = await fetch('https://your-flask-ngrok-url/detect_face', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rtsp_url: rtsp }),
        });
        const data: { success: boolean; names: string[]; locations: number[][]; error?: string } =
          await response.json();
        if (data.success) {
          setFaceData(data.names);

          // Fetch customer insights
          const insightsResponse = await fetch('https://your-flask-ngrok-url/customer_insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ face_names: data.names }),
          });
          const insightsData: { success: boolean; insights: CustomerInsight[]; error?: string } =
            await insightsResponse.json();
          if (insightsData.success) {
            setInsights(insightsData.insights);
          } else {
            console.error('Failed to fetch insights:', insightsData.error);
          }
        } else {
          console.error('Failed to detect faces:', data.error);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error fetching analytics:', errorMessage);
      }
      setLoading(false);
    };

    // Poll every 5 seconds
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, [rtsp]);

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

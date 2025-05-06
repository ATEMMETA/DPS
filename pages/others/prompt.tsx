const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await fetch(flaskBackendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

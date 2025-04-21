// pages/api/camera_connected.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { ip, rtsp_url, model } = req.body;
    console.log(`Camera connected: ${ip}, RTSP: ${rtsp_url}, Model: ${model}`);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

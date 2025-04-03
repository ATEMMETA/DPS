export default async function handler(
  req: { query: { ai?: string | string[] } }, // Inline req type
  res: { status: (code: number) => any; json: (data: any) => void } // Inline res type
) {
  const { ai } = req.query;
  res.status(200).json({ message: `Chat with ${ai} coming soon!` });
}

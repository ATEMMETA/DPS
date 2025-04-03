export default async function handler(
  req: { body: { name?: string; email?: string; password?: string } }, // Inline req type
  res: { status: (code: number) => any; json: (data: any) => void } // Inline res type
) {
  const { name, email, password } = req.body;
  // Placeholder or your actual logic
  res.status(200).json({ message: `Signed up ${email}` });
}

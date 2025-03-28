import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password } = req.body;
  // Fake success—no Supabase yet
  res.status(200).json({ message: "Signed up", user: { name, email } });
}

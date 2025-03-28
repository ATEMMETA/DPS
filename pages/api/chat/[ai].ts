import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ai } = req.query;
  res.status(200).json({ message: `Chat with ${ai} coming soon!` });
}

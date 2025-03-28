import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  // Fake success for now
  res.status(200).json({ message: "Signed in", user: { email } });
}

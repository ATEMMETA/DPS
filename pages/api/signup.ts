// /pages/api/signup.ts
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const { name, email, password } = req.body;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ message: error.message });
  // Save name to profiles table if needed
  res.status(200).json({ message: "User signed up", user });
}

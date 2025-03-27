export default async function handler(req, res) {
  const { name, email, password } = req.body;
  // TODO: Add auth logic (e.g., save to DB)
  res.status(200).json({ message: "User signed up" });
}

export default async function handler(req, res) {
  const { email, password } = req.body;
  // TODO: Add auth logic (e.g., verify credentials)
  res.status(200).json({ message: "User signed in" });
}

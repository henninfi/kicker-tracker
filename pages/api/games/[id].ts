import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const FASTAPI_BASE_URL = "http://127.0.0.1:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query as { id: string };

    const response = await fetch(`${FASTAPI_BASE_URL}/games/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      res.status(201).json({ success: true });
      return;
    }
    res.status(500).json({ success: false, error: "Failed to delete the game." });
    return;
  }
  res.status(405).json({ success: false, error: "Method not allowed." });
}

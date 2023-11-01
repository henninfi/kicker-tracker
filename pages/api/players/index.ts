import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const FASTAPI_BASE_URL = "http://127.0.0.1:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle POST request
  if (req.method === "POST") {
    const { name, animal } = req.body;

    const response = await fetch(`${FASTAPI_BASE_URL}/players/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, animal })
    });

    if (response.ok) {
      res.status(201).json({ success: true });
      return;
    }
    res.status(500).json({ success: false, error: "Failed to create the player." });
    return;
  }

  // Handle GET request
  if (req.method === "GET") {
    const response = await fetch(`${FASTAPI_BASE_URL}/players/`);

    if (response.ok) {
      const players = await response.json();
      res.status(200).json(players);
      return;
    }
    res.status(500).json({ success: false, error: "Failed to fetch players." });
    return;
  }

  // Handle other methods
  res.status(405).json({ success: false, error: "Method not allowed." });
}

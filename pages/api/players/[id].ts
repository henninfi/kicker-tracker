import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const NEXT_PUBLIC_API: string | undefined = process.env.NEXT_PUBLIC_API;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle POST request (Update player)
  if (req.method === "POST") {
    const { name, animal, isRetired, ranking } = req.body;
    const { id } = req.query as { id: string };

    const response = await fetch(`${NEXT_PUBLIC_API}/players/${id}`, {
      method: "PUT", // Assuming you're using PUT for updates in your FastAPI
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        animal,
        isRetired: Boolean(isRetired)
      })
    });

    if (response.ok) {
      res.status(201).json({ success: true });
      return;
    }
    res.status(500).json({ success: false, error: "Failed to update the player." });
    return;
  }

  // Handle DELETE request
  if (req.method === "DELETE") {
    const { id } = req.query as { id: string };

    const response = await fetch(`${NEXT_PUBLIC_API}/players/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      res.status(201).json({ success: true });
      return;
    }
    res.status(500).json({ success: false, error: "Failed to delete the player." });
    return;
  }

  // Handle other methods
  res.status(405).json({ success: false, error: "Method not allowed." });
}

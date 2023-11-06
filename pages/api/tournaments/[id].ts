import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const FASTAPI_BASE_URL = "http://localhost:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle DELETE request
  if (req.method === "DELETE") {
    const { id } = req.query as { id: string };

    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/tournaments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        res.status(200).json({ success: true });
        return;
      }

      // Extract error from FastAPI or use a default error
      const data = await response.json();
      
      res.status(response.status).json({ success: false || "Failed to delete the tournament." });

    } catch (error) {
      // Log the error for debugging purposes
      console.error(error);
      res.status(500).json({ error: "Failed to delete the tournament." });
    }
    return;
  }

  // If the method is not supported
  res.status(405).end(); // 405 Method Not Allowed
}

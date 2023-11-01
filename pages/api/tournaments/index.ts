import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const FASTAPI_BASE_URL = "http://127.0.0.1:8000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { wagerPercentage, players, first, second, third } = req.body;

      const response = await axios.post(`${FASTAPI_BASE_URL}/tournaments/`, {
        wagerPercentage,
        players,
        first,
        second,
        third,
      });

      if (response.status === 200 || response.status === 201) {
        return res.status(201).json({ success: true });
      }
    } else if (req.method === "GET") {
      const response = await axios.get(`${FASTAPI_BASE_URL}/tournaments/`);

      if (response.status === 200) {
        return res.status(200).json(response.data);
      }
    }

    // If no known method matches, or an error occurs, return a 500 error.
    return res.status(500).json({ error: "Something went wrong." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

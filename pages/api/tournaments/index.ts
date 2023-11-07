import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const NEXT_PUBLIC_API: string | undefined = process.env.NEXT_PUBLIC_API;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { wagerPercentage, players, first, second, third } = req.body;

      const response = await axios.post(`${NEXT_PUBLIC_API}/tournaments/`, {
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
      const response = await axios.get(`${NEXT_PUBLIC_API}/tournaments/`);

      if (response.status === 200) {
        return res.status(200).json(response.data);
      }
    }

    // If no known method matches, or an error occurs, return a 500 error.
    return res.status(500).json({ error: "Something went wrong." });
  } catch (error) {
    // Type assertion that error is an instance of Error
    const e = error as Error;
    return res.status(500).json({ error: e.message });
  }
}
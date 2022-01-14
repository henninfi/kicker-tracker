import type { NextApiRequest, NextApiResponse } from "next";
import { UpstashGameRepository } from "../../../repository/UpstashGameRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = new UpstashGameRepository();
  if (req.method === "POST") {
    const { player1, player2, winner } = req.body;

    await repository.create(player1, player2, winner);

    res.status(201).json({ success: true });
  }
  if (req.method === "GET") {
    const players = await repository.listAll();

    res.status(200).json(players);
  }
  res.status(500);
}

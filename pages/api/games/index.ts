import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { format } from 'date-fns';
import { Game } from '../../../domain/Game'

const FASTAPI_BASE_URL = "http://127.0.0.1:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle POST request
  if (req.method === "POST") {
    const { winnerTeam, loserTeam } = req.body;

    const response = await fetch(`${FASTAPI_BASE_URL}/games/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ winnerTeam, loserTeam })
    });
    console.log(JSON.stringify({ winnerTeam, loserTeam }))
    
    if (response.ok) {
      res.status(201).json({ success: true });
      return;
    }
    res.status(500).json({ success: false, error: "Failed to create the game." });
    return;
  }



// Define a function to format the date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', // "Sat"
    year: 'numeric', // "2023"
    month: 'short', // "Nov"
    day: '2-digit', // "04"
    hour: '2-digit', // "23"
    minute: '2-digit', // "00"
    second: '2-digit', // "53"
    timeZoneName: 'short', // "GMT+0100"
    timeZone: 'Europe/Berlin', // Central European Standard Time
  };
  
  // Convert the ISO string to a Date object
  const date = new Date(dateString);
  
  // Use `date-fns-tz` to format the date with time zone
  return format(date, 'EEE MMM dd yyyy HH:mm:ss \'GMT\'xxxx \'(Central European Standard Time)\'', options as any);
}

// Handle GET request
if (req.method === "GET") {
  const response = await fetch(`${FASTAPI_BASE_URL}/games/`);
  if (response.ok) {
    let games = (await response.json()) as Game[];


    // Format the `createdAt` date for each game
    games = games.map(game => ({
      ...game,
      createdAt: new Date(formatDate(game.createdAt as any))
    }));

    res.status(200).json(games as Game[]);
    return;
  }
  res.status(500).json({ success: false, error: "Failed to fetch games." });
  return;
}


  // Handle other methods
  res.status(405).json({ success: false, error: "Method not allowed." });
}

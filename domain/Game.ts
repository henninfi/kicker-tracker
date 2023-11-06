import { PlayerId } from "./Player";

export type Team = [PlayerId, PlayerId | undefined];
export type GameId = string;

export interface Game {
  id: GameId;
  createdAt: Date;
  winnerTeam: Team;
  loserTeam: Team;
}

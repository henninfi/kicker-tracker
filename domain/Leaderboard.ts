import { Game, IGame } from "./Game";
import { IPlayer, Player } from "./Player";

export interface RatedPlayer extends IPlayer {
  rating: number;
}

export interface RatedGame extends IGame {
  delta: number;
}

export class Leaderboard {
  constructor(
    public readonly players: Player[],
    public readonly games: Game[]
  ) {}

  get rankedPlayers(): RatedPlayer[] {
    let ratedPlayers: RatedPlayer[] = this.players.map((player) => ({
      ...player,
      rating: 1500,
    }));

    this.games
      .sort((a, b) => +a.createdAt - +b.createdAt)
      .forEach((game) => {
        ratedPlayers = this.applyGame(game, ratedPlayers);
      });

    return ratedPlayers.sort((a, b) => b.rating - a.rating);
  }

  get ratedGames(): RatedGame[] {
    return this.games
      .sort((a, b) => +a.createdAt - +b.createdAt)
      .map((game, index) => {
        const previousRankedPlayers = new Leaderboard(
          this.players,
          this.games.slice(0, index)
        ).rankedPlayers;

        return {
          ...game,
          delta: this.getGameDelta(game, previousRankedPlayers),
        };
      });
  }

  private applyGame(game: Game, ratedPlayers: RatedPlayer[]): RatedPlayer[] {
    const delta = this.getGameDelta(game, ratedPlayers);

    return ratedPlayers.map((player) => {
      if (
        game.winnerTeam[0] === player.id ||
        game.winnerTeam[1] === player.id
      ) {
        return { ...player, rating: player.rating + delta };
      }
      if (game.loserTeam[0] === player.id || game.loserTeam[1] === player.id) {
        return { ...player, rating: player.rating - delta };
      }

      return player;
    });
  }

  public getGameDelta(game: Game, ratedPlayers: RatedPlayer[]): number {
    const ratingWinner1 = ratedPlayers.find(
      (player) => game.winnerTeam[0] === player.id
    )!.rating;
    const ratingWinner2 = ratedPlayers.find(
      (player) => game.winnerTeam[1] === player.id
    )!.rating;
    const ratingLoser1 = ratedPlayers.find(
      (player) => game.loserTeam[0] === player.id
    )!.rating;
    const ratingLoser2 = ratedPlayers.find(
      (player) => game.loserTeam[1] === player.id
    )!.rating;

    const avgRatingWinner = (ratingWinner1 + ratingWinner2) / 2;
    const avgRatingLoser = (ratingLoser1 + ratingLoser2) / 2;

    const winnerChanceToWin =
      1 / (1 + Math.pow(10, (avgRatingLoser - avgRatingWinner) / 400));
    const delta = Math.round(32 * (1 - winnerChanceToWin));

    return delta;
  }
}

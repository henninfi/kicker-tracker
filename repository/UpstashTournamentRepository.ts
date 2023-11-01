import { PlayerId } from "../domain/Player";
import { Tournament, TournamentTeam, TournamentId } from "../domain/Tournament";

  // tournamentsAPI.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Create a new tournament
export async function createTournament(wagerPercentage:number, players:PlayerId[], first:TournamentTeam, second:TournamentTeam, third:TournamentTeam) {
    const response = await axios.post(`${BASE_URL}/tournaments/`, { wagerPercentage, players, first, second, third });
    return response.data;
}

// Delete a tournament by ID
export async function deleteTournament(tournamentId:TournamentId) {
    const response = await axios.delete(`${BASE_URL}/tournaments/${tournamentId}`);
    return response.data;
}

// List all tournaments
export async function listAllTournaments() {
    const response = await axios.get(`${BASE_URL}/tournaments/`);
    return response.data;
}


import { Player, PlayerAnimal, PlayerId } from "../domain/Player";
// playersAPI.js or another name of your choosing
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Create a new player
export async function createPlayer(name:String, animal:string, isRetired = false) {
    const response = await axios.post(`${BASE_URL}/players/`, { name, animal, isRetired });
    return response.data;
}

// Update an existing player
export async function updatePlayer(playerId:PlayerId, name:String, animal:String, isRetired:Boolean) {
    const response = await axios.put(`${BASE_URL}/players/${playerId}`, { name, animal, isRetired });
    return response.data;
}

// Delete a player by ID
export async function deletePlayer(playerId:PlayerId) {
    const response = await axios.delete(`${BASE_URL}/players/${playerId}`);
    return response.data;
}

// List all players
export async function listAllPlayers() {
    const response = await axios.get(`${BASE_URL}/players/`);
    return response.data;
}

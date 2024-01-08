import axios from "axios";
import { upperFirst } from "lodash";
import Image from "next/image";
import { MouseEvent, useContext, useState } from "react";
import { DataContext } from "../data";
import { animals, PlayerAnimal } from "../domain/Player";
import Button from "./button";
import Card from "./card";
import { useRouter } from 'next/router';
import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import { NewPlayer } from "../domain/Player";
import { useAuthInfo } from "@propelauth/react";


export function PlayerForm({ onClose }: { onClose: () => void } ) {
  const authInfo = useAuthInfo();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { players } = useContext(DataContext);
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState<PlayerAnimal | "">("");

  const sessionId = router.query.sessionId as string;
  const NEXT_PUBLIC_API: string | undefined = process.env.NEXT_PUBLIC_API;
  
  

  const postPlayerMutation = useMutation({
    mutationFn: (newPlayerData: NewPlayer) => {
      const headers = {
        Authorization: `Bearer ${authInfo.accessToken}`,
    };
      // Adjust the URL based on whether sessionId is provided
      const url = sessionId 
        ? `${NEXT_PUBLIC_API}/players/${sessionId}` 
        : `${NEXT_PUBLIC_API}/players`;  // Adjust this URL as needed
  
      return axios.post(url, newPlayerData, { headers });
    },
    onSuccess: (data) => {
      
      // Update the currentPlayer cache with the new data
      if (!sessionId) {
        // Update the currentPlayer cache with the new data
        queryClient.setQueryData(['currentPlayer'], data);
      }

    onClose();  // Close the form or navigate away
      
      
      
    },
    mutationKey: ['addPlayer']
  });



  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!animal || !name) {
      return;
    }

    const newPlayer: NewPlayer = {
      animal: animal,
      name:name
    };

    postPlayerMutation.mutate(newPlayer);
  }


  return (
    <Card className="flex flex-col mb-4">
      <input
        className="rounded bg-gray-300 px-2 py-1 mb-2 border border-gray-700"
        placeholder="Name"
        value={name}
        autoFocus
        onChange={(e) => setName(e.target.value)}
      ></input>
      <div className="flex flex-wrap items-center justify-center">
        {animals
          .filter((el) => !players.map((player) => player.animal).includes(el))
          .map((el) => (
            <div
              key={el}
              className={`p-1 flex flex-col items-center rounded-lg border-2 ${
                el === animal ? "border-gray-700" : "border-transparent"
              }`}
              onClick={() => setAnimal(el)}
            >
              <Image
                src={`/animals/${el}.png`}
                alt={el}
                width={28}
                height={28}
              />
            </div>
          ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        {animal ? (
          <p className="text-sm flex-grow">{upperFirst(animal)}</p>
        ) : (
          <span className="flex-grow" />
        )}
        <Button onClick={onClose}>cancel</Button>
        <Button backgroundColor="bg-green-700" onClick={handleSubmit}>
          create
        </Button>
      </div>
    </Card>
  );
}

export default PlayerForm;

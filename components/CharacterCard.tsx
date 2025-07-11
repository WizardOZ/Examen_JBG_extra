import { Character } from "../utils/API.ts";

interface Props {
  character: Character;
}

export function CharacterCard({ character }: Props) {
  return (
    <a href={`/character/${character.id}`} class="block card hover:shadow-lg">
      <img src={character.image} alt={character.name} />
      <h2 class="text-lg font-bold mt-2">{character.name}</h2>
      <p>{character.species}</p>
    </a>
  );
}

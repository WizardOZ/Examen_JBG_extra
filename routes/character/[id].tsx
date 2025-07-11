import { Handlers, PageProps } from "$fresh/server.ts";
import { Character } from "../../utils/API.ts";

interface CharacterPageData {
  character: Character;
}

export const handler: Handlers<CharacterPageData> = {
  async GET(_, ctx) {
    const id = ctx.params.id;
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    const character = await res.json();
    return ctx.render({ character });
  },
};

export default function CharacterPage({ data }: PageProps<CharacterPageData>) {
  const c = data.character;
  return (
    <div class="p-4">
      <a href="/" class="text-blue-600 underline block mb-4">Volver</a>
      <div class="flex gap-6 items-start">
        <img src={c.image} alt={c.name} class="w-48 rounded" />
        <div>
          <h1 class="text-2xl font-bold mb-2">{c.name}</h1>
          <p><strong>Status:</strong> {c.status}</p>
          <p><strong>Species:</strong> {c.species}</p>
          <p><strong>Gender:</strong> {c.gender}</p>
          <p><strong>Origin:</strong> {c.origin.name}</p>
          <p><strong>Location:</strong> {c.location.name}</p>
        </div>
      </div>
    </div>
  );
}
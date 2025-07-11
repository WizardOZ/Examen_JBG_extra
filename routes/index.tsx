import { Handlers, PageProps } from "$fresh/server.ts";
import { fetchCharacters, Character } from "../utils/API.ts";
import { CharacterCard } from "../components/CharacterCard.tsx";
import CharacterSearch from "../islands/CharacterSearch.tsx";

interface Data {
  characters: Character[];
  currentPage: number;
  totalPages: number;
  nameFilter: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const name = url.searchParams.get("name") || "";

    try {
      const res = await fetchCharacters(page, name);
      return ctx.render({
        characters: res.results,
        currentPage: page,
        totalPages: res.info.pages,
        nameFilter: name,
      });
    } catch {
      return ctx.render({
        characters: [],
        currentPage: 1,
        totalPages: 1,
        nameFilter: name,
      });
    }
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">Rick and Morty Characters</h1>
      <CharacterSearch />
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data.characters.map((char) => (
          <CharacterCard character={char} />
        ))}
      </div>
      <div class="mt-6 flex gap-4 items-center">
        {data.currentPage > 0 && (
          <a class="px-3 py-1 border rounded" href={`/?page=${data.currentPage - 1}&name=${data.nameFilter}`}>
            Anterior
          </a>
        )}
        <span>Página {data.currentPage} / {data.totalPages}</span>
        {data.currentPage < data.totalPages && (
          <a class="px-3 py-1 border rounded" href={`/?page=${data.currentPage + 1}&name=${data.nameFilter}`}>
            Siguiente
          </a>
        )}
      </div>
    </div>
  );
}
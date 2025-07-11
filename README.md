# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.


//type.tsx


export type char = {
    id: string,
    name: string,
    house: string,
    alive: boolean,
    image: string
}

//cookies.tsx

import { char } from "./types.tsx";

export function getFavoritos(): string[] {
  const cookies = document.cookie.split("; ");
  const favoritos = cookies.find((cookie) => cookie.trim().startsWith("favs="))
    ?.split("=")[1];
  if (favoritos) {
    const favs = favoritos.split(",");
    return favs;
  } else {
    return [];
  }
}

export function esFavorito(char: char): boolean {
  const cookies = document.cookie.split("; ");
  const favoritos = cookies.find((cookie) => cookie.trim().startsWith("favs="))
    ?.split("=")[1];
  if (favoritos) {
    const favs = favoritos.split(",");
    return favs.some((id) => id === char.id);
  } else {
    return false;
  }
}

export function addFavorito(char: char): void {
  const date = new Date();
  const expire = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toUTCString();
  const favs = getFavoritos();
  favs.push(char.id);
  document.cookie = `favs=${favs.join(",")}; path=/; expires=${expire}`;
}

export function eraseFavorito(char: char): void {
  const favs = getFavoritos();
  const filtrados = favs.filter((id) => id !== char.id);
  if (filtrados.length === 0) {
    const date = new Date();
    const expire = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toUTCString();
    document.cookie = `favs=${filtrados.join(",")}; path=/; expires=${expire}`;
  } else {
    const date = new Date();
    const expire = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toUTCString();
    document.cookie = `favs=${filtrados.join(",")}; path=/; expires=${expire}`;
  }
}

/routes----

//index.tsx
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import CharList from "../components/charlist.tsx";

import { char } from "../types.tsx";

async function getPersonajes():Promise<char[]> {
  const data = await fetch("https://hp-api.onrender.com/api/characters")
  if(data.status!==200) throw new Error("Api error")
  const response = await data.json()
  return response
}
type data = {
  chars:char[]
}

export const handler:Handlers<data> = {
    GET: async (_req:Request,ctx:FreshContext<unknown,data>) => {
      const personajes = await getPersonajes()
      return ctx.render({chars:personajes})
    }
}

export default function Home(props:PageProps<data>) {
  const {chars} = props.data
  return (
    <CharList chars={chars}/>
  );
}


//favourites.tsx

import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import CharList from "../components/charlist.tsx";
import { char } from "../types.tsx";

async function getPersonajes():Promise<char[]> {
  const data = await fetch("https://hp-api.onrender.com/api/characters")
  if(data.status!==200) throw new Error("Api error")
  const response = await data.json()
  return response
}
type data = {
  chars:char[]
}

export const handler:Handlers<data> = {
    GET: async (req:Request,ctx:FreshContext<unknown,data>) => {
      const personajesOG = await getPersonajes()
      const headers = req.headers
      const favs = headers.get("Cookie")?.split("; ").find((cookie) => cookie.trim().startsWith("favs="))?.split("=")[1].split(",")
      if(favs){
      const personajesFiltrados = personajesOG.filter((char) => favs?.includes(char.id))
      return ctx.render({chars:personajesFiltrados})
      } else {
        return ctx.render({chars: []})
      }
    }
}

export default function Home(props:PageProps<data>) {
  const {chars} = props.data
  return (
    <CharList chars={chars} />
  );
}
//_layout_.tsx

import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import CharList from "../components/charlist.tsx";
import { char } from "../types.tsx";

async function getPersonajes():Promise<char[]> {
  const data = await fetch("https://hp-api.onrender.com/api/characters")
  if(data.status!==200) throw new Error("Api error")
  const response = await data.json()
  return response
}
type data = {
  chars:char[]
}

export const handler:Handlers<data> = {
    GET: async (req:Request,ctx:FreshContext<unknown,data>) => {
      const personajesOG = await getPersonajes()
      const headers = req.headers
      const favs = headers.get("Cookie")?.split("; ").find((cookie) => cookie.trim().startsWith("favs="))?.split("=")[1].split(",")
      if(favs){
      const personajesFiltrados = personajesOG.filter((char) => favs?.includes(char.id))
      return ctx.render({chars:personajesFiltrados})
      } else {
        return ctx.render({chars: []})
      }
    }
}

export default function Home(props:PageProps<data>) {
  const {chars} = props.data
  return (
    <CharList chars={chars} />
  );
}

/islands----

//chatCard.tsx

import { useEffect, useState } from "preact/hooks";
import { char } from "../types.tsx";
import { addFavorito, eraseFavorito, esFavorito } from "../cookies.ts";

type data = {
    char:char
}

export default function CharCard({char}:data){
    const [fav,setFav] = useState<boolean>(false)
    const [first,setFirst] = useState<boolean>(true)

    useEffect(() => {
        console.log(fav)
        if(first){
            setFirst(false)
            setFav(esFavorito(char))
        }else {
            if(!fav){
                eraseFavorito(char)
            } else {
                addFavorito(char)
            }
        }
    },[fav])

    return(
        <div class="card">
            {char.image !== ""&& <img src={char.image} alt={char.name} />}
            {char.image === "" && <img src="../no-image.jpg" alt={char.name} />}
            <div class="card-info">
                <a class="name" href={"/characters/"+char.id}>{char.name}</a>
                {fav && <span class="star fav" onClick={() => setFav(false)}>★<div></div></span>}
                {!fav && <span class="star" onClick={() => setFav(true)}>★<div></div></span>}
            </div>
        </div>
    )
}

//charDetail.tsx

import { char } from "../types.tsx";
import { useEffect, useState } from "preact/hooks";
import { addFavorito, eraseFavorito, esFavorito } from "../cookies.ts";

type data = {
  char: char;
};

export default function CharDetail({ char }: data) {
  const [fav, setFav] = useState<boolean>(false);
  const [first, setFirst] = useState<boolean>(true);

  useEffect(() => {
          console.log(fav)
          if(first){
              setFirst(false)
              setFav(esFavorito(char))
          }else {
              if(!fav){
                  eraseFavorito(char)
              } else {
                  addFavorito(char)
              }
          }
      },[fav])

  return (
    <div class="detail">
      {char.image !== "" && <img src={char.image} alt={char.name} />}
      {char.image === "" && <img src="../no-image.jpg" alt={char.name} />}
        <h2>{char.name} {fav && (
          <span class="star fav" onClick={() => setFav(false)}>
            ★<div></div>
          </span>
        )}
        {!fav && (
          <span class="star" onClick={() => setFav(true)}>
            ★<div></div>
          </span>
        )}</h2>
        {char.house !== "" && <p>Casa: {char.house}</p>}
        {char.house === "" && <p>Casa: Desconocida</p>}
        {char.alive && <p>Estado: Vivo</p>}
        {!char.alive && <p>Estado: Muerto</p>}
        <a href="/">Volver</a>
    </div>
  );
}

/componets/---

//charList.tsx



export default function Header(){
    return(
        <div class="header">
            <a href="/">Todos</a>
            <a href="/favorites">Favoritos</a>
        </div>
    )
}

//header.tsx



export default function Header(){
    return(
        <div class="header">
            <a href="/">Todos</a>
            <a href="/favorites">Favoritos</a>
        </div>
    )
}

-----------------------------------




// utils/API.ts
export const API_BASE = "https://rickandmortyapi.com/api";

export interface Character {
  id: number;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
  origin: {
    name: string;
  };
}

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export async function fetchCharacters(page = 1, name = ""): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/character/?page=${page}&name=${name}`);
  if (!res.ok) {
    throw new Error("Failed to fetch characters");
  }
  return await res.json();
}

export async function fetchCharacterById(id: string): Promise<Character> {
  const res = await fetch(`${API_BASE}/character/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch character");
  }
  return await res.json();
}







// components/CharacterCard.tsx
import { Character } from "../utils/API.ts";

export function CharacterCard({ character }: { character: Character }) {
  return (
    <a href={`/${character.id}`} class="block border rounded p-2 hover:shadow-md">
      <img src={character.image} alt={character.name} class="w-full rounded" />
      <p class="text-center mt-2 font-semibold">{character.name}</p>
    </a>
  );
}





// islands/CharacterSearch.tsx
import { useState } from "preact/hooks";

export default function CharacterSearch() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    window.location.href = `/?name=${query}`;
  };

  return (
    <form onSubmit={handleSubmit} class="mb-4">
      <input
        type="text"
        placeholder="Nombre del personaje"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        class="border p-2 rounded w-80"
      />
      <button type="submit" class="ml-2 p-2 bg-blue-600 text-white rounded">
        Buscar
      </button>
    </form>
  );
}




routes(index)

// routes/index.tsx
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
        {data.currentPage > 1 && (
          <a
            class="px-3 py-1 border rounded"
            href={`/?page=${data.currentPage - 1}&name=${data.nameFilter}`}
          >
            Anterior
          </a>
        )}
        <span>Página {data.currentPage} / {data.totalPages}</span>
        {data.currentPage < data.totalPages && (
          <a
            class="px-3 py-1 border rounded"
            href={`/?page=${data.currentPage + 1}&name=${data.nameFilter}`}
          >
            Siguiente
          </a>
        )}
      </div>
    </div>
  );
}

// routes/[id].tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { fetchCharacterById, Character } from "../utils/API.ts";

export const handler: Handlers<Character> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const character = await fetchCharacterById(id);
    return ctx.render(character);
  },
};

export default function CharacterPage({ data }: PageProps<Character>) {
  return (
    <div class="p-4">
      <a href="/" class="text-blue-600 underline">← Volver</a>
      <div class="mt-4 flex flex-col md:flex-row gap-6">
        <img src={data.image} alt={data.name} class="w-64 rounded" />
        <div>
          <h1 class="text-3xl font-bold">{data.name}</h1>
          <p><strong>Estado:</strong> {data.status}</p>
          <p><strong>Especie:</strong> {data.species}</p>
          <p><strong>Género:</strong> {data.gender}</p>
          <p><strong>Origen:</strong> {data.origin.name}</p>
        </div>
      </div>
    </div>
  );
}


// routes/_app.tsx
import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <head>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-white text-gray-900">
        <Component />
      </body>
    </>
  );
}

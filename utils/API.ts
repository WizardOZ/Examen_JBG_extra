
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
  location:{
    name:string;
  }
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

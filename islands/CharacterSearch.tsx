import { useSignal } from "@preact/signals";

export default function CharacterSearch() {
  const query = useSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    globalThis.location.href = `/?name=${query.value}`;
  };

  return (
    <form onSubmit={handleSubmit} class="mb-4">
      <input
        type="text"
        placeholder="Nombre del personaje"
        value={query.value}
        onInput={(e) => (query.value = (e.target as HTMLInputElement).value)}
        class="border p-2 rounded w-80"
      />
      <button type="submit" class="ml-2 p-2 bg-blue-600 text-white rounded">
        Buscar
      </button>
    </form>
  );
}

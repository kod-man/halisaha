"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AlternativePlayers() {
  const [alternativeSquad, setAlternativeSquad] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState("");

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const savedAlternativeSquad = localStorage.getItem("alternativeSquad");
    if (savedAlternativeSquad) {
      setAlternativeSquad(JSON.parse(savedAlternativeSquad));
    }
  }, []);

  // Verileri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("alternativeSquad", JSON.stringify(alternativeSquad));
  }, [alternativeSquad]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.trim()) return;
    setAlternativeSquad([...alternativeSquad, newPlayer.trim()]);
    setNewPlayer("");
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Alternatif Oyuncular</h1>
          <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Ana Sayfa
          </Link>
        </div>

        {/* Oyuncu Ekleme Formu */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Yeni Oyuncu Ekle</h2>
          <form onSubmit={handleAddPlayer} className="flex gap-4">
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              placeholder="Oyuncu adı"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ekle
            </button>
          </form>
        </div>

        {/* Alternatif Oyuncular Listesi */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mevcut Alternatif Oyuncular</h2>
          {alternativeSquad.length > 0 ? (
            <ul className="space-y-2">
              {alternativeSquad.map((player, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <span>{player}</span>
                  <button
                    onClick={() => {
                      const newSquad = alternativeSquad.filter((_, i) => i !== index);
                      setAlternativeSquad(newSquad);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">Alternatif oyuncu bulunmuyor.</p>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Squad = {
  date: string;
  teamA: string[];
  teamB: string[];
  alternativeSquad: string[];
};

export default function PastSquads() {
  const [pastSquads, setPastSquads] = useState<Squad[]>([]);

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const savedPastSquads = localStorage.getItem("pastSquads");
    if (savedPastSquads) {
      setPastSquads(JSON.parse(savedPastSquads));
    }
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Geçmiş Kadrolar</h1>
          <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Ana Sayfa
          </Link>
        </div>

        {pastSquads.map((squad, index) => (
          <div key={index} className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{squad.date}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium mb-2">Takım A:</p>
                <ul className="list-disc list-inside space-y-1">
                  {squad.teamA.map((player, i) => (
                    <li key={i} className="text-gray-700">
                      {player}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Takım B:</p>
                <ul className="list-disc list-inside space-y-1">
                  {squad.teamB.map((player, i) => (
                    <li key={i} className="text-gray-700">
                      {player}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {squad.alternativeSquad.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Alternatif Kadro:</p>
                <ul className="list-disc list-inside space-y-1">
                  {squad.alternativeSquad.map((player, i) => (
                    <li key={i} className="text-gray-700">
                      {player}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {pastSquads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz geçmiş kadro bulunmuyor.</p>
          </div>
        )}
      </main>
    </div>
  );
}

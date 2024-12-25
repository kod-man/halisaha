"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

type Squad = {
  date: string;
  teamA: string[];
  teamB: string[];
  alternativeSquad: string[];
};

const INITIAL_PLAYERS = [
  "Mehmet abi",
  "Ahmet ikiz",
  "Orhan Abi",
  "Cafer abi",
  "Mesut abi",
  "Ibrahim abi",
  "Ufuk abi",
  "Ilhan Hasselt",
  "Ilkay abi",
  "Savas abi",
  "Isa abi",
  "Ilyas abi",
];

// İlk 6 oyuncu Takım A'ya, diğer 6 oyuncu Takım B'ye
const INITIAL_TEAM_A = INITIAL_PLAYERS.slice(0, 6);
const INITIAL_TEAM_B = INITIAL_PLAYERS.slice(6, 12);
const MAX_PAST_SQUADS = 2; // Son 2 hafta

export default function Home() {
  const [teamA, setTeamA] = useState(INITIAL_TEAM_A);
  const [teamB, setTeamB] = useState(INITIAL_TEAM_B);
  const [alternativeSquad, setAlternativeSquad] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [pastSquads, setPastSquads] = useState<Squad[]>([]);

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const savedPastSquads = localStorage.getItem("pastSquads");
    const savedAlternativeSquad = localStorage.getItem("alternativeSquad");

    if (savedPastSquads) {
      setPastSquads(JSON.parse(savedPastSquads));
    }
    if (savedAlternativeSquad) {
      setAlternativeSquad(JSON.parse(savedAlternativeSquad));
    }
  }, []);

  // Verileri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("pastSquads", JSON.stringify(pastSquads));
  }, [pastSquads]);

  useEffect(() => {
    localStorage.setItem("alternativeSquad", JSON.stringify(alternativeSquad));
  }, [alternativeSquad]);

  const currentDate = new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.trim()) return;
    setAlternativeSquad([...alternativeSquad, newPlayer.trim()]);
    setNewPlayer("");
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceId === destId) {
      // Aynı takım içinde sıralama değişikliği
      const team =
        sourceId === "teamA"
          ? [...teamA]
          : sourceId === "teamB"
          ? [...teamB]
          : [...alternativeSquad];
      const [removed] = team.splice(sourceIndex, 1);
      team.splice(destIndex, 0, removed);

      if (sourceId === "teamA") setTeamA(team);
      else if (sourceId === "teamB") setTeamB(team);
      else setAlternativeSquad(team);
    } else {
      // Takımlar arası transfer
      const sourceTeam =
        sourceId === "teamA"
          ? [...teamA]
          : sourceId === "teamB"
          ? [...teamB]
          : [...alternativeSquad];
      const destTeam =
        destId === "teamA" ? [...teamA] : destId === "teamB" ? [...teamB] : [...alternativeSquad];

      const [removed] = sourceTeam.splice(sourceIndex, 1);
      destTeam.splice(destIndex, 0, removed);

      if (sourceId === "teamA") setTeamA(sourceTeam);
      else if (sourceId === "teamB") setTeamB(sourceTeam);
      else setAlternativeSquad(sourceTeam);

      if (destId === "teamA") setTeamA(destTeam);
      else if (destId === "teamB") setTeamB(destTeam);
      else setAlternativeSquad(destTeam);
    }
  };

  const saveCurrentSquad = () => {
    const currentSquad: Squad = {
      date: currentDate,
      teamA: [...teamA],
      teamB: [...teamB],
      alternativeSquad: [...alternativeSquad],
    };

    // Son 2 haftayı tut
    const updatedSquads = [currentSquad, ...pastSquads].slice(0, MAX_PAST_SQUADS);
    setPastSquads(updatedSquads);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
      {/* Üst Navigasyon */}
      <div className="fixed top-4 right-4 z-50 flex gap-4">
        <Link
          href="/past-squads"
          className="bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50"
        >
          Geçmiş Kadrolar
        </Link>
        <Link
          href="/alternative-players"
          className="bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50"
        >
          Alternatif Oyuncular
        </Link>
      </div>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Halısaha Organizasyonu</h1>
        <h2 className="text-xl text-center mb-8 text-gray-600">{currentDate}</h2>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Takım A */}
            <Droppable droppableId="teamA">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h2 className="text-xl font-semibold mb-4">Takım A ({teamA.length}/6)</h2>
                  <ul className="space-y-2">
                    {teamA.map((player, index) => (
                      <Draggable key={player} draggableId={`teamA-${player}`} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-move"
                          >
                            <span>{player}</span>
                            <button
                              onClick={() => {
                                const newTeamA = teamA.filter((_, i) => i !== index);
                                setTeamA(newTeamA);
                                setAlternativeSquad([...alternativeSquad, player]);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              Sil
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>

            {/* Takım B */}
            <Droppable droppableId="teamB">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h2 className="text-xl font-semibold mb-4">Takım B ({teamB.length}/6)</h2>
                  <ul className="space-y-2">
                    {teamB.map((player, index) => (
                      <Draggable key={player} draggableId={`teamB-${player}`} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-move"
                          >
                            <span>{player}</span>
                            <button
                              onClick={() => {
                                const newTeamB = teamB.filter((_, i) => i !== index);
                                setTeamB(newTeamB);
                                setAlternativeSquad([...alternativeSquad, player]);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              Sil
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          </div>

          {/* Alternatif Kadro */}
          <Droppable droppableId="alternative">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-8 bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4">Alternatif Kadro</h2>
                <ul className="space-y-2">
                  {alternativeSquad.map((player, index) => (
                    <Draggable key={player} draggableId={`alt-${player}`} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-move"
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Oyuncu Ekleme Formu */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
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

        {/* Kadroyu Kaydet */}
        <div className="mt-8 flex justify-center mb-8">
          <button
            onClick={saveCurrentSquad}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
          >
            Kadroyu Kaydet
          </button>
        </div>
      </main>
    </div>
  );
}

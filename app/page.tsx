"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { DropResult } from "react-beautiful-dnd";

const DragDropContext = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.DragDropContext),
  { ssr: false },
);

const Droppable = dynamic(() => import("react-beautiful-dnd").then((mod) => mod.Droppable), {
  ssr: false,
});

const Draggable = dynamic(() => import("react-beautiful-dnd").then((mod) => mod.Draggable), {
  ssr: false,
});

const getStoredTeams = () => {
  if (typeof window === "undefined") return { teamA: [], teamB: [] };

  try {
    const savedTeamA = localStorage.getItem("teamA");
    const savedTeamB = localStorage.getItem("teamB");

    return {
      teamA: savedTeamA ? JSON.parse(savedTeamA) : [],
      teamB: savedTeamB ? JSON.parse(savedTeamB) : [],
    };
  } catch (error) {
    console.error("Error loading teams from localStorage:", error);
    return { teamA: [], teamB: [] };
  }
};

export default function Home() {
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<"teamA" | "teamB">("teamA");

  useEffect(() => {
    const { teamA: savedTeamA, teamB: savedTeamB } = getStoredTeams();
    setTeamA(savedTeamA);
    setTeamB(savedTeamB);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("teamA", JSON.stringify(teamA));
      localStorage.setItem("teamB", JSON.stringify(teamB));
    } catch (error) {
      console.error("Error saving teams to localStorage:", error);
    }
  }, [teamA, teamB]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    if (selectedTeam === "teamA") {
      setTeamA([...teamA, newPlayerName]);
    } else {
      setTeamB([...teamB, newPlayerName]);
    }

    setNewPlayerName("");
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    // Aynı takım içinde sıralama
    if (sourceId === destId) {
      const team = sourceId === "teamA" ? [...teamA] : [...teamB];
      const [removed] = team.splice(sourceIndex, 1);
      team.splice(destIndex, 0, removed);

      if (sourceId === "teamA") {
        setTeamA(team);
      } else {
        setTeamB(team);
      }
      return;
    }

    // Takımlar arası transfer
    const sourceTeam = sourceId === "teamA" ? [...teamA] : [...teamB];
    const destTeam = destId === "teamA" ? [...teamA] : [...teamB];
    const [removed] = sourceTeam.splice(sourceIndex, 1);
    destTeam.splice(destIndex, 0, removed);

    if (sourceId === "teamA") {
      setTeamA(sourceTeam);
    } else {
      setTeamB(sourceTeam);
    }

    if (destId === "teamA") {
      setTeamA(destTeam);
    } else {
      setTeamB(destTeam);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Halısaha Organizasyonu
        </h1>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Takım A ({teamA.length}/6)</h2>
              <Droppable droppableId="teamA">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[300px] p-4 rounded-lg ${
                      snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    {teamA.map((player, index) => (
                      <Draggable key={player} draggableId={`teamA-${player}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border ${
                              snapshot.isDragging
                                ? "border-blue-500 shadow-lg"
                                : "border-gray-200 hover:shadow-md"
                            } transition-all duration-200`}
                          >
                            <span className="text-gray-700 font-medium">{player}</span>
                            <button
                              onClick={() => {
                                const newTeamA = teamA.filter((_, i) => i !== index);
                                setTeamA(newTeamA);
                              }}
                              className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                            >
                              Sil
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Takım B ({teamB.length}/6)</h2>
              <Droppable droppableId="teamB">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[300px] p-4 rounded-lg ${
                      snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    {teamB.map((player, index) => (
                      <Draggable key={player} draggableId={`teamB-${player}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border ${
                              snapshot.isDragging
                                ? "border-blue-500 shadow-lg"
                                : "border-gray-200 hover:shadow-md"
                            } transition-all duration-200`}
                          >
                            <span className="text-gray-700 font-medium">{player}</span>
                            <button
                              onClick={() => {
                                const newTeamB = teamB.filter((_, i) => i !== index);
                                setTeamB(newTeamB);
                              }}
                              className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                            >
                              Sil
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </section>
          </div>
        </DragDropContext>

        <form onSubmit={handleAddPlayer} className="mt-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Oyuncu Adı"
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value as "teamA" | "teamB")}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="teamA">Takım A</option>
              <option value="teamB">Takım B</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

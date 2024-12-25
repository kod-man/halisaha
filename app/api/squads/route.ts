import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Tüm kadroları getir (son 2 hafta)
export async function GET() {
  try {
    const squads = await prisma.squad.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 2,
    });
    return NextResponse.json(squads);
  } catch (error) {
    return NextResponse.json({ error: "Kadrolar yüklenirken hata oluştu" }, { status: 500 });
  }
}

// Yeni kadro ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const squad = await prisma.squad.create({
      data: {
        date: body.date,
        teamA: body.teamA,
        teamB: body.teamB,
        alternativeSquad: body.alternativeSquad,
      },
    });
    return NextResponse.json(squad);
  } catch (error) {
    return NextResponse.json({ error: "Kadro kaydedilirken hata oluştu" }, { status: 500 });
  }
}

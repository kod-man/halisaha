import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Tüm alternatif oyuncuları getir
export async function GET() {
  try {
    const players = await prisma.alternativePlayer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json(
      { error: "Alternatif oyuncular yüklenirken hata oluştu" },
      { status: 500 },
    );
  }
}

// Yeni alternatif oyuncu ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const player = await prisma.alternativePlayer.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: "Oyuncu eklenirken hata oluştu" }, { status: 500 });
  }
}

// Alternatif oyuncuyu sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    await prisma.alternativePlayer.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: "Oyuncu silindi" });
  } catch (error) {
    return NextResponse.json({ error: "Oyuncu silinirken hata oluştu" }, { status: 500 });
  }
}

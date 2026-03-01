import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, coinId, coinSymbol, price, amount } = body; // <--- AMOUNT (Miktar) GELDİ Mİ?

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: '976221Uzo', // <--- DİKKAT: ŞİFRENİ YAZ (123456)
      connectString: 'localhost:1521/xe'
    });

    // DİKKAT: Burası artık 5 parametre almalı (:1, :2, :3, :4, :5)
    await connection.execute(
      `BEGIN SP_COIN_EKLE(:1, :2, :3, :4, :5); END;`,
      [username, coinId, coinSymbol, price, amount]
    );

    return NextResponse.json({ success: true });

  } catch (err: any) { // Hata detayını görmek için 'any' ekledik
    console.error("Oracle Hatası:", err); // Terminale hatayı yazdırır
    return NextResponse.json({ success: false, message: err.message });
  } finally {
    if (connection) { try { await connection.close(); } catch (e) {} }
  }
}
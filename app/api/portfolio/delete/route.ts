import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, coinId, amount } = body; // <--- ARTIK MİKTAR DA ALIYORUZ
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: '976221Uzo', // <--- ŞİFRENİ YAZ
      connectString: 'localhost:1521/xe'
    });

    // Yeni prosedürü çağırıyoruz: SP_COIN_SAT
    await connection.execute(
      `BEGIN SP_COIN_SAT(:1, :2, :3); END;`,
      [username, coinId, amount]
    );

    return NextResponse.json({ success: true, message: 'Satış işlemi başarılı.' });

  } catch (err) {
    console.error("Satış Hatası:", err);
    return NextResponse.json({ success: false, message: 'İşlem başarısız.' });
  } finally {
    if (connection) { try { await connection.close(); } catch (e) {} }
  }
}
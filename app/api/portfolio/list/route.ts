import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function POST(request: Request) {
  const body = await request.json();
  const { username } = body;
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: '976221Uzo', // <--- DİKKAT: ŞİFRENİ YAZ (123456)
      connectString: 'localhost:1521/xe'
    });

    const result = await connection.execute(
      `SELECT * FROM VW_KULLANICI_PORTFOYU WHERE KULLANICI_ADI = :1`,
      [username]
    );

    // Veritabanından gelen sütun sıralaması (VIEW'deki sıraya göre):
    // 0: KULLANICI_ADI, 1: COIN_ID, 2: SYMBOL, 3: ALIS_FIYATI, 4: MIKTAR, 5: KAYIT_ID
    const portfolio = result.rows?.map((row: any) => ({
      username: row[0],
      coinId: row[1],
      coinSymbol: row[2],
      buyPrice: row[3],
      amount: row[4],  // <--- BU SATIR ÇOK ÖNEMLİ
      kayitId: row[5]
    }));

    return NextResponse.json({ success: true, data: portfolio });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  } finally {
    if (connection) { try { await connection.close(); } catch (e) {} }
  }
}
import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;
  let connection;

  try {
    
    connection = await oracledb.getConnection({
      user: 'system',
      password: '976221Uzo',
      connectString: 'localhost:1521/xe'
    });

    // Kullanıcıyı Arıyoruz
    const result = await connection.execute(
      `SELECT * FROM KULLANICILAR WHERE KULLANICI_ADI = :1 AND SIFRE = :2`,
      [username, password]
    );

    // Sonuç Var mı?
    if (result.rows && result.rows.length > 0) {
      return NextResponse.json({ success: true, message: 'Giriş Başarılı!' });
    } else {
      return NextResponse.json({ success: false, message: 'Kullanıcı adı veya şifre hatalı!' });
    }

  } catch (err) {
    console.error('Hata:', err);
    return NextResponse.json({ success: false, message: 'Veritabanı bağlantı hatası' });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
}
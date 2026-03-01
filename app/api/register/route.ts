import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: '976221Uzo', // <--- DİKKAT: ŞİFRENİZİ BURAYA YAZIN
      connectString: 'localhost:1521/xe'
    });

    // 1. Kullanıcı adı dolu mu diye basit kontrol
    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Kullanıcı adı ve şifre zorunludur.' });
    }

    // 2. Bu kullanıcı zaten var mı?
    const checkUser = await connection.execute(
      `SELECT * FROM KULLANICILAR WHERE KULLANICI_ADI = :1`,
      [username]
    );

    if (checkUser.rows && checkUser.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'Bu kullanıcı adı zaten alınmış!' });
    }

    // 3. Yoksa kaydet (Varsayılan rol: user)
    await connection.execute(
      `INSERT INTO KULLANICILAR (KULLANICI_ADI, SIFRE, ROL) VALUES (:1, :2, 'user')`,
      [username, password]
    );

    await connection.commit(); // Kesin kaydet

    return NextResponse.json({ success: true, message: 'Kayıt başarılı! Giriş yapabilirsiniz.' });

  } catch (err) {
    console.error('Kayıt Hatası:', err);
    return NextResponse.json({ success: false, message: 'Kayıt sırasında teknik bir hata oluştu.' });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
}
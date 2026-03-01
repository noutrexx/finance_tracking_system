import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function GET() {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: '976221Uzo', // <--- ŞİFRE
      connectString: 'localhost:1521/xe'
    });

    // VIEW ÇAĞIRIYORUZ
    const result = await connection.execute(`SELECT * FROM VW_SISTEM_OZETI`);
    const row = result.rows ? result.rows[0] : [0, 0, 0];

    return NextResponse.json({
      users: row[0],
      tracking: row[1],
      logs: row[2]
    });

  } catch (err) {
    return NextResponse.json({ users: 0, tracking: 0, logs: 0 });
  } finally {
    if (connection) { try { await connection.close(); } catch (e) {} }
  }
}
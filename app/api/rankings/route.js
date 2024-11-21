import { neon } from "@neondatabase/serverless";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    const rankings = await sql`
      SELECT 
        u.id AS user_id,
        u.username,
        COALESCE(SUM(g.correct_answers), 0) as total_correct,
        COALESCE(SUM(g.total_questions), 0) as total_questions,
        CASE 
          WHEN COALESCE(SUM(g.total_questions), 0) > 0 
          THEN ROUND(CAST(SUM(g.correct_answers) AS DECIMAL) / SUM(g.total_questions) * 100, 2)
          ELSE 0
        END as accuracy
      FROM 
        users u
      LEFT JOIN 
        games g ON u.id = g.user_id
      GROUP BY 
        u.id, u.username
      ORDER BY 
        total_correct DESC, accuracy DESC
      LIMIT 10
    `;

    return Response.json(rankings);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return Response.json(
      { error: "Failed to fetch rankings" },
      { status: 500 }
    );
  }
}

import { neon } from '@neondatabase/serverless'

export async function POST(request) {
  const sql = neon(process.env.DATABASE_URL)
  const { userId, correctAnswers, totalQuestions } = await request.json()

  try {
    // Guardar el juego
    await sql`
      INSERT INTO games (user_id, correct_answers, total_questions, finished_at)
      VALUES (${userId}, ${correctAnswers}, ${totalQuestions}, CURRENT_TIMESTAMP)
    `

    // Actualizar las estadísticas del usuario
    await sql`
      INSERT INTO user_category_stats (user_id, category_id, correct_answers, total_questions)
      VALUES (${userId}, 1, ${correctAnswers}, ${totalQuestions})
      ON CONFLICT (user_id, category_id)
      DO UPDATE SET
        correct_answers = user_category_stats.correct_answers + EXCLUDED.correct_answers,
        total_questions = user_category_stats.total_questions + EXCLUDED.total_questions
    `

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error saving game results:', error)
    return Response.json({ error: 'Failed to save game results' }, { status: 500 })
  }
}
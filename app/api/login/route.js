import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  const sql = neon(process.env.DATABASE_URL);
  const { username, password } = await request.json();

  try {
    const result = await sql`
      SELECT * FROM authenticate_user(${username}, ${password})
    `;

    const { success, user_id } = result[0];

    if (success) {
      // Aquí podrías generar un token de sesión si lo deseas
      return Response.json({ success: true, userId: user_id });
    } else {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}

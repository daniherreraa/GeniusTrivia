import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  const sql = neon(process.env.DATABASE_URL);
  const { username, password } = await request.json();

  try {
    const result = await sql`
      SELECT * FROM register_user(${username}, ${password})
    `;

    const { success, message } = result[0];

    if (success) {
      return Response.json({ success: true, message });
    } else {
      return Response.json({ success: false, message }, { status: 400 });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}

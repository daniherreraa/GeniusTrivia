import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  const sql = neon(process.env.DATABASE_URL);
  const { username, password } = await request.json();

  console.log("Registering user:", { username, password });

  try {
    const result = await sql`
      SELECT * FROM register_user(${username}::VARCHAR, ${password}::VARCHAR)
    `;

    if (result.length > 0) {
      const { success, message } = result[0];
      return Response.json({ success, message });
    } else {
      return Response.json(
        { success: false, message: "Unexpected result from database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}

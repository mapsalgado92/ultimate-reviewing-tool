import { hashSync } from "bcrypt"
import { NextResponse } from "next/server"

export async function GET(req) {
  const params = req.nextUrl.searchParams

  let string = params.get("string")

  let hashed = hashSync(string, 1)

  return NextResponse.json({ message: "String Hashed!", data: hashed })
}

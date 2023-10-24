import { NextResponse } from "next/server"
import { google } from "googleapis"
import { verify_app_auth, get_google_auth } from "../../utils"
import { hashSync } from "bcrypt"

export async function POST(req) {
  const body = await req.json()
  const authorization = req.headers.get("authorization")

  let sheet_name = "users"
  let left_range = "A"
  let right_range = "C"

  let password = body.password

  const auth = get_google_auth()
  const sheets = google.sheets({ version: "v4", auth: auth })

  const verified = await verify_app_auth(sheets, authorization)

  if (!verified) {
    return NextResponse.json({
      message: "Unauthorized...",
    })
  }

  let timestamp = new Date()
  let username = authorization.split(":")[0]

  await sheets.spreadsheets.values
    .append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheet_name}!${left_range}:${right_range}`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        majorDimension: "ROWS",
        values: [
          [
            username,
            hashSync(password, 10), //hashed password
            hashSync(username + timestamp.toISOString(), 10), //hashed token
          ],
        ],
      },
    })
    .catch((e) => console.log(e))

  return NextResponse.json({ message: "Password reset..." })
}

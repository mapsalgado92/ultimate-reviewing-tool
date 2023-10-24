import { NextResponse } from "next/server"
import { google } from "googleapis"
import { get_google_auth, verify_login } from "../../utils"
import { hashSync } from "bcrypt"

export async function POST(req) {
  const body = await req.json()

  let sheet_name = "users"
  let left_range = "A"
  let right_range = "C"

  let username = body.username
  let password = body.password

  const auth = get_google_auth()
  const sheets = google.sheets({ version: "v4", auth: auth })

  const verified = await verify_login(sheets, username, password)

  if (!verified) {
    return NextResponse.json({
      message: "Unauthorized...",
      token: null,
    })
  }

  let timestamp = new Date()

  let hashed_password = hashSync(password, 10)
  let new_token = hashSync(username + timestamp.toISOString(), 10)

  sheets.spreadsheets.values
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
            hashed_password, //hashed password
            new_token, //hashed token
          ],
        ],
      },
    })
    .catch((e) => console.log(e))
  return NextResponse.json({ message: "Logged In...", token: new_token })
}

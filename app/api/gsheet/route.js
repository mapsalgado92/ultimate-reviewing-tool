import { NextResponse } from "next/server"
import { google } from "googleapis"

const get_auth = () => {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SA_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

export async function GET(req) {
  const params = req.nextUrl.searchParams

  let sheet_name = params.get("sheet")
  let left_range = params.get("left")
  let right_range = params.get("right")

  const auth = get_auth()
  const sheets = google.sheets({ version: "v4", auth: auth })

  const response = await sheets.spreadsheets.values
    .get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheet_name}!${left_range}:${right_range}`,
    })
    .catch((e) => console.log(e))
  return NextResponse.json({
    message: "Data Successfully Pulled",
    data: response.data.values,
  })
}

export async function POST(req) {
  const params = req.nextUrl.searchParams
  const body = await req.json()

  console.log(body)

  let sheet_name = params.get("sheet")
  let left_range = params.get("left")
  let right_range = params.get("right")

  let data = body.data

  const auth = get_auth()
  const sheets = google.sheets({ version: "v4", auth: auth })

  const response = await sheets.spreadsheets.values
    .append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheet_name}!${left_range}:${right_range}`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        majorDimension: "ROWS",
        values: data.map((d) => [new Date(), d.ticket_id, JSON.stringify(d)]),
      },
    })
    .catch((e) => console.log(e))
  return NextResponse.json({ message: "Nice...", response: response })
}

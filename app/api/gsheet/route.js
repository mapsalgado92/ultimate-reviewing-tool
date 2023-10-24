import { NextResponse } from "next/server"
import { verify_app_auth, get_google_auth } from "../utils"
import { google } from "googleapis"

export async function GET(req) {
  const params = req.nextUrl.searchParams
  const authorization = req.headers.get("authorization")

  let sheet_name = params.get("sheet")
  let left_range = params.get("left")
  let right_range = params.get("right")

  const auth = get_google_auth()
  const sheets = google.sheets({ version: "v4", auth: auth })

  const verified = authorization
    ? await verify_app_auth(sheets, authorization)
    : false

  if (!verified) {
    return NextResponse.json({
      message: "Unauthorized...",
      data: [],
    })
  }

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
  const authorization = req.headers.get("authorization")

  let sheet_name = params.get("sheet")
  let left_range = params.get("left")
  let right_range = params.get("right")

  let data = body.data

  const auth = get_google_auth()
  const sheets = google.sheets({ version: "v4", auth: auth })

  const verified = authorization
    ? await verify_app_auth(sheets, authorization)
    : false

  if (!verified) {
    return NextResponse.json({
      message: "Unauthorized...",
      data: [],
    })
  }

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

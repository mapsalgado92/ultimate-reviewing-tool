import { compareSync } from "bcrypt"
import { google } from "googleapis"

export const get_google_auth = () => {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SA_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

export const verify_app_auth = async (gsheet, authorization) => {
  let [username, token] = authorization.split(":")

  console.log(authorization)

  let response = await gsheet.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `users!A:C`,
  })

  let user = response.data.values.reverse().find((u) => u[0] === username)

  console.log("USER", user)

  if (!user) return false

  let user_token = user[2]
  console.log("USER_TOKEN", user_token)
  console.log("TOKEN", token)
  return token === user_token
}

export const verify_login = async (gsheet, username, password) => {
  let response = await gsheet.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `users!A:C`,
  })

  let user = response.data.values.reverse().find((u) => u[0] === username)

  if (!user) return false

  let hashed_password = user[1]
  let verified = compareSync(password, hashed_password)

  return verified
}

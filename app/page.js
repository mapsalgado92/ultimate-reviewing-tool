"use client"
import { useAuth } from "@/contexts/authContext"
import Link from "next/link"
import { useState } from "react"

const Home = () => {
  const auth = useAuth()
  const [state, setState] = useState({
    username: "",
    password: "",
    new_password: "",
  })

  return (
    <main className="container">
      <h1 className="title has-text-centered mt-5">Reviewing Tool</h1>
      <div className="columns is-centered">
        <div className="column box is-5">
          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              placeholder="username"
              value={state.username}
              disabled={auth.logged}
              onChange={(e) => setState({ ...state, username: e.target.value })}
            ></input>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="password"
              value={state.password}
              disabled={auth.logged}
              onChange={(e) => setState({ ...state, password: e.target.value })}
            ></input>
          </div>
          {auth.logged && (
            <div className="field has-addons ">
              <div className="control is-expanded">
                <input
                  className="input"
                  type="password"
                  placeholder="new password"
                  value={state.new_password}
                  onChange={(e) =>
                    setState({ ...state, new_password: e.target.value })
                  }
                ></input>
              </div>
              <div className="control">
                <button
                  className="button is-warning is-outlined"
                  type="button"
                  onClick={() => {
                    auth.reset_password(state.new_password)
                    setState({ ...state, password: "", new_password: "" })
                  }}
                  disabled={state.new_password.length < 7}
                >
                  Reset Password?
                </button>
              </div>
            </div>
          )}

          <br></br>
          <div className="field">
            {!auth.logged ? (
              <button
                className="button is-fullwidth is-success is-outlined"
                type="button"
                disabled={
                  state.password === "" || state.username === "" || auth.logged
                }
                onClick={() => auth.login(state.username, state.password)}
              >
                Login
              </button>
            ) : (
              <>
                <button
                  className="button is-fullwidth is-danger is-outlined"
                  type="button"
                  onClick={() => auth.logout()}
                >
                  Logout
                </button>
                <br></br>
                <p className="text has-text-centered">
                  Logged in successfully, select your LOB
                </p>
              </>
            )}
          </div>
          <br></br>
          <div className="field columns">
            <div className="column is-half">
              <Link href="/tool?lob=retail" className="control">
                <button
                  className="button is-fullwidth is-info is-light"
                  disabled={!auth.logged}
                >
                  Retail
                </button>
              </Link>
            </div>

            <div className="column is-half">
              <Link href="/tool?lob=business" className="control">
                <button
                  className="button is-fullwidth is-info is-light"
                  disabled={!auth.logged}
                >
                  Business
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <br></br>
    </main>
  )
}

export default Home

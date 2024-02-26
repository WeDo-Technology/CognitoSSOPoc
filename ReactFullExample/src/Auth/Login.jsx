import { useState, useContext } from "react"
import { AuthContext } from "./AuthContext"
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { user, signIn } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await signIn(username, password)

    } catch (err) {
      setError(err.message)
    }
  }
  // If the user is logged in, don't show the login form
  if (user) {
    // Redirect to the profile page
    return <Navigate to="/profile" />
  }

  return (
    <div className="flex flex-col">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col m-6 gap-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-white/0 text-slate-900 ring-1 ring-slate-900/10 hover:bg-white/25 hover:ring-slate-900/15 ">Login</button>
      </form>
      {error && <p>{error}</p>}
      <Link to="/forgot-password">Forgot Password</Link>
    </div>
  )
}

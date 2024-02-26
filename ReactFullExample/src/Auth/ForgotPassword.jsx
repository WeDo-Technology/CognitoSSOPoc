import { useState } from "react"
import { forgotPassword } from "./auth"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await forgotPassword(username)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (success) {
    return (
      <div>
        <h2>Reset password</h2>
        <p>
          Check your email for the confirmation code to reset your password.
        </p>
        <Link to="/reset-password">Reset Password</Link>
      </div>
    )
  }

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col m-6 gap-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-white/0 text-slate-900 ring-1 ring-slate-900/10 hover:bg-white/25 hover:ring-slate-900/15 ">Submit</button>
      </form>
      {error && <p>{error}</p>}
      <Link to="/login">Sign In</Link>
    </div>
  )
}

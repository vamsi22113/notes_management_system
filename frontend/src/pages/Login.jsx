import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAPI } from "../services/api.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await loginAPI({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

        .login-page {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .login-box {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .login-logo {
          text-align: center;
          margin-bottom: 24px;
        }

        .login-logo .icon {
          font-size: 30px;
          display: block;
          margin-bottom: 8px;
        }

        .login-logo h1 {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .login-logo p {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
        }

        .divider {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 20px 0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
        }

        .form-group input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .error-msg {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .btn-submit {
          width: 100%;
          padding: 11px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 4px;
        }

        .btn-submit:hover { background: #1d4ed8; }
        .btn-submit:disabled { background: #93c5fd; cursor: not-allowed; }

        .login-footer {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin-top: 20px;
        }

        .login-footer a {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
        }

        .login-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">
            <span className="icon">📝</span>
            <h1>Notes Manager</h1>
            <p>Sign in to access your notes</p>
          </div>

          <hr className="divider" />

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/register">Create one account</Link>
          </p>
        </div>
      </div>
    </>
  );
}

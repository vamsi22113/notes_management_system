import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerAPI } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await registerAPI({ name, email, password, confirmpassword: confirmPassword });
      alert(res.message || "Account created successfully!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

        .register-page {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .register-box {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 40px 36px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .register-logo {
          text-align: center;
          margin-bottom: 24px;
        }

        .register-logo .icon {
          font-size: 30px;
          display: block;
          margin-bottom: 8px;
        }

        .register-logo h1 {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .register-logo p {
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
          margin-bottom: 14px;
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

        .pw-hint {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .error-msg {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 13px;
          margin-bottom: 14px;
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
          margin-top: 6px;
        }

        .btn-submit:hover { background: #1d4ed8; }
        .btn-submit:disabled { background: #93c5fd; cursor: not-allowed; }

        .register-footer {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin-top: 20px;
        }

        .register-footer a {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
        }

        .register-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="register-page">
        <div className="register-box">
          <div className="register-logo">
            <span className="icon">📝</span>
            <h1>Create your account</h1>
            <p>Start managing your notes today</p>
          </div>

          <hr className="divider" />

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <p className="pw-hint">Must be at least 6 characters.</p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="register-footer">
            Already have an account?{" "}
            <Link to="/">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
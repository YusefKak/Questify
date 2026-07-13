import { useState } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

import { auth, db } from "../firebase";

function cleanUsername(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
}

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedUsername = cleanUsername(username);

    if (normalizedUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Firebase Auth expects an email, so we generate an internal one.
      const internalEmail = `${normalizedUsername}@questify.app`;

      const credential = await createUserWithEmailAndPassword(
        auth,
        internalEmail,
        password
      );

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        username: normalizedUsername,

        xp: 0,
        level: 1,
        questsCompleted: 0,
        streak: 0,

        settings: {
          difficulty: "medium",
          dailyQuestGoal: 3,
          soundEnabled: true,
          notificationsEnabled: true,
        },

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate("/");
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Signup failed.";

      if (message.includes("email-already-in-use")) {
        setError("That username is already taken.");
      } else {
        setError("Could not create your account.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Create Account</h1>
        <p>Start completing quests and earning XP.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="rohan123"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </section>
    </main>
  );
}
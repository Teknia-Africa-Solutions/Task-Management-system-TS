import { useEffect, useState } from "react";
import "./styles/tokens.css";
import "./App.css";

function App() {
  const [apiStatus, setApiStatus] = useState("Checking API...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(data.ok ? "API is running." : "API responded unexpectedly.");
      })
      .catch(() => {
        setApiStatus("API is not reachable. Start the backend on port 3000.");
      });
  }, []);

  return (
    <main className="app">
      <section className="card">
        <h1 className="brand">
          Tekniafrica <span>SOLUTIONS</span>
        </h1>
        <p className="lead">Task Management System</p>
        <div className="actions">
          <button type="button" className="btn btn-primary">
            Primary action
          </button>
          <button type="button" className="btn btn-accent">
            Secondary action
          </button>
        </div>
        <p className={`status${apiStatus.includes("not reachable") ? " error" : ""}`}>
          {apiStatus}
        </p>
      </section>
    </main>
  );
}

export default App;

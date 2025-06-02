import { useState } from "react";
import Container from "../components/Container";

export default function Dashboard() {
    const [stats, setStats] = useState({})



    return (
            <div className="p-6 grid grid-cols-4 grid-rows-3 gap-5 text-white">
      {/* Welcome Section */}
      <Container title="Welcome to Observo" className="col-span-4">
          <p className="text-zinc-400">
            Observo is your unified panel for managing and monitoring Dripcord-based Discord bots in real time.
            Track performance, analyze command usage, catch errors, and streamline your bot operations — all from one sleek interface.
          </p>
          <button className="mt-2">Get Started</button>

      </Container>

      {/* Visualization Examples */}
      <Container title="Visualization Examples">
        <ul className="list-disc list-inside text-zinc-300">
          <li>Command Usage Timeline</li>
          <li>Error Rate Graph</li>
          <li>Guild Heatmap</li>
          <li>Uptime Timeline</li>
          <li>Response Time Histogram</li>
        </ul>
      </Container>

      {/* Data Sources */}
      <Container title="Data Source Examples">
        <ul className="list-disc list-inside text-zinc-300">
          <li>Dripcord Internal API</li>
          <li>Bot Event Streams (WebSocket)</li>
          <li>Database Queries</li>
          <li>Discord API Integration</li>
        </ul>
      </Container>

      {/* Use Cases */}
      <Container title="Use Case Examples">
        <ul className="list-disc list-inside text-zinc-300">
          <li>Live Bot Dashboard</li>
          <li>Command Optimization Panel</li>
          <li>Guild Analytics Overview</li>
          <li>Error Watchdog</li>
          <li>Shard Monitor</li>
        </ul>
      </Container>

      {/* Upcoming Features */}
      <Container title="Upcoming Features" className="col-span-4">
        <ul className="list-disc list-inside text-zinc-300">
          <li>User Plugins – extend Observo with custom widgets</li>
          <li>Alerts / Webhooks – auto notifications on state changes</li>
          <li>Developer Mode – experimental features toggle</li>
          <li>Bot Controls – restart, reload, maintenance toggle</li>
        </ul>
      </Container>
    </div>
    );
}

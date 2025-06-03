import { CircleStop, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Console() {
  const [filter, setFilter] = useState("all");
  const logEndRef = useRef<HTMLDivElement>(null);


  const logs = [
    { level: "info", timestamp: "2025-06-02T12:01:22Z", message: "Bot started successfully." },
    { level: "info", timestamp: "2025-06-02T12:01:25Z", message: "Connected to 128 guilds." },
    { level: "info", timestamp: "2025-06-02T12:01:30Z", message: "Listening for events..." },
    { level: "debug", timestamp: "2025-06-02T12:02:01Z", message: "Command /ping used by @User in #general" },
    { level: "debug", timestamp: "2025-06-02T12:02:02Z", message: "Responded in 134ms" },
    { level: "warn", timestamp: "2025-06-02T12:03:14Z", message: "API latency spike detected (312ms)" },
    { level: "debug", timestamp: "2025-06-02T12:03:32Z", message: "Command /stats used by @Admin in #bot-logs" },
    { level: "info", timestamp: "2025-06-02T12:03:34Z", message: "Stats returned for 128 guilds, 5 shards" },
    { level: "error", timestamp: "2025-06-02T12:04:10Z", message: "Failed to fetch user data." },
    { level: "warn", timestamp: "2025-06-02T12:04:42Z", message: "Shard 2 disconnected unexpectedly." },
    { level: "warn", timestamp: "2025-06-02T12:03:14Z", message: "API latency spike detected (312ms)" }
  ];
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === "all" || log.level === filter;
    return matchesFilter;
  });

  useEffect(() => {
  logEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [filteredLogs]);

  return (
      <section className="m-4 p-4 bg-zinc-900 rounded-2xl flex flex-col overflow-hidden relative">
        <div className="w-full flex justify-between mb-4 items-center gap-5">
          <h1 className="text-xl font-bold">Console</h1>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-zinc-800 text-white p-2 rounded-xl"
            >
              <option value="all">All</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>
            <button className="px-6 py-2 bg-blue-600 text-xl font-medium rounded-xl flex items-center gap-2"><RotateCcw size={20}/> Restart</button>
            <button className="px-6 py-2 bg-red-600 text-xl font-medium rounded-xl flex items-center gap-2"><CircleStop size={20}/>Stop</button>
          </div>
        </div>
        <div className="bg-black font-mono text-sm rounded-md overflow-hidden">
          <div className="p-4 overflow-y-scroll relative max-h-[60vh]" id="console">
            {filteredLogs.map((log, index) => (
            <Log key={index} level={log.level} timestamp={log.timestamp} message={log.message} />
          ))}
            <div ref={logEndRef} />
          </div>
          <form>
            <input
              type="text"
              className="w-full mb-0 bg-zinc-800 text-white p-2 outline-none"
              placeholder="Enter server command..."
           />
          </form>
        </div>
      </section>
  );
}

function Log({ level, timestamp, message }) {
  const levelColor = {
    info: "text-blue-400",
    debug: "text-gray-400",
    warn: "text-yellow-400",
    error: "text-red-500"
  }[level] || "text-green-400";

  return (
    <p className={levelColor}>
      [{new Date(timestamp).toLocaleTimeString()}] [{level.toUpperCase()}] {message}
    </p>
  );
}
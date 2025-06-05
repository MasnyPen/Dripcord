import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar"
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"
import Container from '../components/Container'
import { useState } from "react"

export default function Metrics() {
    /*
        TODO:
        Eventy na sekundę (np. messageCreate, guildMemberAdd, itp.)
        Najczęściej wywoływane komendy
        Wykres komend z podziałem na typ (slash, prefix)
        Ilość shardów / ich stan (jeśli używany sharding)
    */
    const [resourcesStats, setResourcesStats] = useState({cpuUsage: 52, totalCpus: 2, memoryUsage: 60, usedMemory: 150, totalMemory: 370})

    const [latency, setLatency] = useState([
      { timestamp: "2025-06-02T12:00:00Z", ping: 10 },
      { timestamp: "2025-06-02T13:00:00Z", ping: 200 },
      { timestamp: "2025-06-02T14:00:00Z", ping: 32 },
      { timestamp: "2025-06-02T15:00:00Z", ping: 115 },
      { timestamp: "2025-06-02T16:00:00Z", ping: 26 },
      { timestamp: "2025-06-02T17:00:00Z", ping: 82 },
    ])
  
    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-10 m-4">
            <Container title="CPU" className="">
                <CircularProgressbarWithChildren
                  value={resourcesStats.cpuUsage}
                  maxValue={100}
                  styles={buildStyles({
                    pathColor: "#4ade80",
                    trailColor: "#27272a",
                    strokeLinecap: "butt",
                  })}
                  className="mt-4"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{}%</div>
                    <div className="text-sm text-gray-400">CPU</div>
                    <div className="text-xs">{`of ${resourcesStats.totalCpus} CPUs`}</div>
                  </div>
                </CircularProgressbarWithChildren>
            </Container>
            <Container title="Skibidi" className="col-span-2">
                  <></>
            </Container>
            <Container title="Memory" className="">
              <CircularProgressbarWithChildren
                    value={resourcesStats.memoryUsage}
                    maxValue={100}
                    styles={buildStyles({
                      pathColor: "#60a5fa",
                      trailColor: "#27272a",
                      strokeLinecap: "butt",
                    })}
                    className="mt-4"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{resourcesStats.memoryUsage}%</div>
                      <div className="text-sm text-gray-400">Memory</div>
                      <div className="text-xs">{`${resourcesStats.usedMemory} GB of ${resourcesStats.totalMemory} GB`}</div>
                    </div>
                </CircularProgressbarWithChildren>
            </Container>
            <Container title="API Latency" className="col-span-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart width={500} height={300} data={latency}>
                      <XAxis dataKey="timestamp" />
                      <YAxis/>
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Line type="monotone" dataKey="ping" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                    </LineChart>
                  </ResponsiveContainer>
            </Container>
        </div>
    )
}
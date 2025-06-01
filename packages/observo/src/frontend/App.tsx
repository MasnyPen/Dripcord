import React, { useEffect, useState } from 'react';

function App() {
    const [metrics, setMetrics] = useState<{cpu: number; memory: number} | null>(null);

    useEffect(() => {
        fetch('/api/metrics')
            .then(res => res.json())
            .then(data => setMetrics(data));
    }, []);

    if (!metrics) return <div>Loading metrics...</div>;

    return (
        <div>
            <h1>Webpanel metryk</h1>
            <p>CPU: {metrics.cpu}%</p>
            <p>Memory: {metrics.memory}%</p>
        </div>
    );
}

export default App;

import express from 'express';
import path from 'path';
import { Logger } from 'dripcord'

export default function initObservo() {
    const app = express();
    const PORT = 3000;

    app.use('/static', express.static(path.join(__dirname, '../../public/build')));

    app.get('/', (_req, res) => {
        res.sendFile(path.join(__dirname, '../../public/index.html'));
    });

    app.get('/api/metrics', (_req, res) => {
        res.json({ cpu: process.cpuUsage(), memory: process.memoryUsage() });
    });

    app.listen(PORT, () => Logger.info(`Server running on http://localhost:${PORT}`));

}
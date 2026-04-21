import axios from 'axios';
import { performance } from 'perf_hooks';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CONCURRENT_REQUESTS = 10;
const TOTAL_REQUESTS = 50;

async function runBenchmark() {
    console.log(`Starting benchmark for ${BASE_URL}...`);
    console.log(`Concurrent: ${CONCURRENT_REQUESTS}, Total: ${TOTAL_REQUESTS}`);

    const results: number[] = [];
    const start = performance.now();

    for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENT_REQUESTS) {
        const batch = Array.from({ length: CONCURRENT_REQUESTS }).map(async () => {
            const singleStart = performance.now();
            try {
                await axios.get(`${BASE_URL}/api/health`);
                results.push(performance.now() - singleStart);
            } catch (err: any) {
                console.error(`Request failed: ${err.message}`);
            }
        });

        await Promise.all(batch);
    }

    const end = performance.now();
    const totalTime = end - start;
    const avgLatency = results.reduce((a, b) => a + b, 0) / results.length;

    console.log('\n--- Benchmark Results ---');
    console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`Successful Requests: ${results.length}`);
    console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`);
    console.log(`Requests Per Second: ${(results.length / (totalTime / 1000)).toFixed(2)}`);
}

runBenchmark().catch(err => {
    console.error('Benchmark failed:', err);
    process.exit(1);
});

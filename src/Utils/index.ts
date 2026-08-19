import { Metrics } from "@/types";

export function formatTime(millis: number): string {
    return new Date(millis).toTimeString().slice(0, 8);
}

export function levelColor(level: string): string {
    switch (level) {
        case "ERROR":
            return "#f87171";
        case "WARN":
            return "#facc15";
        case "INFO":
            return "#5eead4";
        default:
            return "#9fb3ae";
    }
}
export const TIME_RANGES = [
    { label: '1H', value: '-1h' },
    { label: '6H', value: '-6h' },
    { label: '24H', value: '-24h' },
    { label: '7D', value: '-7d' },
] as const;
export function buildTrendOption(metrics: Metrics[]) {
    const timestamps = metrics.map((m) =>
        new Date(m.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    );
    const cpuData = metrics.map((m) => Number((m.cpu ?? 0).toFixed(2)));
    const ramData = metrics.map((m) => Number((m.ram ?? 0).toFixed(2)));

    return {
        tooltip: { trigger: 'axis' },
        legend: { data: ['CPU %', 'RAM %'] },
        grid: { left: 40, right: 20, top: 40, bottom: 40 },
        xAxis: { type: 'category', data: timestamps, boundaryGap: false },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
        series: [
            {
                name: 'CPU %',
                type: 'line',
                data: cpuData,
                smooth: true,
                showSymbol: false,
                lineStyle: { color: '#1976d2', width: 2 },
                itemStyle: { color: '#1976d2' },
            },
            {
                name: 'RAM %',
                type: 'line',
                data: ramData,
                smooth: true,
                showSymbol: false,
                lineStyle: { color: '#2e7d32', width: 2 },
                itemStyle: { color: '#2e7d32' },
            },
        ],
    };
}

export function buildGaugeOption(currentCpu: number, currentRam: number) {
    const baseGauge = {
        type: 'gauge' as const,
        min: 0,
        max: 100,
        radius: '90%',
        progress: { show: true, width: 10 },
        axisLine: { lineStyle: { width: 10 } },
        axisTick: { show: false },
        splitLine: { length: 8 },
        axisLabel: { fontSize: 10 },
        pointer: { width: 3 },
        title: { fontSize: 13, offsetCenter: [0, '70%'] },
        detail: {
            valueAnimation: true,
            formatter: '{value}%',
            fontSize: 18,
            offsetCenter: [0, '95%'],
        },
    };

    return {
        series: [
            {
                ...baseGauge,
                name: 'CPU %',
                center: ['25%', '55%'],
                itemStyle: { color: '#1976d2' },
                data: [{ value: currentCpu, name: 'CPU' }],
            },
            {
                ...baseGauge,
                name: 'RAM %',
                center: ['75%', '55%'],
                itemStyle: { color: '#2e7d32' },
                data: [{ value: currentRam, name: 'RAM' }],
            },
        ],
    };
}

export function buildStatsOption(metrics: Metrics[]) {
    const cpuVals = metrics.map((m) => m.cpu ?? 0);
    const ramVals = metrics.map((m) => m.ram ?? 0);

    const stats = (vals: number[]) => ({
        min: Number(Math.min(...vals).toFixed(2)),
        avg: Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)),
        max: Number(Math.max(...vals).toFixed(2)),
    });

    const cpuStats = stats(cpuVals);
    const ramStats = stats(ramVals);

    return {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['CPU %', 'RAM %'] },
        grid: { left: 40, right: 20, top: 40, bottom: 30 },
        xAxis: { type: 'category', data: ['Min', 'Avg', 'Max'] },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
        series: [
            {
                name: 'CPU %',
                type: 'bar',
                data: [cpuStats.min, cpuStats.avg, cpuStats.max],
                itemStyle: { color: '#1976d2', borderRadius: [4, 4, 0, 0] },
                barGap: '10%',
            },
            {
                name: 'RAM %',
                type: 'bar',
                data: [ramStats.min, ramStats.avg, ramStats.max],
                itemStyle: { color: '#2e7d32', borderRadius: [4, 4, 0, 0] },
            },
        ],
    };
}


export const  buildDistributionOption=(metrics: Metrics[]) => {
    // Bucket CPU readings into ranges to show usage distribution
    const buckets = [
        { label: '0-20%', min: 0, max: 20 },
        { label: '20-40%', min: 20, max: 40 },
        { label: '40-60%', min: 40, max: 60 },
        { label: '60-80%', min: 60, max: 80 },
        { label: '80-100%', min: 80, max: 100 },
    ];

    const counts = buckets.map(
        (b) => metrics.filter((m) => (m.cpu ?? 0) >= b.min && (m.cpu ?? 0) < b.max).length
    );

    return {
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series: [
            {
                name: 'CPU Distribution',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                label: { show: false },
                emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
                data: buckets.map((b, i) => ({ name: b.label, value: counts[i] })),
            },
        ],
    };
}
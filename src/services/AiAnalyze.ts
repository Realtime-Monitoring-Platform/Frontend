import { api } from "./api";

export const getAnalyzeBYdEVICEiD = async (deviceId: string): Promise<any> => {
    try {
       // api/v1/query/ai-analyses/device/3b1ae99f-dcab-4f31-9008-1af83dbcffe0
        const response = await api.get(`/query/ai-analyses/device/${deviceId}`);
        console.log("getAnalyzeBYdEVICEiD response:", response.request.responseURL);
        return response.data;
    } catch (error) {
        throw new Error('Failed to get analyze result');
    }
}


export const getAnalyzebyTenantId = async (tenantId: string): Promise<any> => {
    try {
        const response = await api.get(`/query/ai-analyses/tenant/${tenantId}`);
        console.log("getAnalyzebyTenantId response:", response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to get analyze result');
    }
}


//http://localhost:8222/api/v1/query/ai-analyses/device/
//http://localhost:8222/api/v1/query/ai-analyses/device/
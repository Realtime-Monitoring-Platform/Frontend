import { AiIncident, Pagination, User } from "@/types";
import { api } from "./api";

export const getAnalyzeBYdEVICEiD = async (deviceId: string, page = 0, size = 10): Promise<Pagination<AiIncident>> => {
    try {
        // api/v1/query/ai-analyses/device/3b1ae99f-dcab-4f31-9008-1af83dbcffe0
        const response = await api.get(`/query/ai-analyses/device/${deviceId}?page=${page}&size=${size}`);
        console.log("getAnalyzeBYdEVICEiD response:", response.request.responseURL);
        return response.data;
    } catch (error) {
        throw new Error('Failed to get analyze result');
    }
}


export const getAnalyzebyTenantId = async (tenantId: string, page = 0, size = 10): Promise<Pagination<AiIncident>> => {
    try {
        const response = await api.get(`/query/ai-analyses/tenant/${tenantId}?page=${page}&size=${size}`);
        console.log("getAnalyzebyTenantId response:", response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to get analyze result');
    }
}


export const updateAiRecommendationStatus = async (request: {
    incidentId: string;
    priority: number;
    command: string;
    status: 'APPROVED' | 'SENT' | 'COMPLETED' | 'FAILED';
}): Promise<AiIncident> => {
    const response = await api.patch(
        `/query/ai-analyses/${request.incidentId}/recommendations/${request.priority}/status`,
        {
            command: request.command,
            status: request.status,
        },
    );
    return response.data;
};

export const approveAiCommand = async (request: {
    incidentId: string;
    deviceId: string;
    tenantId: string;
    recommendationPriority: number;
    command: string;
    requestedBy: string;
}): Promise<{ status: 'APPROVED' | 'REJECTED'; command: string; commandId?: string; reason?: string }> => {
    const response = await api.post('/ai/commands/approve', request);
    console.log(request)
    return response.data;
};


//http://localhost:8222/api/v1/query/ai-analyses/device/
//http://localhost:8222/api/v1/query/ai-analyses/device/
import { Pagination, Device, createDeviceDto, DeviceResponse, DeviceCommand, MetricsSnapshot } from "@/types";
import { api } from "./api";


///tenant/{tenantId}


// useEffect(() => {
//         fetchDevice();
//     }, [id, timeRange]);

//     const fetchDevice = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await api.get(`/query/metrics/deviceid/${id}?startTime=${timeRange}`);
//             setMetrics(response.data);
//         } catch (err) {
//             setError('Failed to load metrics details');
//         } finally {
//             setLoading(false);
//         }
//     };

export const fetchDeviceMetrics = async (deviceId: string, startTime: string): Promise<any> => {
    try {
        console.log("fetchDeviceMetrics called with deviceId:", deviceId, "startTime:", startTime);
        const response = await api.get(`/query/metrics/deviceid/${deviceId}?startTime=${startTime}`);
        console.log("fetchDeviceMetrics response:", response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch device metrics');
    }
};

/**
 * Latest reading of a device: cpu/ram, memory breakdown, disks and network interfaces.
 * Returns `null` when the device never reported any metric.
 */
export const fetchLatestDeviceMetrics = async (
    deviceId: string,
    startTime = '-24h'
): Promise<MetricsSnapshot | null> => {
    try {
        const response = await api.get(
            `/query/metrics/latest/deviceid/${deviceId}?startTime=${startTime}`
        );
        return response.data && typeof response.data === 'object' ? response.data : null;
    } catch (error) {
        throw new Error('Failed to fetch latest device metrics');
    }
};

export const getAllDeviceBytenanntId = async (tenantId:string,page = 0, size = 10): Promise<Pagination<Device>> =>{
    try {
        const response = await api.get(`/query/devices/tenant/${tenantId}?page=${page}&size=${size}`);
        console.log("tenant by tenantId:", tenantId);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch devices');
    }
}

export const getAllDevices = async (page = 0, size = 10): Promise<Pagination<Device>> =>{
    try {
        const response = await api.get(`/query/devices?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch devices');
    }
}

export const createDevice = async (data: Partial<createDeviceDto>): Promise<DeviceResponse> => {
    try {
        const response = await api.post('/devices', data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create device');
    }
};

export const getDeviceById = async (id: string): Promise<Device> => {
    try {
        const response = await api.get(`/query/devices/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch device');
    }   }

    
export const updateDevice = async (id: string, data: Partial<Device>): Promise<Device> => {
    try {
        const response = await api.put(`/devices/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update device');
    }
};

export const deleteDevice = async (id: string): Promise<void> => {
    try {
        await api.delete(`/devices/${id}`);
    } catch (error) {
        throw new Error('Failed to delete device');
    }
};

export const getDeviceCommandHistory = async (deviceId: string, page = 0, size = 10): Promise<Pagination<DeviceCommand>> => {
    const response = await api.get(`/devices/${deviceId}/commands/history?page=${page}&size=${size}`);
    return response.data;
};
import apiClient from './apiClient';

export const getGasRequests = async (page, pageSize = 3, userId) => {
    try {
        const response = await apiClient.get('/api/request/gas/requests', {
            params: { page, pageSize, userId }
        });
        return response.data;
    } catch (error) {
        console.error('Get gas requests error:', error.response?.data || error.message);
        throw error;
    }
};

export const getOutlets = async () => {
    try {
        const response = await apiClient.get('/api/outlet');
        return response.data;
    } catch (error) {
        console.error('Get outlets error:', error.response?.data || error.message);
        throw error;
    }
};

export const getGasTypes = async (category = 'Domestic') => {
    try {
        const response = await apiClient.get('/api/gas-types', {
            params: { gas_category: category }
        });
        return response.data;
    } catch (error) {
        console.error('Get gas types error:', error.response?.data || error.message);
        throw error;
    }
};

export const submitGasRequest = async (requestData) => {
    try {
        const response = await apiClient.post('/api/request/gas', requestData);
        return response.data;
    } catch (error) {
        console.error('Submit request error:', error.response?.data || error.message);
        throw error;
    }
};

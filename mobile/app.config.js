require('dotenv').config();

export default {
    expo: {
        plugins: [
            "expo-secure-store",
        ],
        extra: {
            apiBaseUrl: process.env.API_BASE_URL,
        },
    },
};

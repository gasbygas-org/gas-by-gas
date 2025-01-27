require('dotenv').config();

export default {
    expo: {
        plugins: [
            "expo-secure-store",
        ],
        extra: {
            serverUrl: process.env.SERVER_URL,
            clientUrl: process.env.CLIENT_URL,
            mobileUrl: process.env.MOBILE_URL,
        },
    },
};

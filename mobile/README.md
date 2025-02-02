## GasByGas Mobile
This mobile application is built using React Native. It provides a platform for users to manage gas requests and authentication.

## Setup
1. Install dependencies: `npm install`
2. Create a `.env` file (see `.env.example`) and define the necessary environment variables.
3. Run: `npx expo start`

## Auth Flow
- Tokens are stored securely using `expo-secure-store`, which ensures that sensitive information is not exposed.
- API calls are routed through `services/auth.js`.

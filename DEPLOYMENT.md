# Deployment Guide

This guide describes how to deploy the Emergency Response Coordination Dashboard explicitly on Vercel.

## Prerequisites
- A [Vercel](https://vercel.com) account.
- GitHub repository connected to Vercel.

## 1. Backend Deployment (Server)

Since Vercel Serverless functions have limitations with WebSockets (Socket.io), this configuration sets up the Express app as a serverless function. **Note:** Real-time features might be less reliable than on a VPS or container service (like Render/Railway).

1.  Log in to Vercel and click **"Add New..."** -> **"Project"**.
2.  Import your `emergency-dashboard` repository.
3.  **Configure Project:**
    - **Project Name:** `emergency-dashboard-server` (or similar)
    - **Root Directory:** Edit execution directory to `server`.
    - **Framework Preset:** Select "Other".
    - **Build Command:** `npm install` (or leave default if it detects package.json).
    - **Output Directory:** Leave default.
4.  **Environment Variables:**
    Add the following variables in the Vercel dashboard:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
        - [Get MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
        - **Important:** Go to *Network Access* in Atlas and add IP `0.0.0.0/0` (Allow Access from Anywhere) so Vercel can connect.
    - `OPENAI_API_KEY`: Your OpenAI API Key.
        - [Get OpenAI API Key](https://platform.openai.com/api-keys)
5.  Click **Deploy**.
6.  **Copy the Domain**: Once deployed, copy the assigned domain (e.g., `https://emergency-dashboard-server.vercel.app`).

## 2. Frontend Deployment (Client)

1.  Go back to Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Import the **same** `emergency-dashboard` repository again.
3.  **Configure Project:**
    - **Project Name:** `emergency-dashboard-client`
    - **Root Directory:** Edit execution directory to `client`.
    - **Framework Preset:** Vite (should Auto-detect).
4.  **Environment Variables:**
    - `VITE_API_URL`: Paste the backend URL from step 1 (e.g., `https://emergency-dashboard-server.vercel.app/api`).
5.  Click **Deploy**.

## Troubleshooting
- **CORS Issues**: If the frontend cannot talk to the backend, ensure the backend `cors` configuration allows the frontend domain. You might need to update `server/index.js` to explicitly allow the Vercel frontend domain if default `cors()` (wildcard) is restrictive in production (though usually wildcard works for public APIs).
- **Socket.io**: If real-time updates fail, consider deploying the server to **Render** or **Railway** which support long-running processes, instead of Vercel Serverless.

# Deployment Guide

This guide describes how to deploy the Emergency Response Coordination Dashboard.
**Architecture:**
- **Frontend**: Deployed on **Vercel** (Static Site / SPA).
- **Backend**: Deployed on **Render** (Web Service) to support long-running processes (Socket.io).

## Prerequisites
- GitHub repository connected to both Vercel and Render.
- Accounts on [Vercel](https://vercel.com) and [Render](https://render.com).

## 1. Backend Deployment (Render)

We use Render for the backend because it supports persistent connections required for real-time features.

1.  Log in to [Render](https://dashboard.render.com/) and click **"New +"** -> **"Web Service"**.
2.  Connect your `emergency-dashboard` repository.
3.  **Configure Service:**
    - **Name:** `emergency-dashboard-server`
    - **Root Directory:** `server` (Important!)
    - **Environment:** `Node`
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
    - **Plan:** Free (or as needed)
4.  **Environment Variables:**
    Scroll down to "Environment Variables" and add:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
        - [Get MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
        - **Important:** Whitelist IP `0.0.0.0/0` in Atlas Network Access.
    - `OPENAI_API_KEY`: Your OpenAI API Key.
        - [Get OpenAI API Key](https://platform.openai.com/api-keys)
    - `PORT`: `10000` (Render default) or `5000` (Optional, Render assigns one automatically).
5.  Click **Create Web Service**.
6.  **Copy the URL**: Once deployed, copy the service URL (e.g., `https://emergency-dashboard-server.onrender.com`).

## 2. Frontend Deployment (Vercel)

1.  Log in to [Vercel](https://vercel.com) and click **"Add New..."** -> **"Project"**.
2.  Import the **same** `emergency-dashboard` repository.
3.  **Configure Project:**
    - **Project Name:** `emergency-dashboard-client`
    - **Root Directory:** Edit execution directory to `client`.
    - **Framework Preset:** Vite (should Auto-detect).
4.  **Environment Variables:**
    - `VITE_API_URL`: Paste the **Render Backend URL** from Step 1 (e.g., `https://emergency-dashboard-server.onrender.com/api`).
      *Note: Ensure you include `/api` at the end if your backend routes are prefixed with it.*
5.  Click **Deploy**.

## Troubleshooting
- **CORS Issues**: If the frontend cannot talk to the backend, check the browser console. You may need to verify the Render backend is running and the URL in Vercel is correct (handling `https`).
- **Socket Connection**: If the map/incidents don't update in real-time, ensure the backend is not sleeping (Render Free tier spins down after inactivity) and that the socket client is using the same `VITE_API_URL`.

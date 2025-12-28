# Emergency Response Coordination Dashboard

A real-time dashboard for coordinating emergency response units and managing incidents. This application provides a live view of incident locations, unit status, and key metrics to aid dispatchers in decision-making.

## Features

- **Live Map**: Visualization of incidents and response units on an interactive map.
- **Real-time Updates**: Instant status updates for units (Available, Busy, En Route) and incidents.
- **Incident Management**: List view of active incidents with priority and status tracking.
- **Analytics**: Key performance metrics including average response time and incident resolution rates.
- **Dispatch Simulation**: Tools to simulate incident creation and unit dispatch for testing and training.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.io
- **Database**: MongoDB (Simulation/Mock data currently used)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Manish-022/emergency-dashboard.git
    cd emergency-dashboard
    ```

2.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd ../server
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    Navigate to the `server` directory and run:
    ```bash
    npm start
    ```
    The server typically runs on `http://localhost:3000` (or the port defined in `.env`).

2.  **Start the Frontend Client:**
    Navigate to the `client` directory and run:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (default Vite port).

## Project Structure

- `client/`: React frontend application.
- `server/`: Node.js/Express backend API and socket server.

## License

[MIT](LICENSE)

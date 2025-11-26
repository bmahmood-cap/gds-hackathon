# Signify - Early Homelessness Prevention

A modern web application for local council employees to identify and prevent youth homelessness through relationship mapping and early intervention. Features a React frontend, .NET API backend, and AWS Bedrock integration for AI-powered insights.

## 🚀 Features

- **Dashboard**: View and manage at-risk individuals in your caseload
- **Relationships Map**: Visualise relationships between individuals, families, and support workers
- **Individuals Network**: Interactive network graph showing connections and support networks
- **AI Assistant**: AWS Bedrock-powered AI for identifying risk factors and intervention opportunities
- **Data Upload**: Import case data into the system (coming soon)

## 🎯 Use Cases

Signify helps local council employees:
- Identify young people at risk of homelessness
- Map support networks around at-risk individuals
- Track relationships between families, social workers, and housing officers
- Discover early intervention opportunities
- Collaborate across agencies on complex cases

## 🛠️ Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for fast development and building
- React Router for navigation
- D3.js for network visualizations

### Backend
- .NET 10 Web API
- ASP.NET Core minimal APIs
- AWS Bedrock Runtime SDK for AI integration

## 📁 Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript type definitions
│   └── ...
├── backend/
│   └── CentralDataStore/    # .NET Web API project
│       ├── Controllers/     # API controllers
│       ├── Models/          # Data models
│       └── Services/        # Business logic services
└── README.md
```

## 🏃 Getting Started

### Prerequisites

- Node.js 20+ and npm
- .NET 10 SDK
- (Optional) AWS credentials for live Bedrock integration

### Running the Backend

```bash
cd backend/CentralDataStore
dotnet run
```

The API will start on `http://localhost:5050`

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## 📡 API Endpoints

### Data Store
- `GET /api/data` - Get all data items
- `GET /api/data/{id}` - Get specific data item
- `POST /api/data` - Create new data item
- `PUT /api/data/{id}` - Update data item
- `DELETE /api/data/{id}` - Delete data item

### People
- `GET /api/people` - Get all people
- `GET /api/people/{id}` - Get specific person
- `POST /api/people` - Create new person
- `PUT /api/people/{id}` - Update person
- `DELETE /api/people/{id}` - Delete person
- `GET /api/people/connections` - Get all connections
- `POST /api/people/connections` - Create new connection
- `GET /api/people/network` - Get network data for visualization

### AI (Bedrock)
- `POST /api/bedrock/invoke` - Invoke AI model
- `GET /api/bedrock/status` - Get connection status

## 🔧 Configuration

### AWS Bedrock

Configure AWS settings in `backend/CentralDataStore/appsettings.json`:

```json
{
  "AWS": {
    "Region": "us-east-1",
    "UseSimulated": true
  }
}
```

Set `UseSimulated` to `false` and configure AWS credentials to use live Bedrock service.

### Frontend API URL

Set the `VITE_API_URL` environment variable or update `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
```

## 👥 User Roles

Signify supports different user roles for local council employees:

- **Housing Officer**: Manage housing cases and at-risk individuals
- **Social Worker**: Support vulnerable children and families
- **Youth Worker**: Engage with young people at risk
- **Administrator**: Full system access

## 📸 Screenshots

The application features:
- A modern dark theme with gradient backgrounds
- Interactive network visualizations
- Responsive design for all screen sizes
- Real-time filtering and search capabilities

## 📝 License

MIT
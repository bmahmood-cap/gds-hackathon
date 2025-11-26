import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DataStorePage from './pages/DataStorePage';
import ConnectionsPage from './pages/ConnectionsPage';
import PeoplePage from './pages/PeoplePage';
import AIAssistantPage from './pages/AIAssistantPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DataStorePage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

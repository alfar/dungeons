import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SituationPage } from './components/SituationPage/SituationPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="jul24/" element={<SituationPage />} />
        <Route path="jul24/location/:id" element={<SituationPage />} />
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

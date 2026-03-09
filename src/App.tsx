import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { MapPage } from './pages/MapPage'
import { AddPlacePage } from './pages/AddPlacePage'
import { PlaceDetailPage } from './pages/PlaceDetailPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/add" element={<AddPlacePage />} />
            <Route path="/place/:id" element={<PlaceDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

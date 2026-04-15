import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import SharedLayout from "./Layouts/SharedLayout/SharedLayout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register/Register";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase oturum durumunu dinler
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <Routes>
      {/* Giriş sayfası: Eğer kullanıcı zaten giriş yapmışsa direkt dashboard'a atar */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
      />
      
      {/* Yetkili kullanıcı alanı [cite: 27, 28] */}
      {/* Giriş yapmamış kullanıcıyı (user === null) her zaman login'e fırlatır */}
      <Route 
        path="/" 
        element={user ? <SharedLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* Diğer özel rotalar [cite: 63, 64] */}
      </Route>
<Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
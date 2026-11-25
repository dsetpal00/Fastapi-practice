import { useAuth } from "./context/AuthContext.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import Board from "./pages/Board.jsx";

export default function App() {
  const { token } = useAuth();
  return token ? <Board /> : <AuthScreen />;
}

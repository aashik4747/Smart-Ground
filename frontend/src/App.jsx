import AppRoutes from "./routes";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./styles/animations.css";

const App = () => {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;

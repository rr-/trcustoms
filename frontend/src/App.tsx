import "./App.css";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import NavBar from "src/components/NavBar";
import GenreListPage from "src/components/pages/GenreListPage";
import LevelListPage from "src/components/pages/LevelListPage";
import LevelPage from "src/components/pages/LevelPage";
import LoginPage from "src/components/pages/LoginPage";
import LogoutPage from "src/components/pages/LogoutPage";
import RegisterPage from "src/components/pages/RegisterPage";
import TagListPage from "src/components/pages/TagListPage";
import UserEditPage from "src/components/pages/UserEditPage";
import UserListPage from "src/components/pages/UserListPage";
import UserPage from "src/components/pages/UserPage";
import ScrollToTop from "src/shared/components/ScrollToTop";
import { UserContextProvider } from "src/shared/contexts/UserContext";

function App() {
  return (
    <UserContextProvider>
      <ScrollToTop />
      <NavBar />
      <main id="Content" className="MainContainer">
        <Routes>
          <Route path="/" element={<LevelListPage />} />
          <Route path="/levels" element={<LevelListPage />} />
          <Route path="/levels/:levelId" element={<LevelPage />} />
          <Route path="/tags" element={<TagListPage />} />
          <Route path="/genres" element={<GenreListPage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users/:userId" element={<UserPage />} />
          <Route path="/users/:userId/edit" element={<UserEditPage />} />
        </Routes>
      </main>
    </UserContextProvider>
  );
}

export default App;

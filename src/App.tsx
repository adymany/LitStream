import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Watch } from "./pages/Watch";
import { Search } from "./pages/Search";
import { Trending } from "./pages/Trending";

export default function App() {
  return (
    <BrowserRouter>
      <div className="netflix-app">
        <Header />

        <main className="netflix-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/series" element={<Home />} />
            <Route path="/films" element={<Home />} />
            <Route path="/my-list" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

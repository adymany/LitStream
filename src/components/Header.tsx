import { Search, Bell, ChevronDown, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Series", path: "/series" },
    { label: "Films", path: "/films" },
    { label: "New & Popular", path: "/trending" },
    { label: "My List", path: "/my-list" },
  ];

  return (
    <header className={`netflix-header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        {/* Left Section - Logo & Nav */}
        <div className="header-left">
          <Link to="/" className="header-logo">
            <span className="logo-text">LITSTREAM</span>
          </Link>

          <nav className="header-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Nav Dropdown */}
          <div className="mobile-nav-trigger">
            <span>Browse</span>
            <ChevronDown className="dropdown-icon" />
          </div>
        </div>

        {/* Right Section - Search, Notifications, Profile */}
        <div className="header-right">
          {/* Search */}
          <div className={`header-search ${searchOpen ? "search-open" : ""}`}>
            {searchOpen ? (
              <form onSubmit={handleSearch} className="search-form">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="search-close"
                >
                  <X />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="header-icon-btn"
                aria-label="Search"
              >
                <Search />
              </button>
            )}
          </div>

          {/* Notifications */}
          <button className="header-icon-btn" aria-label="Notifications">
            <Bell />
          </button>

          {/* Profile */}
          <div className="header-profile">
            <div className="profile-avatar">
              <img
                src="https://occ-0-2484-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABfjwXqIYd3kCEU1KUSDG3bwi0nE9p2dfCj8Qvd_dIrjiYfCubrg2WlT7MmDeXopLjdcLV6WnNvK_-Kb3t6ipJ4GljDsaYPBU5g.png?r=a41"
                alt="Profile"
                className="profile-img"
              />
            </div>
            <ChevronDown className="profile-dropdown-icon" />
          </div>
        </div>
      </div>
    </header>
  );
}

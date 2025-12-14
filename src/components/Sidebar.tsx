import { Home, TrendingUp, Clock, ThumbsUp, Video, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: TrendingUp, label: "Trending", path: "/trending" },
    { icon: Clock, label: "History", path: "/history" },
    { icon: ThumbsUp, label: "Liked Videos", path: "/liked" },
    { icon: Video, label: "Your Videos", path: "/your-videos" },
  ];

  // On mobile: only show when isOpen is true
  // On desktop: always show, toggle between wide/narrow
  const sidebarWidth = isMobile ? 240 : (isOpen ? 240 : 80);

  if (isMobile && !isOpen) {
    // On mobile, when closed, return nothing (no sidebar, no spacer)
    return null;
  }

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobile && isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 64,
          height: 'calc(100vh - 4rem)',
          width: sidebarWidth,
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          transition: 'width 0.3s ease',
          overflowY: 'auto',
          zIndex: isMobile ? 50 : 40,
        }}
      >
        {/* Mobile close button */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: 8,
                borderRadius: '50%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Close menu"
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>
        )}

        <div style={{ paddingTop: isMobile ? 0 : 12, paddingBottom: 12 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (isMobile) {
                    onClose();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  padding: '12px 24px',
                  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
                  textDecoration: 'none',
                  color: isActive ? '#dc2626' : 'inherit',
                  transition: 'background-color 0.15s',
                }}
              >
                <Icon style={{ width: 24, height: 24, flexShrink: 0, color: isActive ? '#dc2626' : 'currentColor' }} />
                {(isMobile || isOpen) && (
                  <span>{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Subscriptions section - only show when sidebar is wide */}
        {(isMobile || isOpen) && (
          <div>
            <div style={{ borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />
            <div style={{ padding: '12px 24px' }}>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>Subscriptions</p>
              {["Tech Insights", "Cooking Masters", "Travel Vibes"].map((channel) => (
                <Link
                  key={channel}
                  to={`/channel/${channel.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => {
                    if (isMobile) {
                      onClose();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px',
                    borderRadius: 4,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <div style={{ width: 24, height: 24, backgroundColor: '#d1d5db', borderRadius: '50%', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{channel}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Spacer to prevent content from going under sidebar - only on desktop */}
      {!isMobile && (
        <div style={{ width: sidebarWidth, flexShrink: 0, transition: 'width 0.3s ease' }} />
      )}
    </>
  );
}

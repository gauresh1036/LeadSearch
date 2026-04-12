import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Moon, Sun, BookOpen, Menu, X, 
  MapPin, Briefcase, Users, ExternalLink, 
  Mail, MessageSquare, User, Lock, ArrowRight,
  Code2, Link as LinkIcon, Send, Sparkles,
  Target, Eye, Zap, Shield, Globe, Cpu, 
  Navigation, Heart, ShoppingCart, Rocket
} from 'lucide-react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useMotionValue, animate, useInView } from 'framer-motion';

// --- DUMMY DATA ---
const DUMMY_COMPANIES = [
  { id: 1, name: "Nexus AI", industry: "Technology", location: "San Francisco", employees: "150-200", website: "nexusai.io", color: "from-blue-500 to-cyan-400" },
  { id: 2, name: "GreenPulse", industry: "Renewable Energy", location: "Berlin", employees: "50-100", website: "greenpulse.de", color: "from-emerald-500 to-teal-400" },
  { id: 3, name: "Velox FinTech", industry: "Finance", location: "London", employees: "500+", website: "veloxpay.com", color: "from-purple-500 to-pink-400" },
  { id: 4, name: "Stellar Health", industry: "Healthcare", location: "New York", employees: "200-300", website: "stellarhealth.com", color: "from-rose-500 to-orange-400" },
  { id: 5, name: "Orbit Logistics", industry: "Supply Chain", location: "Singapore", employees: "1000+", website: "orbit.sg", color: "from-indigo-500 to-blue-400" },
  { id: 6, name: "Aether Design", industry: "Creative Arts", location: "Tokyo", employees: "20-50", website: "aether.studio", color: "from-amber-500 to-yellow-400" },
];

// New Data for Domains
const DOMAINS_DATA = [
  { name: "Artificial Intelligence", icon: <Sparkles />, color: "from-blue-500 to-indigo-600" },
  { name: "Fintech", icon: <Briefcase />, color: "from-emerald-500 to-teal-600" },
  { name: "Healthcare", icon: <Heart />, color: "from-rose-500 to-red-600" },
  { name: "E-Commerce", icon: <ShoppingCart />, color: "from-amber-500 to-orange-600" },
  { name: "EdTech", icon: <BookOpen />, color: "from-purple-500 to-indigo-600" },
  { name: "Cybersecurity", icon: <Shield />, color: "from-slate-700 to-slate-900" },
  { name: "Clean Energy", icon: <Zap />, color: "from-yellow-400 to-orange-500" },
  { name: "Logistics", icon: <Navigation />, color: "from-blue-400 to-cyan-500" },
  { name: "SaaS", icon: <Cpu />, color: "from-indigo-400 to-purple-500" },
  { name: "Gaming", icon: <Target />, color: "from-pink-500 to-rose-600" },
  { name: "Robotics", icon: <Cpu />, color: "from-gray-500 to-gray-700" },
  { name: "Blockchain", icon: <Globe />, color: "from-blue-600 to-blue-800" },
  { name: "Biotech", icon: <Eye />, color: "from-green-400 to-emerald-600" },
  { name: "Aerospace", icon: <Rocket />, color: "from-indigo-800 to-black" },
  { name: "MarTech", icon: <ExternalLink />, color: "from-orange-400 to-red-500" },
  { name: "Real Estate", icon: <MapPin />, color: "from-brown-400 to-brown-600" },
  { name: "TravelTech", icon: <Globe />, color: "from-cyan-400 to-blue-500" },
  { name: "HRTech", icon: <Users />, color: "from-purple-400 to-pink-500" },
  { name: "DeepTech", icon: <Zap />, color: "from-fuchsia-600 to-purple-700" },
  { name: "Agritech", icon: <Target />, color: "from-lime-500 to-green-700" },
];

// --- SPLASH SCREEN COMPONENT ---
const SplashScreen = () => {
  const words = "COMPANY FINDER".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 0.8, ease: "circOut" } 
      }}
      className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 2], opacity: [0, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
            className="absolute w-[300px] h-[300px] border border-indigo-500 rounded-full"
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-[0_0_50px_rgba(79,70,229,0.5)]"
        >
          <Sparkles size={40} fill="currentColor" />
        </motion.div>

        <div className="flex space-x-1 overflow-hidden">
          {words.map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
              className={`text-4xl md:text-6xl font-black tracking-tighter ${char === " " ? "mx-2" : "text-white"}`}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        <motion.div 
          initial={{ width: 0, left: '50%' }}
          animate={{ width: '100%', left: '0%' }}
          transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent mt-4 relative"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-indigo-200 text-xs font-bold tracking-[0.3em] uppercase"
        >
          Scanning Database...
        </motion.p>
      </div>
    </motion.div>
  );
};

// --- ADVANCED UI COMPONENTS ---

const ShootingStarCursor = () => {
  const [points, setPoints] = useState([]);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
      setPoints(prev => [...prev.slice(-15), newPoint]);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div 
        className="w-4 h-4 bg-white rounded-full mix-blend-difference absolute shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }}
      />
      {points.map((point, index) => (
        <motion.div
          key={point.id}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute w-2 h-2 rounded-full bg-indigo-400"
          style={{ 
            left: point.x, 
            top: point.y, 
            translateX: '-50%', 
            translateY: '-50%',
            filter: 'blur(2px)',
            opacity: index / points.length 
          }}
        />
      ))}
    </div>
  );
};

const RollingNumber = ({ value, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
        ease: "easeOut"
      });
      return controls.stop;
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue.toLocaleString()}</span>;
};

const ThemeToggle = ({ theme, setTheme }) => {
  const themes = [
    { id: 'dark', icon: <Moon size={18} />, label: 'Dark' },
    { id: 'light', icon: <Sun size={18} />, label: 'Light' },
    { id: 'reading', icon: <BookOpen size={18} />, label: 'Reading' }
  ];

  return (
    <div className="flex bg-black/10 dark:bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`p-2 rounded-full transition-all duration-300 flex items-center gap-2 px-3 ${
            theme === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/10'
          }`}
        >
          {t.icon}
          {theme === t.id && <span className="text-xs font-bold uppercase tracking-wider">{t.label}</span>}
        </button>
      ))}
    </div>
  );
};

// --- NEW DOMAIN PAGE COMPONENTS ---

const LocationModal = ({ isOpen, onClose, domainName }) => {
  const navigate = useNavigate();
  const [manualLocation, setManualLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setIsLocating(false);
        onClose();
        navigate('/', { state: { industry: domainName, location: `${position.coords.latitude},${position.coords.longitude}` } });
      }, (error) => {
        alert("Error getting location: " + error.message);
        setIsLocating(false);
      });
    } else {
      alert("Geolocation not supported");
      setIsLocating(false);
    }
  };

  const handleManualSearch = () => {
    if(!manualLocation) return;
    onClose();
    navigate('/', { state: { industry: domainName, location: manualLocation } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-zinc-900 border border-white/10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl"
          >
            <h3 className="text-2xl font-black mb-2">Explore {domainName}</h3>
            <p className="opacity-60 text-sm mb-6">Select a location to find industry leaders in this sector.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="text" 
                  placeholder="Enter city or country..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-colors"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleCurrentLocation}
                className="w-full py-4 rounded-2xl border border-indigo-500/30 flex items-center justify-center gap-2 font-bold text-indigo-400 hover:bg-indigo-500/5 transition-all"
              >
                {isLocating ? "Locating..." : (
                  <>
                    <Navigation size={18} /> Use My Current Location
                  </>
                )}
              </button>

              <button 
                onClick={handleManualSearch}
                className="w-full bg-indigo-600 py-4 rounded-2xl font-black text-white hover:bg-indigo-700 transition-all mt-4"
              >
                Continue Search
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Domain = ({ theme }) => {
  const [selectedDomain, setSelectedDomain] = useState(null);

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black tracking-tighter mb-4"
        >
          Industry <span className="text-indigo-500">Domains.</span>
        </motion.h2>
        <p className="text-xl opacity-60">Deep dive into specific market sectors globally.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DOMAINS_DATA.map((domain, index) => (
          <motion.div
            key={domain.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedDomain(domain.name)}
            className={`cursor-pointer group relative overflow-hidden p-8 rounded-[2rem] border transition-all ${
              theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf]' : 'bg-white/5 border-white/10'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${domain.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              {React.cloneElement(domain.icon, { size: 24 })}
            </div>
            
            <h3 className="text-xl font-bold mb-2">{domain.name}</h3>
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest opacity-40 group-hover:text-indigo-500 group-hover:opacity-100 transition-all">
              Discover <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      <LocationModal 
        isOpen={!!selectedDomain} 
        onClose={() => setSelectedDomain(null)} 
        domainName={selectedDomain} 
      />
    </div>
  );
};

// --- PAGE COMPONENTS ---

const Navbar = ({ theme, setTheme, user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Domains', path: '/domain' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            COMPANY FINDER
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`relative py-2 font-semibold transition-colors ${location.pathname === link.path ? 'text-indigo-500' : 'hover:text-indigo-400'}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="navline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                )}
              </Link>
            ))}
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="font-bold opacity-80 text-sm hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={onSignOut} className="font-bold hover:opacity-70 transition-opacity text-red-400">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/signin" className="font-bold hover:opacity-70 transition-opacity">Sign In</Link>
                <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all shadow-lg shadow-indigo-500/30">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-zinc-900 border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-xl font-bold">{link.name}</Link>
              ))}
              <div className="py-4 border-t border-white/10">
                <ThemeToggle theme={theme} setTheme={setTheme} />
              </div>
              <Link to="/signup" className="bg-indigo-600 p-4 text-center rounded-2xl font-bold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Gradient palette for API results (cycled by index)
const CARD_GRADIENTS = [
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-purple-500 to-pink-400",
  "from-rose-500 to-orange-400",
  "from-indigo-500 to-blue-400",
  "from-amber-500 to-yellow-400",
];

const CompanyCard = ({ company, theme, index = 0 }) => {
  // Support both dummy-data shape and real API shape
  const name = company.company_name || company.name || 'Unknown';
  const industry = company.industry || 'N/A';
  const location = company.location || company.contact_title || 'N/A';
  const employees = company.employee_count || company.employees || 'N/A';
  const website = company.company_website && company.company_website !== 'N/A'
    ? company.company_website
    : null;
  const linkedin = company.linkedin_url && company.linkedin_url !== 'N/A'
    ? company.linkedin_url
    : null;
  const contactName = company.contact_name || null;
  const contactEmail = company.contact_email && company.contact_email !== 'N/A'
    ? company.contact_email
    : null;
  const gradient = company.color || CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className={`p-6 rounded-[2rem] border transition-all duration-300 ${
        theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf] shadow-sm' : 'bg-white/5 border-white/10 backdrop-blur-md'
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} mb-6 flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
        {name.charAt(0)}
      </div>
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold flex items-center gap-1">
          <Briefcase size={12} /> {industry}
        </span>
        {employees !== 'N/A' && (
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold flex items-center gap-1">
            <Users size={12} /> {employees} employees
          </span>
        )}
      </div>
      {contactName && (
        <div className="text-sm opacity-70 mb-1 flex items-center gap-1">
          <User size={13} /> {contactName}
          {company.contact_title && company.contact_title !== 'N/A' && (
            <span className="opacity-50"> · {company.contact_title}</span>
          )}
        </div>
      )}
      {contactEmail && (
        <div className="text-sm opacity-70 mb-4 flex items-center gap-1">
          <Mail size={13} /> {contactEmail}
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
        <div className="flex gap-3">
          {website && (
            <a href={website.startsWith('http') ? website : `https://${website}`}
               target="_blank" rel="noopener noreferrer"
               className="text-indigo-500 hover:text-indigo-400 font-bold text-sm flex items-center gap-1">
              <Globe size={14} /> Website
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer"
               className="text-indigo-300 hover:text-indigo-200 font-bold text-sm flex items-center gap-1">
              <ExternalLink size={14} /> LinkedIn
            </a>
          )}
        </div>
        {!website && !linkedin && (
          <span className="text-xs opacity-40">No links available</span>
        )}
      </div>
    </motion.div>
  );
};

const Home = ({ theme }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state?.industry || '');
  const [city, setCity] = useState(location.state?.location || '');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (location.state?.industry && location.state?.location && !hasSearched) {
      handleSearch();
    }
  }, [location.state]);

  const handleSearch = async () => {
    if (!searchTerm.trim() || !city.trim()) {
      setError('Please enter both an industry/company and a city to search.');
      return;
    }
    setError('');
    setIsSearching(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({
        industry: searchTerm.trim(),
        location: city.trim(),
      });
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || `Server error ${response.status}`);
      }
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Is the backend running?');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-4xl mx-auto mb-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-bold mb-6 tracking-widest">
          DISCOVER INNOVATION
        </motion.div>
        <motion.h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
          Find Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Next Adventure.
          </span>
        </motion.h1>
      </div>

      <div className={`p-3 rounded-[3rem] shadow-2xl transition-all duration-500 ${
        theme === 'reading' ? 'bg-[#fefaf0] border border-[#e6dfcf]' : 'bg-white/5 border border-white/10 backdrop-blur-3xl'
      } max-w-4xl mx-auto mb-24`}>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-[2] relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" size={24} />
            <input 
              type="text" 
              placeholder="Search by company, industry, or tech..." 
              className="w-full bg-transparent py-6 pl-16 pr-6 focus:outline-none text-xl font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className={`hidden md:block w-px self-stretch my-3 ${theme === 'reading' ? 'bg-[#e6dfcf]' : 'bg-white/10'}`} />
          <div className="flex-1 relative">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" size={24} />
            <input
              type="text"
              placeholder="City..."
              className="w-full bg-transparent py-6 pl-16 pr-6 focus:outline-none text-xl font-medium"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] py-6 px-8 font-black text-xl transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isSearching
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
              : 'Search Now'
            }
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8 px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium"
        >
          ⚠️ {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
          {results.map((company, idx) => (
            <CompanyCard key={idx} company={company} theme={theme} index={idx} />
          ))}
        </AnimatePresence>
      </div>

      {!hasSearched && results.length === 0 && (
        <div className="text-center py-20 opacity-20">
          <Sparkles size={80} className="mx-auto mb-4" />
          <p className="text-3xl font-black">START YOUR SEARCH ABOVE</p>
        </div>
      )}
      {hasSearched && !isSearching && results.length === 0 && !error && (
        <div className="text-center py-20 opacity-40">
          <Search size={80} className="mx-auto mb-4" />
          <p className="text-3xl font-black">NO RESULTS FOUND</p>
          <p className="mt-3 text-lg">Try a different industry or city.</p>
        </div>
      )}
    </div>
  );
};

// --- UPDATED ABOUT COMPONENT ---

const About = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('mission');

  const content = {
    mission: {
      title: "Our Mission",
      desc: "To make every company's DNA accessible to the global talent pool, fostering a more transparent professional ecosystem for builders worldwide.",
      icon: <Target size={40} />,
      color: "from-indigo-600 to-blue-600"
    },
    vision: {
      title: "Our Vision",
      desc: "To become the world's most trusted intelligence platform for professional discovery, bridging the gap between talent and the world's most innovative workplaces.",
      icon: <Eye size={40} />,
      color: "from-purple-600 to-pink-600"
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
        <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-6xl font-black mb-8 leading-none tracking-tighter">Powering the <br/>Future of Hiring.</h2>
          <p className="text-xl opacity-70 mb-10 leading-relaxed">
            We're not just a database; we're a lens into the corporate world. 
            Analyze market trends, find hidden gems, and connect with 
            industry leaders in seconds.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 rounded-[2rem] bg-indigo-500 text-white">
              <div className="text-5xl font-black mb-2"><RollingNumber value={15200} />+</div>
              <div className="text-indigo-100 font-bold uppercase tracking-wider text-xs">Companies Indexed</div>
            </div>
            <div className="p-8 rounded-[2rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xl">
              <div className="text-5xl font-black mb-2"><RollingNumber value={98} />%</div>
              <div className="font-bold uppercase tracking-wider text-xs opacity-70">Data Accuracy</div>
            </div>
          </div>
        </motion.div>

        <div className="relative group">
          {/* Creative Switcher Toggle */}
          <div className="flex bg-black/10 dark:bg-white/5 p-2 rounded-3xl mb-6 backdrop-blur-md border border-white/10 w-fit mx-auto lg:mx-0">
            {['mission', 'vision'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all z-10 ${
                  activeTab === tab ? 'text-white' : 'opacity-40 hover:opacity-100'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="tab-bg" 
                    className="absolute inset-0 bg-indigo-600 rounded-2xl -z-10 shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative aspect-square">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -90, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className={`absolute inset-0 rounded-[4rem] p-12 flex flex-col justify-end overflow-hidden shadow-2xl border-4 border-white/20 ${
                  theme === 'reading' ? 'bg-[#fefaf0]' : 'bg-zinc-900'
                }`}
              >
                {/* Animated Background Element */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${content[activeTab].color} blur-[80px] opacity-40`}
                />

                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${content[activeTab].color} flex items-center justify-center text-white mb-8 shadow-2xl`}>
                  {content[activeTab].icon}
                </div>

                <h3 className="text-5xl font-black mb-6 tracking-tighter">{content[activeTab].title}</h3>
                <p className="text-xl leading-relaxed opacity-80">{content[activeTab].desc}</p>
                
                <div className="mt-8 flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 rounded-full bg-gradient-to-r ${content[activeTab].color}`} style={{ width: `${i * 20}%`, opacity: 0.3 }} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Background Decorative Frame */}
            <div className={`absolute inset-0 border-2 border-indigo-500/20 rounded-[4rem] translate-x-4 translate-y-4 -z-10`} />
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-12 text-center py-20">
          {[
              { label: "Daily Searches", val: 5000 },
              { label: "Partner Startups", val: 1200 },
              { label: "Countries Reached", val: 42 }
          ].map((stat, i) => (
              <div key={i}>
                  <div className="text-7xl font-black text-indigo-500 mb-2"><RollingNumber value={stat.val} /></div>
                  <div className="text-sm font-bold opacity-50 uppercase tracking-widest">{stat.label}</div>
              </div>
          ))}
      </div>
    </div>
  );
};

// --- REMAINING COMPONENTS (UNCHANGED) ---

const Contact = ({ theme }) => (
  <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-6xl font-black tracking-tighter mb-6">Let's Talk.</h2>
      <p className="text-xl opacity-60">We usually respond within a few hours.</p>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      <div className={`lg:col-span-2 p-10 rounded-[3rem] border ${
        theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf]' : 'bg-white/5 border-white/10'
      }`}>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest opacity-50 ml-2">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest opacity-50 ml-2">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest opacity-50 ml-2">Message</label>
            <textarea rows="6" placeholder="How can we help you?" className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-colors resize-none"></textarea>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20">
            Send Inquiry <Send size={20} />
          </button>
        </form>
      </div>

      <div className="space-y-8">
        {[
          { icon: <Mail />, title: "Support", detail: "help@companyfinder.io" },
          { icon: <MessageSquare />, title: "Sales", detail: "growth@companyfinder.io" },
          { icon: <MapPin />, title: "HQ", detail: "One Infinite Loop, CA" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[2.5rem] border ${
                theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf]' : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-4">{item.icon}</div>
            <h4 className="text-sm font-bold uppercase tracking-widest opacity-40 mb-1">{item.title}</h4>
            <p className="text-xl font-bold">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const Auth = ({ mode, theme, onAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    if (mode === 'signup' && !form.name.trim()) return 'Please enter your full name.';
    if (!form.email.trim()) return 'Please enter your email.';
    if (!form.password) return 'Please enter a password.';
    if (mode === 'signup' && form.password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/signin';
      const body = mode === 'signup'
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Something went wrong. Please try again.');
      }

      // Store token and notify App
      localStorage.setItem('cf_token', data.access_token);
      localStorage.setItem('cf_user', JSON.stringify({ name: data.name, email: data.email }));
      onAuth({ name: data.name, email: data.email });

      setSuccess(mode === 'signup' ? `Welcome, ${data.name}! Account created 🎉` : `Welcome back, ${data.name}!`);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-10 rounded-[3rem] border shadow-2xl ${
          theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf]' : 'bg-white/5 border-white/10 backdrop-blur-2xl'
        }`}
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-indigo-500/30">
            <Sparkles size={28} fill="currentColor" />
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="opacity-50">Join the world's best company index.</p>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium"
            >
              ⚠️ {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold"
            >
              ✅ {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30" size={20} />
              <input
                id="auth-name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={update('name')}
                className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30" size={20} />
            <input
              id="auth-email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update('email')}
              className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30" size={20} />
            <input
              id="auth-password"
              type="password"
              placeholder={mode === 'signup' ? 'Password (min. 6 characters)' : 'Password'}
              value={form.password}
              onChange={update('password')}
              className="w-full bg-black/10 dark:bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-white hover:bg-indigo-700 disabled:opacity-60 transition-all shadow-xl shadow-indigo-500/20 mt-6 active:scale-95 flex items-center justify-center gap-3"
          >
            {loading
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              : (mode === 'signin' ? 'Sign In' : 'Sign Up')
            }
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-medium opacity-60">
          {mode === 'signin' ? "Don't have an account?" : 'Already a member?'}
          <Link
            to={mode === 'signin' ? '/signup' : '/signin'}
            className="text-indigo-500 ml-2 font-bold hover:underline"
          >
            {mode === 'signin' ? 'Register' : 'Login'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cf_user')); } catch { return null; }
  });

  const handleAuth = (userData) => setUser(userData);
  const handleSignOut = () => {
    localStorage.removeItem('cf_token');
    localStorage.removeItem('cf_user');
    setUser(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const themeConfig = {
    dark: "bg-[#050505] text-zinc-100",
    light: "bg-white text-zinc-900",
    reading: "bg-[#fdf6e3] text-[#586e75]"
  };

  return (
    <Router>
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>

      <div className={`min-h-screen transition-all duration-700 ease-in-out selection:bg-indigo-500 selection:text-white ${themeConfig[theme]}`}>
        <ShootingStarCursor />
        
        {theme !== 'reading' && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
            <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/30 rounded-full blur-[120px]" />
            <motion.div animate={{ scale: [1.2, 1, 1.2], x: [0, -100, 0], y: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/30 rounded-full blur-[120px]" />
          </div>
        )}

        <Navbar theme={theme} setTheme={setTheme} user={user} onSignOut={handleSignOut} />

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/domain" element={<Domain theme={theme} />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/contact" element={<Contact theme={theme} />} />
            <Route path="/signin" element={<Auth mode="signin" theme={theme} onAuth={handleAuth} />} />
            <Route path="/signup" element={<Auth mode="signup" theme={theme} onAuth={handleAuth} />} />
          </Routes>
        </main>

        <footer className={`py-20 px-6 border-t mt-20 ${theme === 'reading' ? 'border-[#e6dfcf]' : 'border-white/10'}`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <div className="text-2xl font-black mb-4 tracking-tighter">COMPANY FINDER</div>
              <p className="opacity-50 text-sm font-medium">Empowering career choices through data. <br/>Made with ❤️ for modern builders.</p>
            </div>
            <div className="flex space-x-6">
              {[Code2, LinkIcon, ExternalLink].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                  <Icon size={20} />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest opacity-50">
              <span className="hover:text-indigo-500 transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-indigo-500 transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-indigo-500 transition-colors cursor-pointer">Cookies</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
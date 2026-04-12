import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Moon, Sun, BookOpen, Menu, X, 
  MapPin, Briefcase, Users, ExternalLink, 
  Mail, MessageSquare, User, Lock, ArrowRight,
  Send, Sparkles,
  Target, Eye, Zap, Shield, Globe, Cpu, 
  Navigation, Heart, ShoppingCart, Rocket, AlertCircle
} from 'lucide-react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useMotionValue, useInView, animate } from 'framer-motion';

// --- DOMAINS DATA ---
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
];

// --- SPLASH SCREEN ---
const SplashScreen = () => {
  const words = "COMPANY FINDER".split("");
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8, ease: "circOut" } }}
      className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
          Initializing Backend Connection...
        </motion.p>
      </div>
    </motion.div>
  );
};

// --- CURSOR ---
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
      setPoints(prev => [...prev.slice(-15), { x: e.clientX, y: e.clientY, id: Date.now() }]);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
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
            left: point.x, top: point.y, translateX: '-50%', translateY: '-50%',
            filter: 'blur(2px)', opacity: index / points.length 
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
        duration, onUpdate: (v) => setDisplayValue(Math.floor(v)), ease: "easeOut"
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

// --- NAVBAR ---
const Navbar = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Domains', path: '/domain' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${theme === 'light' ? 'bg-white/80' : 'bg-black/20'} backdrop-blur-xl border-b ${theme === 'reading' ? 'border-[#e6dfcf]' : 'border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            APOLLO
          </span>
        </Link>
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} to={link.path}
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
            <Link to="/signin" className="font-bold hover:opacity-70 transition-opacity">Sign In</Link>
            <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all shadow-lg shadow-indigo-500/30">
              Sign Up
            </Link>
          </div>
        </div>
        <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

// --- PAGES ---
const Home = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim() || !city.trim()) {
      setError("Please enter both an Industry and a City.");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const params = new URLSearchParams({
        location: city.trim(),
        industry: searchTerm.trim()
      });
      // Call actual FastAPI backend wrapper for Apollo
      const response = await fetch(`http://localhost:8000/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const fetchedCompanies = data.results || [];
      
      // Map API returns to beautiful card format
      const colorPalettes = [
        "from-blue-500 to-cyan-400",
        "from-emerald-500 to-teal-400", 
        "from-purple-500 to-pink-400", 
        "from-rose-500 to-orange-400",
        "from-indigo-500 to-blue-400",
        "from-amber-500 to-yellow-400"
      ];
      
      const mapped = fetchedCompanies.map((c, idx) => ({
        id: c.company_name + idx,
        name: c.company_name,
        industry: c.industry && c.industry !== 'N/A' ? c.industry : searchTerm,
        location: c.location || city,
        employees: c.employee_count && c.employee_count !== 'N/A' ? c.employee_count : "Unknown",
        website: c.company_website && c.company_website !== 'N/A' ? c.company_website : "#",
        color: colorPalettes[idx % colorPalettes.length]
      }));
      
      setResults(mapped);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to search Apollo database.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-bold mb-6 tracking-widest">
          LIVE APOLLO.IO INTELLIGENCE
        </motion.div>
        <motion.h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
          Find Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Next Target.
          </span>
        </motion.h1>
      </div>

      <div className={`p-3 rounded-[3rem] shadow-2xl transition-all duration-500 ${
        theme === 'reading' ? 'bg-[#fefaf0] border border-[#e6dfcf]' : 'bg-white/5 border border-white/10 backdrop-blur-3xl'
      } max-w-4xl mx-auto mb-10 relative z-10`}>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-[2] relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" size={24} />
            <input 
              type="text" 
              placeholder="Industry (e.g. Finance)" 
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
              placeholder="City (e.g. Austin)"
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
              : 'Search APIs'
            }
          </button>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto mb-10 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 font-semibold">
          <AlertCircle size={20} /> {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
          {results.map((company, index) => (
            <motion.div 
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`p-6 rounded-[2rem] border transition-all duration-300 ${
                theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf] shadow-sm' : 'bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${company.color} mb-6 flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                {company.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-bold mb-2 truncate" title={company.name}>{company.name}</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold flex items-center gap-1 truncate max-w-[150px]">
                  <Briefcase size={12} /> {company.industry}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold flex items-center gap-1">
                  <MapPin size={12} /> {company.location}
                </span>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                <div className="text-sm font-medium opacity-60 flex items-center gap-1">
                  <Users size={14} /> {company.employees}
                </div>
                {company.website !== '#' ? (
                  <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-400 font-bold text-sm flex items-center gap-1">
                    Website <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="opacity-40 text-sm font-bold">No Website</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isSearching && results.length === 0 && !error && (
        <div className="text-center py-20 opacity-20">
          <Sparkles size={80} className="mx-auto mb-4" />
          <p className="text-3xl font-black">WAITING FOR APOLLO CONNECTION</p>
        </div>
      )}
    </div>
  );
};

// Layout elements...
const Domain = ({ theme }) => <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto"><h2 className="text-6xl font-black mb-8 text-center">Domains coming soon.</h2></div>;
const About = ({ theme }) => <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto"><h2 className="text-6xl font-black mb-8 text-center">About coming soon.</h2></div>;
const Contact = ({ theme }) => <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto"><h2 className="text-6xl font-black mb-8 text-center">Contact coming soon.</h2></div>;
const Auth = ({ mode, theme }) => <div className="pt-40 pb-20 px-6 flex justify-center"><h2 className="text-4xl font-black">{mode} coming soon</h2></div>;


const App = () => {
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  // App initialization fake loading to show splash screen beautifully
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const themeConfig = {
    dark: "bg-[#050505] text-zinc-100",
    light: "bg-[#f5f5f7] text-zinc-900 border-zinc-200",
    reading: "bg-[#fdf6e3] text-[#586e75]"
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-700 ease-in-out selection:bg-indigo-500 selection:text-white ${themeConfig[theme]}`}>
        <AnimatePresence>
          {loading && <SplashScreen key="splash" />}
        </AnimatePresence>

        {!loading && <ShootingStarCursor />}
        
        {!loading && theme === 'dark' && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
            <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/30 rounded-full blur-[120px]" />
            <motion.div animate={{ scale: [1.2, 1, 1.2], x: [0, -100, 0], y: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/30 rounded-full blur-[120px]" />
          </div>
        )}

        {/* Prevent rendering main content under splash to avoid sudden heavy DOM loads */}
        {!loading && (
          <>
            <Navbar theme={theme} setTheme={setTheme} />
            <main className="relative z-10 min-h-[calc(100vh-200px)]">
              <Routes>
                <Route path="/" element={<Home theme={theme} />} />
                <Route path="/domain" element={<Domain theme={theme} />} />
                <Route path="/about" element={<About theme={theme} />} />
                <Route path="/contact" element={<Contact theme={theme} />} />
                <Route path="/signin" element={<Auth mode="signin" theme={theme} />} />
                <Route path="/signup" element={<Auth mode="signup" theme={theme} />} />
              </Routes>
            </main>
            <footer className={`py-12 text-center border-t relative z-10 ${theme === 'dark' ? 'border-white/10 opacity-50' : 'border-black/10 opacity-70'}`}>
              <p className="font-bold tracking-widest text-sm uppercase">Apollo Deep Search Module</p>
            </footer>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Search, Moon, Sun, BookOpen, Menu, X, 
  MapPin, Briefcase, Users, ExternalLink, 
  Mail, MessageSquare, User, Lock, ArrowRight,
  Send, Sparkles, Globe,
  Target, Eye, Navigation, ChevronLeft, ChevronRight,
  Cpu, Leaf, Landmark, HeartPulse, Palette
} from 'lucide-react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

// --- DUMMY DATA ---
const DUMMY_COMPANIES = [
  { id: 1, name: "Nexus AI", industry: "Technology", location: "San Francisco", employees: "150-200", website: "nexusai.io", color: "from-blue-500 to-cyan-400" },
  { id: 2, name: "GreenPulse", industry: "Renewable Energy", location: "Berlin", employees: "50-100", website: "greenpulse.de", color: "from-emerald-500 to-teal-400" },
  { id: 3, name: "Velox FinTech", industry: "Finance", location: "London", employees: "500+", website: "veloxpay.com", color: "from-purple-500 to-pink-400" },
  { id: 4, name: "Stellar Health", industry: "Healthcare", location: "New York", employees: "200-300", website: "stellarhealth.com", color: "from-rose-500 to-orange-400" },
  { id: 5, name: "Orbit Logistics", industry: "Supply Chain", location: "Singapore", employees: "1000+", website: "orbit.sg", color: "from-indigo-500 to-blue-400" },
  { id: 6, name: "Aether Design", industry: "Creative Arts", location: "Tokyo", employees: "20-50", website: "aether.studio", color: "from-amber-500 to-yellow-400" },
];

const DOMAINS = [
  { id: 'tech', name: 'Technology', desc: 'Shape the future with AI and Cloud solutions.', icon: <Cpu size={80} />, color: 'from-blue-600 to-indigo-600' },
  { id: 'energy', name: 'Renewable Energy', desc: 'Sustainable solutions for a greener planet.', icon: <Leaf size={80} />, color: 'from-emerald-600 to-teal-600' },
  { id: 'finance', name: 'Finance', desc: 'Revolutionizing the global economy and banking.', icon: <Landmark size={80} />, color: 'from-purple-600 to-pink-600' },
  { id: 'health', name: 'Healthcare', desc: 'Advanced medicine and holistic wellness.', icon: <HeartPulse size={80} />, color: 'from-rose-600 to-orange-600' },
  { id: 'arts', name: 'Creative Arts', desc: 'Where design meets digital innovation.', icon: <Palette size={80} />, color: 'from-amber-500 to-yellow-500' }
];

// --- UTILITY COMPONENTS ---

const ScribbleCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = (e) => {
      if (!isDrawing) return;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };

    const stopDrawing = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsDrawing(false);
      ctx.beginPath();
    };

    window.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
    return () => {
      window.removeEventListener('mousemove', draw);
      window.removeEventListener('mouseup', stopDrawing);
      window.removeEventListener('resize', resize);
    };
  }, [isDrawing]);

  return (
    <canvas 
      ref={canvasRef} 
      onMouseDown={() => setIsDrawing(true)}
      className="fixed inset-0 z-0 touch-none cursor-crosshair"
    />
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

// --- HOME SCREEN 3D DOMAINS ---

const Domain3DShowcase = ({ onSelectDomain }) => {
  const [index, setIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleNext = useCallback(() => setIndex((prev) => (prev + 1) % DOMAINS.length), []);
  const handlePrev = useCallback(() => setIndex((prev) => (prev - 1 + DOMAINS.length) % DOMAINS.length), []);

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[550px] flex items-center justify-center perspective-1000 mb-20">
      <div className="absolute inset-0 flex items-center justify-between px-4 z-20 pointer-events-none">
        <button onClick={handlePrev} className="p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all pointer-events-auto">
          <ChevronLeft size={32} />
        </button>
        <button onClick={handleNext} className="p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all pointer-events-auto">
          <ChevronRight size={32} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 1.2, rotateY: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative w-[340px] md:w-[650px] h-[450px] rounded-[4rem] cursor-pointer group shadow-2xl overflow-hidden`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${DOMAINS[index].color} opacity-90`} />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
            <motion.div style={{ translateZ: 100 }} className="mb-8 drop-shadow-2xl">
              {DOMAINS[index].icon}
            </motion.div>
            <motion.h2 style={{ translateZ: 150 }} className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
              {DOMAINS[index].name}
            </motion.h2>
            <motion.p style={{ translateZ: 120 }} className="text-xl opacity-90 max-w-md mb-10">
              {DOMAINS[index].desc}
            </motion.p>
            
            <motion.button 
              style={{ translateZ: 80 }}
              onClick={() => onSelectDomain(DOMAINS[index].name)}
              className="flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-full font-black text-lg hover:scale-110 transition-transform shadow-xl"
            >
              Explore Domain <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- CORE UI COMPONENTS ---

const SplashScreen = () => {
  const words = "COMPANY FINDER".split("");
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8, ease: "circOut" } }}
      className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.5, 2], opacity: [0, 0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} className="absolute w-[300px] h-[300px] border border-indigo-500 rounded-full" />
        ))}
      </div>
      <div className="relative flex flex-col items-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-[0_0_50px_rgba(79,70,229,0.5)]">
          <Sparkles size={40} fill="currentColor" />
        </motion.div>
        <div className="flex space-x-1 overflow-hidden">
          {words.map((char, index) => (
            <motion.span key={index} initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.05, duration: 0.5 }} className={`text-4xl md:text-6xl font-black tracking-tighter ${char === " " ? "mx-2" : "text-white"}`}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.2 }} className="mt-6 text-indigo-200 text-xs font-bold tracking-[0.3em] uppercase">Scanning Database...</motion.p>
      </div>
    </motion.div>
  );
};

const ShootingStarCursor = () => {
  const [points, setPoints] = useState([]);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
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
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div className="w-4 h-4 bg-white rounded-full mix-blend-difference absolute" style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }} />
      {points.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0.5 }} animate={{ opacity: 0, scale: 0 }} className="absolute w-2 h-2 rounded-full bg-indigo-400" style={{ left: p.x, top: p.y, translateX: '-50%', translateY: '-50%', opacity: i / points.length }} />
      ))}
    </div>
  );
};

const ThemeToggle = ({ theme, setTheme }) => {
  const themes = [{ id: 'dark', icon: <Moon size={18} />, label: 'Dark' }, { id: 'light', icon: <Sun size={18} />, label: 'Light' }, { id: 'reading', icon: <BookOpen size={18} />, label: 'Reading' }];
  return (
    <div className="flex bg-black/10 dark:bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10">
      {themes.map((t) => (
        <button key={t.id} onClick={() => setTheme(t.id)} className={`p-2 rounded-full transition-all duration-300 flex items-center gap-2 px-3 ${theme === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white/10'}`}>
          {t.icon}
          {theme === t.id && <span className="text-xs font-bold uppercase tracking-wider">{t.label}</span>}
        </button>
      ))}
    </div>
  );
};

const Navbar = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = [{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about' }, { name: 'Contact Us', path: '/contact' }];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Sparkles size={20} fill="currentColor" /></div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent uppercase">Company Finder</span>
        </Link>
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`relative py-2 font-semibold ${location.pathname === link.path ? 'text-indigo-500' : 'hover:text-indigo-400'}`}>
                {link.name}
                {location.pathname === link.path && <motion.div layoutId="navline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />}
              </Link>
            ))}
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Link to="/signin" className="font-bold">Sign In</Link>
          <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30">Sign Up</Link>
        </div>
        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="lg:hidden bg-zinc-900 overflow-hidden px-6 pb-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block py-4 text-xl font-bold">{link.name}</Link>
            ))}
            <div className="pt-4 border-t border-white/10"><ThemeToggle theme={theme} setTheme={setTheme} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- MAIN PAGES ---

const Home = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearch = async () => {
    if (!searchTerm.trim() && !city.trim()) {
      alert("Please enter either an Industry or City.");
      return;
    }
    
    setIsSearching(true);

    try {
      const params = new URLSearchParams({
        location: city.trim(),
        industry: searchTerm.trim()
      });
      
      const response = await fetch(`http://localhost:8000/search?${params}`);
      
      if (!response.ok) {
        // Try to get detailed error from backend
        const errorData = await response.json().catch(() => ({}));
        const detail = errorData.detail || response.statusText;
        throw new Error(`API Error (${response.status}): ${detail}`);
      }
      
      const data = await response.json();
      const fetchedCompanies = data.results || [];
      
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
        industry: c.industry && c.industry !== 'N/A' ? c.industry : searchTerm || 'Technology',
        location: c.location || city || 'Global',
        employees: c.employee_count && c.employee_count !== 'N/A' ? c.employee_count : "Unknown",
        website: c.company_website && c.company_website !== 'N/A' ? c.company_website : "#",
        color: colorPalettes[idx % colorPalettes.length]
      }));
      
      setResults(mapped);
    } catch (err) {
      console.error(err);
      if (err.message.includes("Failed to fetch")) {
        alert("Failed to connect to Python backend! Please make sure the terminal shows 'Uvicorn running on http://0.0.0.0:8000'");
      } else {
        alert(err.message);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const onSelectDomain = (domainName) => {
    setSearchTerm(domainName);
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const getGeoLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const data = await res.json();
        setCity(data.address.city || data.address.town || data.address.village || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLocLoading(false);
      }
    });
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-4xl mx-auto mb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-bold mb-6 tracking-widest uppercase">
          Discover Innovation
        </motion.div>
        <motion.h1 className="text-6xl md:text-8xl font-black mb-12 leading-[0.9] tracking-tighter">
          Explore Most <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Searched Domains.</span>
        </motion.h1>
      </div>

      <Domain3DShowcase onSelectDomain={onSelectDomain} />

      <div className={`p-3 rounded-[3rem] shadow-2xl transition-all duration-500 ${theme === 'reading' ? 'bg-[#fefaf0] border border-[#e6dfcf]' : 'bg-white/5 border border-white/10 backdrop-blur-3xl'} max-w-4xl mx-auto mb-24`}>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-[2] relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" size={24} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search by company or industry..." 
              className="w-full bg-transparent py-6 pl-16 pr-6 focus:outline-none text-xl font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className={`hidden md:block w-px self-stretch my-3 ${theme === 'reading' ? 'bg-[#e6dfcf]' : 'bg-white/10'}`} />
          <div className="flex-1 relative flex items-center">
            <MapPin className="absolute left-6 opacity-30" size={24} />
            <input
              type="text"
              placeholder="City..."
              className="w-full bg-transparent py-6 pl-16 pr-14 focus:outline-none text-xl font-medium"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={getGeoLocation}
              className={`absolute right-4 p-2 rounded-full transition-colors ${locLoading ? 'animate-pulse text-indigo-400' : 'text-indigo-500 hover:bg-indigo-500/10'}`}
            >
              <Navigation size={20} fill={locLoading ? "currentColor" : "none"} />
            </button>
          </div>
          <button onClick={handleSearch} className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2.5rem] py-6 px-8 font-black text-xl transition-all flex items-center justify-center gap-3 active:scale-95">
            {isSearching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" /> : 'Search Now'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
          {results.map(company => (
            <motion.div key={company.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-[2rem] border ${theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf]' : 'bg-white/5 border-white/10'}`}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${company.color} mb-6 flex items-center justify-center text-white text-2xl font-black`}>{company.name.charAt(0)}</div>
              <h3 className="text-2xl font-bold mb-2">{company.name}</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold flex items-center gap-1"><Briefcase size={12} /> {company.industry}</span>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold flex items-center gap-1"><MapPin size={12} /> {company.location}</span>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                <div className="text-sm font-medium opacity-60 flex items-center gap-1"><Users size={14} /> {company.employees}</div>
                <div className="text-indigo-500 font-bold text-sm flex items-center gap-1 cursor-pointer">Profile <ExternalLink size={14} /></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {results.length === 0 && (
        <div className="text-center py-20 opacity-20">
          <Sparkles size={80} className="mx-auto mb-4" />
          <p className="text-3xl font-black">START YOUR SEARCH ABOVE</p>
        </div>
      )}
    </div>
  );
};

const About = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('mission');
  const content = {
    mission: { title: "Our Mission", desc: "To make every company's DNA accessible to the global talent pool, fostering a more transparent professional ecosystem for builders worldwide.", icon: <Target size={40} />, color: "from-indigo-600 to-blue-600" },
    vision: { title: "Our Vision", desc: "To become the world's most trusted intelligence platform for professional discovery, bridging the gap between talent and the world's most innovative workplaces.", icon: <Eye size={40} />, color: "from-purple-600 to-pink-600" }
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
          <div className="flex bg-black/10 dark:bg-white/5 p-2 rounded-3xl mb-6 backdrop-blur-md border border-white/10 w-fit mx-auto lg:mx-0">
            {['mission', 'vision'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`relative px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all z-10 ${activeTab === tab ? 'text-white' : 'opacity-40 hover:opacity-100'}`}>
                {tab}
                {activeTab === tab && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-indigo-600 rounded-2xl -z-10 shadow-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
              </button>
            ))}
          </div>
          <div className="relative aspect-square">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -90 }} className={`absolute inset-0 rounded-[4rem] p-12 flex flex-col justify-end overflow-hidden shadow-2xl border-4 border-white/20 ${theme === 'reading' ? 'bg-[#fefaf0]' : 'bg-zinc-900'}`}>
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${content[activeTab].color} flex items-center justify-center text-white mb-8 shadow-2xl`}>{content[activeTab].icon}</div>
                <h3 className="text-5xl font-black mb-6 tracking-tighter">{content[activeTab].title}</h3>
                <p className="text-xl leading-relaxed opacity-80">{content[activeTab].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-12 text-center py-20">
          {[{ label: "Daily Searches", val: 5000 }, { label: "Partner Startups", val: 1200 }, { label: "Countries Reached", val: 42 }].map((stat, i) => (
              <div key={i}>
                  <div className="text-7xl font-black text-indigo-500 mb-2"><RollingNumber value={stat.val} /></div>
                  <div className="text-sm font-bold opacity-50 uppercase tracking-widest">{stat.label}</div>
              </div>
          ))}
      </div>
    </div>
  );
};

const Contact = ({ theme }) => (
  <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-20">
      <h2 className="text-6xl font-black tracking-tighter mb-6">Let's Talk.</h2>
      <p className="text-xl opacity-60">We usually respond within a few hours.</p>
    </div>
    <div className="grid lg:grid-cols-3 gap-8">
      <div className={`lg:col-span-2 p-10 rounded-[3rem] border ${theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf]' : 'bg-white/5 border-white/10'}`}>
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
        {[{ icon: <Mail />, title: "Support", detail: "help@companyfinder.io" }, { icon: <MessageSquare />, title: "Sales", detail: "growth@companyfinder.io" }, { icon: <MapPin />, title: "HQ", detail: "One Infinite Loop, CA" }].map((item, i) => (
          <motion.div key={i} initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className={`p-8 rounded-[2.5rem] border ${theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf]' : 'bg-white/5 border-white/10'}`}>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-4">{item.icon}</div>
            <h4 className="text-sm font-bold uppercase tracking-widest opacity-40 mb-1">{item.title}</h4>
            <p className="text-xl font-bold">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const Auth = ({ mode, theme }) => (
  <div className="relative min-h-screen pt-40 pb-20 px-6 flex justify-center items-center overflow-hidden">
    <ScribbleCanvas />
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`relative z-10 w-full max-w-md p-10 rounded-[3rem] border shadow-2xl ${theme === 'reading' ? 'bg-[#fefaf0] border-[#e6dfcf]' : 'bg-black/40 border-white/10 backdrop-blur-2xl'}`}>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="opacity-50">Scribble anywhere on the screen to think...</p>
      </div>
      <form className="space-y-4">
        {mode === 'signup' && (
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30" size={20} />
            <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-indigo-500" />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30" size={20} />
          <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="relative">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30" size={20} />
          <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-indigo-500" />
        </div>
        <button className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-white hover:bg-indigo-700 shadow-xl mt-6 active:scale-95">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-8 text-sm font-medium opacity-60">
        {mode === 'signin' ? "Don't have an account?" : "Already a member?"}
        <Link to={mode === 'signin' ? '/signup' : '/signin'} className="text-indigo-500 ml-2 font-black">
          {mode === 'signin' ? 'Register' : 'Login'}
        </Link>
      </p>
    </motion.div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const themeConfig = { dark: "bg-[#050505] text-zinc-100", light: "bg-white text-zinc-900", reading: "bg-[#fdf6e3] text-[#586e75]" };

  return (
    <Router>
      <style>{`.perspective-1000 { perspective: 1000px; }`}</style>
      <AnimatePresence>{loading && <SplashScreen key="splash" />}</AnimatePresence>
      <div className={`min-h-screen transition-all duration-700 ease-in-out selection:bg-indigo-500 selection:text-white ${themeConfig[theme]}`}>
        <ShootingStarCursor />
        {theme !== 'reading' && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
            <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 100, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/30 rounded-full blur-[120px]" />
            <motion.div animate={{ scale: [1.2, 1, 1.2], x: [0, -100, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/30 rounded-full blur-[120px]" />
          </div>
        )}
        <Navbar theme={theme} setTheme={setTheme} />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/contact" element={<Contact theme={theme} />} />
            <Route path="/signin" element={<Auth mode="signin" theme={theme} />} />
            <Route path="/signup" element={<Auth mode="signup" theme={theme} />} />
          </Routes>
        </main>
        <footer className={`py-20 px-6 border-t mt-20 ${theme === 'reading' ? 'border-[#e6dfcf]' : 'border-white/10'}`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div>
              <div className="text-2xl font-black mb-4 tracking-tighter uppercase">Company Finder</div>
              <p className="opacity-50 text-sm font-medium">Empowering career choices through data. <br/>Made with ❤️ for modern builders.</p>
            </div>
            <div className="flex space-x-6">
              {[MessageSquare, Globe, Mail].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:bg-indigo-600 transition-all cursor-pointer"><Icon size={20} /></div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
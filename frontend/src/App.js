import { useState, useEffect, useRef } from 'react';
import '@/App.css';
import axios from 'axios';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, ArrowRight, Menu, X, Send, Palette, TrendingUp, Megaphone, Code, Cookie, Shield, FileText } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Professional Logo Component
const Logo = ({ className = "", light = false }) => (
  <div className={`flex items-center gap-3 ${className}`} data-testid="logo">
    <img 
      src="https://customer-assets.emergentagent.com/job_site-refresh-126/artifacts/wsghz2sf_WebCraft_Solutions_-_1_20260323_005319_0000.png" 
      alt="WildWave Logo"
      className={`h-10 w-auto ${light ? 'brightness-0 invert' : ''}`}
    />
  </div>
);

// Impressum Modal
const ImpressumModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="impressum-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
          data-testid="impressum-modal"
        >
          <div className="sticky top-0 bg-white border-b border-zinc-200 px-8 py-6 flex justify-between items-center">
            <h2 className="font-heading text-2xl font-bold">Impressum</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 transition-colors" data-testid="impressum-close-btn">
              <X size={24} />
            </button>
          </div>
          <div className="px-8 py-6 space-y-6 text-zinc-600">
            <div>
              <h3 className="font-heading font-semibold text-black mb-2">Angaben gemäss Art. 3 DSG</h3>
              <p>WILDWAVE</p>
              <p>Im Isengrind 35</p>
              <p>8046 Zürich</p>
              <p>Schweiz</p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2">Kontakt</h3>
              <p>Telefon: +41 78 263 04 06</p>
              <p>E-Mail: info@wildwave.ch</p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2">Vertretungsberechtigte Person</h3>
              <p>Geschäftsführer: Marco Amadeus</p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2">Haftungsausschluss</h3>
              <p className="text-sm leading-relaxed">
                Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, 
                Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen 
                den Autor wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff 
                oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch 
                Missbrauch der Verbindung oder durch technische Störungen entstanden sind, 
                werden ausgeschlossen.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2">Urheberrechte</h3>
              <p className="text-sm leading-relaxed">
                Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen 
                Dateien auf dieser Website gehören ausschliesslich WILDWAVE oder den speziell 
                genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente ist die 
                schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Datenschutz Modal
const DatenschutzModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="datenschutz-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
          data-testid="datenschutz-modal"
        >
          <div className="sticky top-0 bg-white border-b border-zinc-200 px-8 py-6 flex justify-between items-center">
            <h2 className="font-heading text-2xl font-bold">Datenschutzerklärung</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 transition-colors" data-testid="datenschutz-close-btn">
              <X size={24} />
            </button>
          </div>
          <div className="px-8 py-6 space-y-6 text-zinc-600 text-sm leading-relaxed">
            <div>
              <h3 className="font-heading font-semibold text-black mb-2 text-base">1. Allgemeines</h3>
              <p>
                Gestützt auf Artikel 13 der schweizerischen Bundesverfassung und die datenschutzrechtlichen 
                Bestimmungen des Bundes (Datenschutzgesetz, DSG) hat jede Person Anspruch auf Schutz ihrer 
                Privatsphäre sowie auf Schutz vor Missbrauch ihrer persönlichen Daten. WILDWAVE hält diese 
                Bestimmungen ein.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2 text-base">2. Verantwortliche Stelle</h3>
              <p>Verantwortlich für die Datenbearbeitung auf dieser Website:</p>
              <p className="mt-2">WILDWAVE<br />Im Isengrind 35<br />8046 Zürich<br />info@wildwave.ch</p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2 text-base">3. Erhebung und Verarbeitung von Daten</h3>
              <p>
                Wenn Sie unsere Webseite besuchen, speichern unsere Server temporär jeden Zugriff in einer 
                Protokolldatei. Folgende Daten werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten 
                Löschung gespeichert:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt</li>
                <li>Verwendeter Browser und Betriebssystem</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2 text-base">4. Cookies</h3>
              <p>
                Diese Website verwendet Cookies. Bei Cookies handelt es sich um kleine Textdateien, 
                die mit Hilfe des Browsers auf Ihrem Endgerät abgelegt werden. Sie können Ihren Browser 
                so einstellen, dass Sie über das Setzen von Cookies informiert werden und einzeln über 
                deren Annahme entscheiden oder die Annahme von Cookies für bestimmte Fälle oder generell 
                ausschliessen können.
              </p>
              <p className="mt-2">Wir verwenden:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Essenzielle Cookies:</strong> Notwendig für die Grundfunktionen der Website</li>
                <li><strong>Analyse-Cookies:</strong> Helfen uns, die Nutzung der Website zu verstehen</li>
                <li><strong>Marketing-Cookies:</strong> Ermöglichen personalisierte Werbung</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2 text-base">5. Kontaktformular</h3>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
                der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben 
                wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2 text-base">6. Ihre Rechte</h3>
              <p>Sie haben jederzeit das Recht:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Auskunft über Ihre bei uns gespeicherten Daten zu erhalten</li>
                <li>Diese Daten berichtigen oder löschen zu lassen</li>
                <li>Die Einschränkung der Verarbeitung zu verlangen</li>
                <li>Der Verarbeitung zu widersprechen</li>
                <li>Die Datenübertragbarkeit zu verlangen</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2 text-base">7. Datensicherheit</h3>
              <p>
                Wir setzen technische und organisatorische Sicherheitsmassnahmen ein, um Ihre Daten 
                gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den 
                Zugriff unberechtigter Personen zu schützen.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-black mb-2 text-base">8. Änderungen</h3>
              <p>
                Wir können diese Datenschutzerklärung jederzeit ohne Vorankündigung anpassen. 
                Es gilt die jeweils aktuelle, auf unserer Website publizierte Fassung.
              </p>
              <p className="mt-4 text-zinc-500">Stand: Januar 2026</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('wildwave_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('wildwave_cookie_consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('wildwave_cookie_consent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-zinc-200 shadow-2xl"
        data-testid="cookie-banner"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center">
                  <Cookie size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-bold text-lg">Datenschutz-Einstellungen</h3>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">
                Wir verwenden Cookies und ähnliche Technologien, um Ihnen ein optimales Nutzererlebnis zu bieten. 
                Gemäss dem Schweizer Datenschutzgesetz (DSG) informieren wir Sie transparent über die Datenverarbeitung. 
                Sie können Ihre Einstellungen jederzeit anpassen.
              </p>
              
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-zinc-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Shield size={16} className="text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Essenziell</p>
                        <p className="text-zinc-500">Notwendig für die Funktion der Website</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp size={16} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Analyse</p>
                        <p className="text-zinc-500">Helfen uns, die Website zu verbessern</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Megaphone size={16} className="text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Marketing</p>
                        <p className="text-zinc-500">Für personalisierte Inhalte</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-zinc-500 hover:text-black mt-3 underline underline-offset-2"
                data-testid="cookie-details-toggle"
              >
                {showDetails ? 'Weniger anzeigen' : 'Mehr erfahren'}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={handleAcceptEssential}
                className="px-6 py-3 text-sm font-semibold tracking-wide border border-zinc-300 hover:border-black transition-colors"
                data-testid="cookie-accept-essential"
              >
                Nur Essenzielle
              </button>
              <button
                onClick={handleAcceptAll}
                className="btn-primary px-6 py-3 text-sm font-semibold tracking-wide"
                data-testid="cookie-accept-all"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'header-blur bg-white/80 border-b border-black/5' : 'bg-transparent'}`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center py-4">
        <a href="/" className="block" data-testid="header-logo">
          <Logo />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('services')}
            className="text-sm tracking-wide hover:text-[#FF3B30] transition-colors"
            data-testid="nav-services"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-sm tracking-wide hover:text-[#FF3B30] transition-colors"
            data-testid="nav-about"
          >
            Über uns
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-sm tracking-wide hover:text-[#FF3B30] transition-colors"
            data-testid="nav-contact"
          >
            Kontakt
          </button>
          <a
            href="tel:+41782630406"
            className="btn-primary px-6 py-3 text-sm font-semibold tracking-widest uppercase"
            data-testid="nav-call-btn"
          >
            Anrufen
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t border-black/5 py-6 px-6"
        >
          <nav className="flex flex-col gap-4">
            <button onClick={() => scrollToSection('services')} className="text-left py-2 text-lg" data-testid="mobile-nav-services">Services</button>
            <button onClick={() => scrollToSection('about')} className="text-left py-2 text-lg" data-testid="mobile-nav-about">Über uns</button>
            <button onClick={() => scrollToSection('contact')} className="text-left py-2 text-lg" data-testid="mobile-nav-contact">Kontakt</button>
            <a href="tel:+41782630406" className="btn-primary px-6 py-3 text-sm font-semibold tracking-widest uppercase text-center mt-4" data-testid="mobile-call-btn">Anrufen</a>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

// Hero Component with Video
const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={containerRef} className="min-h-screen flex flex-col justify-center pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.2em] uppercase font-semibold text-zinc-500 mb-6"
            >
              Digitalagentur Zürich
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-heading text-5xl md:text-6xl lg:text-8xl tracking-tighter font-black uppercase leading-none mb-8"
              data-testid="hero-title"
            >
              Wir bauen<br />
              <span className="text-[#FF3B30]">digitale</span><br />
              Erlebnisse
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg leading-relaxed text-zinc-600 max-w-xl mb-10"
            >
              Webdesign, SEO und Marketing – massgeschneidert für Ihr Unternehmen. 
              Wir schaffen digitale Lösungen, die begeistern und konvertieren.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="tel:+41782630406"
                className="btn-primary px-8 py-4 text-sm font-bold tracking-widest uppercase inline-flex items-center justify-center gap-3"
                data-testid="hero-call-btn"
              >
                <Phone size={18} strokeWidth={1.5} />
                Jetzt anrufen
              </a>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-sm font-bold tracking-widest uppercase border border-black hover:bg-black hover:text-white transition-colors inline-flex items-center justify-center gap-3"
                data-testid="hero-services-btn"
              >
                Unsere Services
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </motion.div>
          </div>

          {/* Hero Video */}
          <motion.div
            style={{ y }}
            className="lg:col-span-5 relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="aspect-[4/5] bg-zinc-900 overflow-hidden"
            >
              <video
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
                data-testid="hero-video"
              >
                <source src="https://customer-assets.emergentagent.com/job_site-refresh-126/artifacts/zi0lj0ys_2026_03_23_14_30_482.webm" type="video/webm" />
              </video>
            </motion.div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -left-6 bottom-12 bg-white shadow-xl p-6 hidden lg:block"
            >
              <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-2">Standort</p>
              <p className="font-heading font-bold">Im Isengrind 35</p>
              <p className="text-zinc-600">8046 Zürich</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Service Icons Strip */}
      <div className="mt-16 md:mt-24 border-t border-b border-zinc-200 py-8 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center gap-8 md:gap-16">
            <ServiceIcon icon={<Palette size={24} strokeWidth={1.5} />} label="Webdesign" />
            <ServiceIcon icon={<TrendingUp size={24} strokeWidth={1.5} />} label="SEO" />
            <ServiceIcon icon={<Megaphone size={24} strokeWidth={1.5} />} label="Marketing" />
            <ServiceIcon icon={<Code size={24} strokeWidth={1.5} />} label="Development" />
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceIcon = ({ icon, label }) => (
  <div className="flex items-center gap-3 text-zinc-600">
    {icon}
    <span className="hidden sm:block text-sm font-medium">{label}</span>
  </div>
);

// Services Section
const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    {
      icon: <Palette size={32} strokeWidth={1.5} />,
      title: 'Webdesign',
      description: 'Zeitloses Design trifft auf moderne Technologie. Wir erstellen Websites, die begeistern und konvertieren.',
      features: ['Responsive Design', 'UI/UX Optimierung', 'Corporate Identity', 'Mobile First']
    },
    {
      icon: <TrendingUp size={32} strokeWidth={1.5} />,
      title: 'SEO',
      description: 'Sichtbarkeit, die zählt. Wir bringen Sie nach oben – organisch, nachhaltig und messbar.',
      features: ['On-Page SEO', 'Technisches SEO', 'Content Strategy', 'Analytics & Reporting']
    },
    {
      icon: <Megaphone size={32} strokeWidth={1.5} />,
      title: 'Marketing',
      description: 'Strategien, die wirken. Von Social Media bis Content Marketing – wir erreichen Ihre Zielgruppe.',
      features: ['Social Media Marketing', 'Content Creation', 'PPC Kampagnen', 'Email Marketing']
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-[#FAFAFA]" ref={ref}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-zinc-500 mb-4">Was wir tun</p>
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight font-bold" data-testid="services-title">
            Services für Ihren<br />digitalen Erfolg
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="service-card bg-white border border-zinc-200 p-8 md:p-10 group cursor-pointer"
              data-testid={`service-card-${service.title.toLowerCase()}`}
            >
              <div className="mb-6 text-zinc-800">{service.icon}</div>
              <h3 className="font-heading text-2xl md:text-3xl tracking-tight font-semibold mb-4">{service.title}</h3>
              <p className="text-base leading-relaxed text-zinc-600 mb-6">{service.description}</p>
              <ul className="space-y-2 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="text-sm text-zinc-500 flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#FF3B30] rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                Mehr erfahren
                <ArrowRight size={16} strokeWidth={1.5} className="arrow-icon" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Section (without statistics)
const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 md:py-32 relative" ref={ref}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="aspect-square bg-zinc-100 overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1610496571096-8367bdbbae2b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwYWJzdHJhY3QlMjBhcmNoaXRlY3R1cmUlMjB3aGl0ZXxlbnwwfHx8fDE3NzY0NTM3NDZ8MA&ixlib=rb-4.1.0&q=85"
              alt="Modern architecture"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.2em] uppercase font-semibold text-zinc-500 mb-4"
            >
              Über WILDWAVE
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl tracking-tight font-bold mb-8"
              data-testid="about-title"
            >
              Ihr Partner für<br />digitalen Erfolg
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg leading-relaxed text-zinc-600 mb-8"
            >
              Von der ersten Idee bis zur erfolgreichen Online-Präsenz – wir begleiten Sie auf dem gesamten Weg. 
              Mit Leidenschaft und Expertise schaffen wir digitale Lösungen, die Ihr Unternehmen voranbringen.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg leading-relaxed text-zinc-600 mb-8"
            >
              Als Digitalagentur in Zürich verbinden wir kreatives Design mit technischer Exzellenz. 
              Wir verstehen die Bedürfnisse von Schweizer Unternehmen und liefern massgeschneiderte Lösungen.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              href="tel:+41782630406"
              className="btn-primary px-8 py-4 text-sm font-bold tracking-widest uppercase inline-flex items-center justify-center gap-3"
              data-testid="about-cta"
            >
              <Phone size={18} strokeWidth={1.5} />
              Jetzt Kontakt aufnehmen
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#FAFAFA]" ref={ref}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-zinc-500 mb-4">Kontakt</p>
            <h2 className="font-heading text-4xl md:text-5xl tracking-tight font-bold mb-8" data-testid="contact-title">
              Lassen Sie uns<br />zusammenarbeiten
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-zinc-600 mb-12">
              Haben Sie ein Projekt im Sinn? Wir freuen uns darauf, von Ihnen zu hören. 
              Rufen Sie uns an oder schreiben Sie uns – wir melden uns umgehend zurück.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                  <Phone size={20} strokeWidth={1.5} className="text-white" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-1">Telefon</p>
                  <a href="tel:+41782630406" className="font-heading text-xl font-semibold hover:text-[#FF3B30] transition-colors" data-testid="contact-phone">
                    +41 78 263 04 06
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                  <MapPin size={20} strokeWidth={1.5} className="text-white" />
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-1">Adresse</p>
                  <p className="font-heading text-xl font-semibold" data-testid="contact-address">
                    Im Isengrind 35<br />8046 Zürich
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8" data-testid="contact-form">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ihr Name *"
                  required
                  className="form-input"
                  data-testid="contact-name-input"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ihre E-Mail *"
                  required
                  className="form-input"
                  data-testid="contact-email-input"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ihre Telefonnummer"
                  className="form-input"
                  data-testid="contact-phone-input"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ihre Nachricht *"
                  required
                  rows={4}
                  className="form-input resize-none"
                  data-testid="contact-message-input"
                />
              </div>

              {submitStatus === 'success' && (
                <p className="text-green-600 text-sm" data-testid="contact-success-message">
                  Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-600 text-sm" data-testid="contact-error-message">
                  Es gab einen Fehler. Bitte versuchen Sie es erneut.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-4 text-sm font-bold tracking-widest uppercase inline-flex items-center justify-center gap-3 w-full md:w-auto disabled:opacity-50"
                data-testid="contact-submit-btn"
              >
                {isSubmitting ? 'Wird gesendet...' : (
                  <>
                    Nachricht senden
                    <Send size={18} strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = ({ onOpenImpressum, onOpenDatenschutz }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <a href="/" className="block mb-6" data-testid="footer-logo">
              <Logo light={true} />
            </a>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Ihre Digitalagentur in Zürich. Webdesign, SEO und Marketing – alles aus einer Hand.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-zinc-500 mb-4">Kontakt</p>
            <div className="space-y-3">
              <a href="tel:+41782630406" className="block text-white hover:text-[#FF3B30] transition-colors" data-testid="footer-phone">
                +41 78 263 04 06
              </a>
              <p className="text-zinc-400">Im Isengrind 35<br />8046 Zürich</p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase font-semibold text-zinc-500 mb-4">Navigation</p>
            <div className="space-y-3">
              <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="block text-white hover:text-[#FF3B30] transition-colors" data-testid="footer-nav-services">Services</button>
              <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="block text-white hover:text-[#FF3B30] transition-colors" data-testid="footer-nav-about">Über uns</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="block text-white hover:text-[#FF3B30] transition-colors" data-testid="footer-nav-contact">Kontakt</button>
            </div>
          </div>
        </div>

        {/* Large branding text */}
        <div className="border-t border-white/20 pt-12">
          <p className="font-heading text-[10vw] md:text-[8vw] leading-none font-black tracking-tighter opacity-20">
            WILDWAVE
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">© {currentYear} WILDWAVE. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenImpressum}
              className="text-zinc-500 text-sm hover:text-white transition-colors"
              data-testid="footer-impressum-link"
            >
              Impressum
            </button>
            <button 
              onClick={onOpenDatenschutz}
              className="text-zinc-500 text-sm hover:text-white transition-colors"
              data-testid="footer-datenschutz-link"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App
function App() {
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);

  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer 
        onOpenImpressum={() => setShowImpressum(true)} 
        onOpenDatenschutz={() => setShowDatenschutz(true)} 
      />
      <CookieBanner />
      <ImpressumModal isOpen={showImpressum} onClose={() => setShowImpressum(false)} />
      <DatenschutzModal isOpen={showDatenschutz} onClose={() => setShowDatenschutz(false)} />
    </div>
  );
}

export default App;

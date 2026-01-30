'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// =============================================================================
// DATA
// =============================================================================

const EDITORS = [
  { name: 'Andrew Feng', photo: '/andrew2.jpg' },
  { name: 'Sam Kim', photo: '/sam.jpg' },
];

const SCRIPTURE = [
  { section: 'Opening', verse: 'For where your treasure is, there your heart will be also.', ref: 'Matthew 6:21' },
  { section: 'Claim', verse: 'I came that they may have life and have it abundantly.', ref: 'John 10:10' },
  { section: 'Tension', verse: 'What does it profit a man to gain the whole world and forfeit his soul?', ref: 'Mark 8:36' },
  { section: 'Frame', verse: 'He must increase, but I must decrease.', ref: 'John 3:30' },
  { section: 'What', verse: 'Unless the Lord builds the house, those who build it labor in vain.', ref: 'Psalm 127:1' },
  { section: 'Not This', verse: 'Come to me, all who labor and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28' },
  { section: 'Why', verse: 'Am I now seeking the approval of man, or of God?', ref: 'Galatians 1:10' },
];

const NAV_LABELS = [null, 'Opening', 'Claim', 'Tension', 'Frame', 'What', 'Not This', 'Why', 'Scripture', null];
const TOTAL_PAGES = 10;

// =============================================================================
// HOOKS
// =============================================================================

function usePageNavigation(totalPages: number) {
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageIndex, setNextPageIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const playPageTurnSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const duration = 0.15;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const envelope = Math.pow(1 - t, 2) * Math.sin(t * Math.PI);
        data[i] = (Math.random() * 2 - 1) * envelope * 0.08;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;

      const gain = ctx.createGain();
      gain.gain.value = 0.3;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {
      // Audio not supported
    }
  }, []);

  const goToPage = useCallback((pageIndex: number) => {
    if (isTransitioning || pageIndex === currentPage || pageIndex < 0 || pageIndex >= totalPages) return;

    setNextPageIndex(pageIndex);
    setIsTransitioning(true);
    playPageTurnSound();

    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsTransitioning(false);
      setNextPageIndex(null);
    }, 450);
  }, [isTransitioning, currentPage, totalPages, playPageTurnSound]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
        nextPage();
      } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage]);

  // Wheel navigation
  useEffect(() => {
    let lastScrollTime = 0;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime < 800 || isTransitioning) return;
      if (e.deltaY > 30) { nextPage(); lastScrollTime = now; }
      else if (e.deltaY < -30) { prevPage(); lastScrollTime = now; }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [nextPage, prevPage, isTransitioning]);

  // Touch navigation
  useEffect(() => {
    let touchStartY = 0, touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const diffY = touchStartY - e.changedTouches[0].clientY;
      const diffX = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
        diffY > 0 ? nextPage() : prevPage();
      } else if (Math.abs(diffX) > 50) {
        diffX > 0 ? nextPage() : prevPage();
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextPage, prevPage, isTransitioning]);

  return { currentPage, nextPageIndex, isTransitioning, goToPage, nextPage };
}

// =============================================================================
// COMPONENTS
// =============================================================================

function PageContent({ label, children, className = '' }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`page-center ${className}`}>
      {label && <p className="label">{label}</p>}
      {children}
    </div>
  );
}

function ScriptureIndex() {
  return (
    <div className="scripture-index">
      {SCRIPTURE.map(({ section, verse, ref }) => (
        <div key={section} className="scripture-row">
          <span className="scripture-section">{section}</span>
          <span className="scripture-verse">&ldquo;{verse}&rdquo; <span className="scripture-ref">{ref}</span></span>
        </div>
      ))}
    </div>
  );
}

function EditorsSection() {
  return (
    <div className="editors-section">
      <p className="editors-label">Editors</p>
      <div className="editors-row">
        {EDITORS.map(({ name, photo }) => (
          <div key={name} className="editor">
            <img src={photo} alt={name} width={50} height={50} className="editor-photo" />
            <span className="editor-name">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterForm() {
  return (
    <form
      className="newsletter-inline"
      action="https://docs.google.com/forms/d/e/1FAIpQLSeydv04kVKPxTOpNEHdEdIsm7QpmmTDRD-yae7h9ukq8fdpAA/formResponse"
      method="POST"
      target="_blank"
      aria-label="Newsletter signup"
    >
      <input
        type="email"
        name="entry.765071488"
        placeholder="your@email.com"
        className="newsletter-input"
        required
        aria-label="Email address"
        autoComplete="email"
      />
      <button type="submit" className="newsletter-button" aria-label="Subscribe to newsletter">Subscribe</button>
    </form>
  );
}

// =============================================================================
// PAGE DEFINITIONS
// =============================================================================

const pages = [
  // Page 1: Title
  <div key="1" className="page-center title-page">
    <h1>Theology of Ambition</h1>
    <p className="subtitle">A theological project for builders, founders, and Christians who feel the tension between ambition and faithfulness.</p>
  </div>,

  // Page 2: Opening
  <PageContent key="2" label="The Opening">
    <p>Every ambition moves toward an end.</p>
    <p className="dim">The church is uneasy with ambition.<br />So we avoid it. Or excuse it.</p>
    <p>Meanwhile, ambition quietly shapes leaders.</p>
    <p>Sometimes toward faithfulness.<br />Sometimes toward exhaustion or collapse.</p>
    <p className="question">Where is your ambition taking you?</p>
  </PageContent>,

  // Page 3: Claim
  <PageContent key="3" label="The Claim">
    <p>Ambition doesn&apos;t need to <span className="cross-out">die</span>.<br />It needs a true end.</p>
    <p className="dim">Intensity isn&apos;t the problem.<br />Direction is.</p>
  </PageContent>,

  // Page 4: Tension
  <PageContent key="4" label="The Tension">
    <p>Ambition builds.<br />Leads.<br />Multiplies.</p>
    <p>It also narrows vision.<br />Speeds decisions.<br />Reveals what we really want.</p>
    <p className="emphasis">Not every end is worth reaching.</p>
  </PageContent>,

  // Page 5: Frame
  <PageContent key="5" label="The Frame" className="page-frame">
    <p>We were made to build, not drift.</p>
    <p>Christ chose limits before influence.</p>
    <p>Faithfulness is not optimization.</p>
    <p>Every ambition moves toward an end.</p>
    <p>It will cost speed, certainty, and applause.</p>
    <p className="emphasis">If it fractures people, it has missed the way.</p>
  </PageContent>,

  // Page 6: What This Is
  <PageContent key="6" label="What This Is">
    <p>A theological project.<br />A curated collection of voices.</p>
    <p className="dim">Written for founders, operators, and Christians<br />who feel the tension.</p>
    <p>For builders seeking faithfulness, not just fruit.<br />For those tired of choosing between ambition and discipleship.</p>
  </PageContent>,

  // Page 7: What This Isn't
  <PageContent key="7" label="What This Isn't">
    <p className="strike-static">Hustle theology.</p>
    <p className="strike-static">Career advice.</p>
    <p className="strike-static">Permission to keep going faster.</p>
  </PageContent>,

  // Page 8: Why This
  <PageContent key="8" label="Why This Project" className="page-why-this">
    <p className="emphasis">Being well known is not the same as being known well.</p>
    <p>We&apos;ve spent years around ambitious Christians who loved God and worked hard.</p>
    <p>We&apos;ve seen ambition bear fruit&mdash;<br />and quietly bend good desires.</p>
    <p>Avoiding this felt safer.<br />Naming it felt costly.</p>
    <EditorsSection />
  </PageContent>,

  // Page 9: Scripture
  <PageContent key="9" label="Scriptural Foundations" className="page-scripture">
    <ScriptureIndex />
  </PageContent>,

  // Page 10: Closing
  <div key="10" className="page-center page-closing">
    <p>If something here resonated&mdash;<br />if you&apos;ve felt this tension&mdash;</p>
    <p className="dim">we&apos;d like to hear from you.</p>
    <div className="closing-cta">
      <a href="mailto:andrewfengdts@gmail.com" className="closing-link">Start a conversation</a>
    </div>
    <p className="closing-note">Join a small list of thoughtful builders. Essays, interviews, and reflections as this unfolds. No spam, just substance.</p>
    <NewsletterForm />
  </div>,
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Home() {
  const bookRef = useRef<HTMLDivElement>(null);
  const { currentPage, nextPageIndex, isTransitioning, goToPage, nextPage } = usePageNavigation(TOTAL_PAGES);

  // Preload editor images on mount to prevent flash
  useEffect(() => {
    EDITORS.forEach(({ photo }) => {
      const img = new Image();
      img.src = photo;
    });
  }, []);

  const getPageVariant = (index: number) => index % 2 === 0 ? 'page--dark' : 'page--light';
  const isOnTitlePage = currentPage === 0;

  return (
    <div className="book" ref={bookRef}>
      <button
        className={`site-logo ${isOnTitlePage ? 'hidden' : ''}`}
        onClick={() => goToPage(0)}
        aria-label="Go to home page"
        aria-hidden={isOnTitlePage}
        tabIndex={isOnTitlePage ? -1 : 0}
      >
        Theology of Ambition
      </button>

      <nav className={`section-nav ${isOnTitlePage ? 'hidden' : ''}`} aria-label="Page sections" aria-hidden={isOnTitlePage}>
        {NAV_LABELS.map((label, i) => label && (
          <button
            key={i}
            className={`section-nav-item ${currentPage === i ? 'active' : ''}`}
            onClick={() => goToPage(i)}
            aria-current={currentPage === i ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>

      <nav className="page-dots" aria-label="Page navigation">
        {Array.from({ length: TOTAL_PAGES }, (_, i) => (
          <button
            key={i}
            className={`page-dot ${currentPage === i ? 'active' : ''}`}
            onClick={() => goToPage(i)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </nav>

      <div className="book-pages">
        {isTransitioning && nextPageIndex !== null && (
          <section className={`page page-next transitioning-in ${getPageVariant(nextPageIndex)}`}>
            <div className="page-inner">{pages[nextPageIndex]}</div>
          </section>
        )}

        <section className={`page page-current ${getPageVariant(currentPage)} ${isTransitioning ? 'transitioning-out' : ''}`}>
          <div className="page-inner">{pages[currentPage]}</div>
        </section>
      </div>

      {currentPage < TOTAL_PAGES - 1 && !isTransitioning && (
        <button
          className="scroll-hint"
          onClick={nextPage}
          aria-label="Continue to next page"
        >
          <span>Continue</span>
        </button>
      )}

      <div className="page-number" aria-live="polite" aria-atomic="true">
        <span className="sr-only">Page </span>{currentPage + 1} / {TOTAL_PAGES}
      </div>

      {currentPage < TOTAL_PAGES - 1 && (
        <button
          className="skip-to-subscribe"
          onClick={() => goToPage(TOTAL_PAGES - 1)}
          aria-label="Skip to subscribe page"
        >
          Skip to subscribe
        </button>
      )}
    </div>
  );
}

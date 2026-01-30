'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageIndex, setNextPageIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);

  const totalPages = 9;

  const playPageTurnSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const duration = 0.15;
      const bufferSize = audioContext.sampleRate * duration;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      // Simple paper rustle - quick burst of filtered noise
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        // Fast attack, quick decay
        const envelope = Math.pow(1 - t, 2) * Math.sin(t * Math.PI);
        data[i] = (Math.random() * 2 - 1) * envelope * 0.08;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      // Bandpass filter for paper-like sound
      const filter = audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;

      const gain = audioContext.createGain();
      gain.gain.value = 0.3;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);
      source.start();
    } catch (e) {
      // Audio not supported
    }
  };

  const goToPage = (pageIndex: number) => {
    if (isTransitioning || pageIndex === currentPage || pageIndex < 0 || pageIndex >= totalPages) return;

    setNextPageIndex(pageIndex);
    setIsTransitioning(true);
    playPageTurnSound();

    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsTransitioning(false);
      setNextPageIndex(null);
    }, 450);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

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
  });

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
        if (diffY > 0) nextPage(); else prevPage();
      } else if (Math.abs(diffX) > 50) {
        if (diffX > 0) nextPage(); else prevPage();
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  });

  const pageContents = [
    // PAGE 1: TITLE
    <div key="1" className="page-center title-page">
      <h1>Theology of Ambition</h1>
      <p className="subtitle">A theological project for builders, founders, and Christians who feel the tension between ambition and faithfulness.</p>
    </div>,

    // PAGE 2: WHY THIS
    <div key="2" className="page-center page-why-this">
      <p className="label">Why This Project</p>
      <p className="emphasis">Being well known is not the same as being known well.</p>
      <p>We've spent years around ambitious Christians who loved God and worked hard.</p>
      <p>We've seen ambition bear fruit—<br />and quietly bend good desires.</p>
      <p>Avoiding this felt safer.<br />Naming it felt costly.</p>
      <p>Every ambition moves toward an end.<br />The question is whether that end leads toward faithfulness—or away from it.</p>
      <div className="editors-section">
        <p className="editors-label">Editors</p>
        <div className="editors-row">
          <div className="editor">
            <img src="/andrew2.jpg" alt="Andrew Feng" width={50} height={50} className="editor-photo" />
            <span className="editor-name">Andrew Feng</span>
          </div>
          <div className="editor">
            <img src="/sam.jpg" alt="Sam Kim" width={50} height={50} className="editor-photo" />
            <span className="editor-name">Sam Kim</span>
          </div>
          <div className="editor">
            <img src="/samuel.jpg" alt="Samuel Chiang" width={50} height={50} className="editor-photo" />
            <span className="editor-name">Samuel Chiang</span>
          </div>
        </div>
      </div>
    </div>,

    // PAGE 3: OPENING
    <div key="3" className="page-center">
      <p className="label">The Opening</p>
      <p>Every ambition moves toward an end.</p>
      <p className="dim">The church is uneasy with ambition.<br />So we avoid it. Or excuse it.</p>
      <p>Meanwhile, ambition quietly shapes leaders.</p>
      <p>Sometimes toward faithfulness.<br />Sometimes toward exhaustion or collapse.</p>
      <p className="question">Where is your ambition taking you?</p>
    </div>,

    // PAGE 4: THE CLAIM
    <div key="4" className="page-center">
      <p className="label">The Claim</p>
      <p>Ambition doesn't need to <span className="cross-out">die</span>.<br />It needs a true end.</p>
      <p className="dim">Intensity isn't the problem.<br />Direction is.</p>
    </div>,

    // PAGE 5: THE TENSION
    <div key="5" className="page-center">
      <p className="label">The Tension</p>
      <p>Ambition builds.<br />Leads.<br />Multiplies.</p>
      <p>It also narrows vision.<br />Speeds decisions.<br />Reveals what we really want.</p>
      <p className="emphasis">Not every end is worth reaching.</p>
    </div>,

    // PAGE 6: THE FRAME
    <div key="6" className="page-center">
      <p className="label">The Frame</p>
      <p>We were made to build, not drift.<br />Christ chose limits before influence.<br />Faithfulness is not optimization.<br />Every ambition moves toward an end.<br />It will cost speed, certainty, and applause.<br />If it fractures people, it has missed the way.</p>
    </div>,

    // PAGE 7: WHAT THIS IS
    <div key="7" className="page-center">
      <p className="label">What This Is</p>
      <p>A theological project.<br />A curated collection of voices.</p>
      <p className="dim">Written for founders, operators, and Christians<br />who feel the tension.</p>
      <p>For builders seeking faithfulness, not just fruit.<br />For those tired of choosing between ambition and discipleship.</p>
    </div>,

    // PAGE 8: WHAT THIS ISN'T
    <div key="8" className="page-center">
      <p className="label">What This Isn't</p>
      <p className="strike-static">Hustle theology.</p>
      <p className="strike-static">Career advice.</p>
      <p className="strike-static">Permission to keep going faster.</p>
    </div>,

    // PAGE 9: CLOSING
    <div key="9" className="page-center page-closing">
      <p>If something here resonated—<br />if you've felt this tension—</p>
      <p className="dim">we'd like to hear from you.</p>

      <div className="closing-cta">
        <a href="mailto:andrewfengdts@gmail.com" className="closing-link">Start a conversation</a>
      </div>

      <p className="closing-note">Join a small list of thoughtful builders. We'll share essays, interviews, and reflections as this unfolds—no spam, just substance.</p>

      <form
        className="newsletter-inline"
        action="https://docs.google.com/forms/d/e/1FAIpQLSeydv04kVKPxTOpNEHdEdIsm7QpmmTDRD-yae7h9ukq8fdpAA/formResponse"
        method="POST"
        target="_blank"
      >
        <input
          type="email"
          name="entry.765071488"
          placeholder="your@email.com"
          className="newsletter-input"
          required
        />
        <button type="submit" className="newsletter-button">Subscribe</button>
      </form>
    </div>,
  ];

  const pageVariants = [
    'page--dark', 'page--light', 'page--dark', 'page--light', 'page--dark', 'page--light', 'page--dark', 'page--light', 'page--dark'
  ];

  const pageLabels = [
    null,           // Page 1: Title (no label)
    'Why',          // Page 2: Why This
    'Opening',      // Page 3: Opening
    'Claim',        // Page 4
    'Tension',      // Page 5
    'Frame',        // Page 6
    'What',         // Page 7
    'Not This',     // Page 8
    null,           // Page 9: Closing (no label)
  ];

  return (
    <div className="book" ref={bookRef}>
      {/* Logo - top left */}
      <button className="site-logo" onClick={() => goToPage(0)}>
        Theology of Ambition
      </button>

      {/* Section navigation - top right */}
      <div className="section-nav">
        {pageLabels.map((label, i) => label && (
          <button
            key={i}
            className={`section-nav-item ${currentPage === i ? 'active' : ''}`}
            onClick={() => goToPage(i)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Page dots */}
      <div className="page-dots">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-dot ${currentPage === i ? 'active' : ''}`}
            onClick={() => goToPage(i)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>

      <div className="book-pages">
        {isTransitioning && nextPageIndex !== null && (
          <section className={`page page-next transitioning-in ${pageVariants[nextPageIndex]}`}>
            <div className="page-inner">{pageContents[nextPageIndex]}</div>
          </section>
        )}

        <section
          className={`page page-current ${pageVariants[currentPage]} ${
            isTransitioning ? 'transitioning-out' : ''
          }`}
        >
          <div className="page-inner">{pageContents[currentPage]}</div>
        </section>
      </div>

      {currentPage < totalPages - 1 && !isTransitioning && (
        <button className="scroll-hint" onClick={nextPage}>
          <span>Continue</span>
        </button>
      )}

      <div className="page-number">{currentPage + 1} / {totalPages}</div>

      {/* Skip to subscribe button - hidden on last page */}
      {currentPage < totalPages - 1 && (
        <button className="skip-to-subscribe" onClick={() => goToPage(totalPages - 1)}>
          Skip to subscribe
        </button>
      )}
    </div>
  );
}

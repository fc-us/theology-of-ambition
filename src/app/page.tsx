'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageIndex, setNextPageIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);

  const totalPages = 8;

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
    }, 750);
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
    <div key="1" className="page-center">
      <h1>Theology of Ambition</h1>
    </div>,

    // PAGE 2: OPENING
    <div key="2" className="page-center">
      <p>Every ambition moves toward an end.</p>
      <p className="dim">The church is uneasy with ambition.</p>
      <p className="dim">So we avoid it. Or excuse it.</p>
      <p>Ambition quietly shapes leaders.</p>
      <p>Sometimes toward faithfulness.</p>
      <p>Sometimes toward exhaustion or collapse.</p>
      <p className="question">Where is your ambition taking you?</p>
    </div>,

    // PAGE 3: THE CLAIM
    <div key="3" className="page-center">
      <p className="label">The Claim</p>
      <p>Ambition doesn't need to <span className="cross-out">die</span>.</p>
      <p className="emphasis">It needs a true end.</p>
      <p className="dim">Intensity isn't the issue.</p>
      <p className="dim">Direction toward the right end is.</p>
    </div>,

    // PAGE 4: THE TENSION
    <div key="4" className="page-center">
      <p className="label">The Tension</p>
      <p>Ambition builds. Leads. Multiplies.</p>
      <p>But it also narrows vision. Speeds decisions.</p>
      <p>And reveals what we really want.</p>
      <p className="emphasis">Not every end is worth reaching.</p>
    </div>,

    // PAGE 5: THE FRAME
    <div key="5" className="page-center">
      <p className="label">The Frame</p>
      <p className="dim">This project stands on six convictions.</p>
      <p>We were made to build, not to drift.</p>
      <p>Christ embraced limits before influence.</p>
      <p>The faithful path includes loss.</p>
      <p>Every ambition is exposed by where it leads.</p>
      <p>The mission of God is not modest.</p>
      <p>If ambition fractures people, it has lost its way.</p>
    </div>,

    // PAGE 6: WHAT THIS IS
    <div key="6" className="page-center">
      <p className="label">What This Is</p>
      <p>A theological project.</p>
      <p>A curated collection of voices.</p>
      <p className="dim">Pastors. Builders. Theologians.</p>
      <p className="label">Who It's For</p>
      <p>Leaders who feel the tension.</p>
      <p>Builders wanting faithfulness, not just fruit.</p>
      <p className="emphasis">Tired of choosing between ambition and discipleship.</p>
    </div>,

    // PAGE 7: WHAT THIS ISN'T
    <div key="7" className="page-center">
      <p className="label">What This Isn't</p>
      <p className="strike-static">Hustle theology</p>
      <p className="strike-static">Career advice</p>
      <p className="strike-static">Permission to keep going faster</p>
    </div>,

    // PAGE 8: CLOSING
    <div key="8" className="page-center page-closing">
      <p>If something here resonated—</p>
      <p>if you've felt this tension—</p>
      <p className="dim">we'd like to hear from you.</p>

      <div className="closing-cta">
        <a href="mailto:your-email@domain.com" className="closing-link">Start a conversation</a>
      </div>

      <p className="closing-note">
        Or stay close. We'll share reflections as this unfolds.
      </p>

      <form className="newsletter-inline" action="#" method="POST">
        <input
          type="email"
          placeholder="your@email.com"
          className="newsletter-input"
          required
        />
        <button type="submit" className="newsletter-button">Subscribe</button>
      </form>
    </div>,
  ];

  const pageVariants = [
    'page--dark', 'page--light', 'page--dark', 'page--light', 'page--dark', 'page--light', 'page--dark', 'page--light'
  ];

  const pageLabels = [
    null,           // Page 1: Title (no label)
    null,           // Page 2: Opening (no label)
    'The Claim',    // Page 3
    'The Tension',  // Page 4
    'The Frame',    // Page 5
    'What This Is', // Page 6
    'What This Isn\'t', // Page 7
    null,           // Page 8: Closing (no label)
  ];

  return (
    <div className="book" ref={bookRef}>
      {/* Navigation */}
      <nav className="nav">
        <Link href="/about" className="nav-link">Why This</Link>
      </nav>

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
    </div>
  );
}

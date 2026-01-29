import Link from 'next/link';

export default function About() {
  return (
    <div className="static-page">
      <div className="section-nav about-nav">
        <Link href="/" className="back-link">← Back</Link>
        <Link href="/" className="section-nav-item">The Claim</Link>
        <Link href="/" className="section-nav-item">The Tension</Link>
        <Link href="/" className="section-nav-item">The Frame</Link>
        <Link href="/" className="section-nav-item">What This Is</Link>
        <Link href="/" className="section-nav-item">What This Isn't</Link>
        <span className="nav-link nav-link-active">Why This</span>
      </div>

      <article className="article">
        <h1>Why This Project</h1>

        <p className="lead">This project began with a quiet tension:</p>

        <p className="emphasis">Being well known is not the same as being known well.</p>

        <p>I've spent years around ambitious Christians—pastors, founders, builders—people who loved God sincerely and worked hard faithfully.</p>

        <p>I've seen ambition bear fruit.</p>
        <p>I've also seen it quietly bend good desires.</p>

        <p>Avoiding the subject felt safer.</p>
        <p>Naming it felt costly.</p>

        <p>This is a painful project to write because ambition isn't abstract.</p>
        <p className="emphasis">It's personal.</p>

        <p>Every ambition moves toward an end.</p>
        <p>The question is whether that end leads toward faithfulness—or away from it.</p>

        <div className="author-signature">
          <img
            src="/andrew.jpg"
            alt="Andrew Feng"
            width={80}
            height={80}
            className="author-photo"
          />
          <p className="signature">— Andrew Feng</p>
        </div>
      </article>
    </div>
  );
}

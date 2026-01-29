import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <div className="static-page">
      <nav className="nav">
        <Link href="/" className="nav-link">Back</Link>
      </nav>

      <article className="article article-two-col">
        <div className="article-main">
          <h1>Why This Project</h1>

          <p className="lead">This project began with a quiet tension:</p>

          <p className="emphasis">Being well known is not the same as being known well.</p>

          <p>
            I've spent years around ambitious Christians—pastors, founders, builders—people who loved God sincerely and worked hard faithfully.
          </p>

          <p>I've seen ambition produce fruit.</p>
          <p>I've also seen it quietly distort good desires.</p>

          <p>Avoiding the subject felt safer.</p>
          <p>Naming it felt costly.</p>

          <p>This is a painful project to write because ambition isn't abstract.</p>
          <p className="emphasis">It's personal.</p>

          <p>
            Every ambition moves toward an end. The question is whether that end leads us toward faithfulness—or away from it.
          </p>

          <p>Some lessons are learned slowly.</p>
          <p>Some stories are told carefully.</p>
          <p>This is one of them.</p>

          <div className="author-signature">
            <Image
              src="/andrew.jpg"
              alt="Andrew Feng"
              width={80}
              height={80}
              className="author-photo"
            />
            <p className="signature">— Andrew Feng</p>
          </div>
        </div>

        <aside className="article-sidebar">
          <h2>Who should contribute</h2>
          <ul className="contributor-list">
            <li>Pastors and theologians</li>
            <li>Founders, executives, builders</li>
            <li>Scholars for a general audience</li>
            <li>Anyone with a distinctive angle</li>
          </ul>

          <h2>Compensation</h2>
          <p>
            Modest honorarium and copies of the finished book. The goal is contribution, not compensation.
          </p>

          <h2>To express interest</h2>
          <p>
            Email <a href="mailto:your-email@domain.com">your-email@domain.com</a> with a brief note on your background and angle.
          </p>
        </aside>
      </article>
    </div>
  );
}

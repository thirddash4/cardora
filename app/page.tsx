const cardUrl = 'https://third-bilingual-card.vercel.app';

export default function Home() {
  return (
    <main className="shell" aria-label="Third credit-card-size bilingual business card">
      <section className="credit-card" aria-labelledby="name">
        <div className="card-face">
          <div className="content">
            <div className="topline">
              <span>Digital Card</span>
              <span lang="th">นามบัตรดิจิทัล</span>
            </div>

            <div className="identity">
              <p className="eyebrow">THIRD</p>
              <h1 id="name">Third</h1>
              <p className="thai-name" lang="th">คุณ Third</p>
            </div>

            <p className="statement">
              Systems · AI Ops · Growth
              <span lang="th">ระบบ · AI Ops · การเติบโต</span>
            </p>
          </div>

          <div className="scan" aria-label="Scan QR code for this digital card">
            <div className="qr-wrap">
              <img src="/qr.svg" alt="QR code linking to Third digital business card" />
            </div>
            <p>Scan / สแกน</p>
            <a href={cardUrl}>{cardUrl.replace('https://', '')}</a>
          </div>
        </div>
      </section>
    </main>
  );
}

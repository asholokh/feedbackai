import Head from 'next/head';

export default function Home() {
  return (
      <>
        <Head>
          <title>FeedbackAi</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="style.css" />
        </Head>
        <header className="header">
          <div className="logo">
            <img src="assets/icon-main.png" alt="FeedbackAi logo" />
            <h1>FeedbackAi</h1>
          </div>
          <a className="login-link" href="#">
            Log in
          </a>
        </header>

        <main className="main-content">
          <h2 className="main-heading">AI-powered feedback generator for managers</h2>
          <p className="subheading">
            Easily compile substantial feedback for your team with the help of AI.
          </p>
          <a href="#" className="cta-button">
            Get Started
          </a>

          <section className="features">
            <div className="feature">
              <img src="assets/icon-main.png" alt="Collect Feedback" />
              <h3>Collect Feedback</h3>
              <p>Gather feedback snippets for each team member over time</p>
            </div>
            <div className="feature">
              <img src="assets/icon-generate-reports.png" alt="Generate Reports" />
              <h3>Generate Reports</h3>
              <p>
                Compile the feedback into detailed reports, either formal or
                informal
              </p>
            </div>
            <div className="feature">
              <img src="assets/icon-review-and-edit.png" alt="Review and Edit" />
              <h3>Review and Edit</h3>
              <p>Easily review the generated feedback and make any necessary edits</p>
            </div>
          </section>
        </main>
      </>
  );
}
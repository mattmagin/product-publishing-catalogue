import './App.css'

function App() {
  return (
    <main className="remote-shell">
      <section className="remote-panel" aria-labelledby="remote-title">
        <div className="remote-eyebrow">Module Federation remote</div>
        <div className="remote-heading-row">
          <div>
            <h1 id="remote-title">Product publishing frontend</h1>
            <p>
              A pluggable React microfrontend for the universal store product
              publishing catalogue.
            </p>
          </div>
          <span className="remote-status">Ready</span>
        </div>

        <dl className="remote-facts">
          <div>
            <dt>Remote name</dt>
            <dd>product_publishing_frontend</dd>
          </div>
          <div>
            <dt>Exposed module</dt>
            <dd>./App</dd>
          </div>
          <div>
            <dt>Manifest</dt>
            <dd>/mf-manifest.json</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}

export default App

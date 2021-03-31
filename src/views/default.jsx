var React = require('react')

function DefaultLayout({ children }) {
  return (
    <html>
      <head>
        <title>Agoric Node Installer helper app</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
          crossOrigin="anonymous"
        ></link>
      </head>
      <body style={{ paddingTop: 48 }}>
        <div className="container">{children}</div>
      </body>
    </html>
  )
}

module.exports = DefaultLayout

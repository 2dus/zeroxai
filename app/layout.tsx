export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Zerox AI</title>
        <meta name="description" content="AI coding assistant" />
      </head>
      <body>{children}</body>
    </html>
  )
}

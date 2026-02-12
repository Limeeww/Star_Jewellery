const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network https://apis.google.com https://*.firebaseapp.com",
              "style-src 'self' 'unsafe-inline' https://m.stripe.network https://fonts.googleapis.com",
              "frame-src 'self' https://js.stripe.com https://m.stripe.network https://*.firebaseapp.com",
              "connect-src 'self' https://*.stripe.com https://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com",
              "img-src 'self' data: blob: https://*.stripe.com https://*.googleapis.com https://*.googleusercontent.com https://firebasestorage.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

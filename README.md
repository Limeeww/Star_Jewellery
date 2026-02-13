# Star Jewellery 💎

A modern, full-stack e-commerce application built with **Next.js 15**, **TypeScript**, and **Firebase**. This project demonstrates a scalable architecture, secure payment processing, and a comprehensive admin dashboard for managing products and orders.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Functions), Next.js API Routes
- **Forms & Validation:** React Hook Form
- **Payments:** Stripe Integration
- **UI Components:** React Icons, React Responsive Carousel

## ✨ Key Features

- **🛍️ E-commerce Experience**:
  - Responsive and interactive product catalog.
  - Dynamic shopping cart and secure checkout flow with Stripe.
  - User favorites/wishlist functionality.

- **👤 User Authentication**:
  - Secure sign-up/login using Firebase Authentication.
  - Profile management and order history.

- **🛠️ Admin Dashboard**:
  - **Product Management**: Create, edit, and delete products with image uploads.
  - **Collections**: Manage product categories and collections.
  - **Discounts**: Create and manage discounts.
  - **Role Management**: Administer user roles and permissions.

- **📱 Mobile First**: Fully responsive design ensuring a seamless experience across all devices.

## 📦 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/star-jewellery.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Firebase and Stripe credentials:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   STRIPE_SECRET_KEY=...
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open locally:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Live Demo

The application is deployed and available at: **[star-jewellery.vercel.app](https://star-jewellery.vercel.app)**

---

_Developed by Dmytro Tiurin & Anastasiia Starukhina_

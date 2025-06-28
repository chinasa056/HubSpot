# 🚀 HubSpot

HubSpot is a platform that connects professionals in Lagos with flexible coworking spaces and creative hubs. With 43% of Lagos professionals working remotely 1–2 days per week and over 400 startups in the city, the demand for affordable and convenient workspaces is rising (Stears, 2023). High commuting costs due to traffic and fuel prices further increase the need for local, reliable alternatives. FlexiSpace makes it simple to discover and book verified workspaces — offering a cost-effective solution that fosters productivity and collaboration.


## 📌 Problem Statement

With soaring commuting costs and rapid urbanization in Lagos, professionals struggle to find affordable, verified coworking and creative spaces. Many available options lack transparency, convenience, and the community needed for networking and collaboration.



## ✅ Solution

FlexiSpace provides a seamless platform for discovering, booking, and managing verified coworking spaces and creative hubs across Lagos. By eliminating the hassle of searching for quality spaces and offering centralized booking and reviews, FlexiSpace meets the city’s growing need for flexible, cost-effective workspace solutions — while empowering hosts with tools for listing, managing availability, and secure payments.


## 🎯 Goals & Objectives

* **Seamless Discovery:** Effortlessly find remote workspaces and creative hubs that match users’ needs.
* **Trustworthy Listings:** Verified and accurate listings for peace of mind.
* **Flexible Options:** Rental plans for various durations and budgets.
* **Cost Efficiency:** Reduce expenses versus traditional leases and long commutes.
* **Community Engagement:** Enable reviews and networking opportunities.
* **User-Friendly Experience:** Intuitive platform from search to booking.


## ✨ Key Features

* **User Registration & Authentication**
  Secure user and host sign-up/login with profile management.

* **Dashboard Overview**
  Unified dashboard for bookings and availability.

* **Space Listings**
  Detailed profiles with photos, amenities, descriptions, and pricing.

* **Availability Calendars**
  Real-time calendars for scheduling and bookings.

* **Booking System**
  Seamless booking and secure payments.

* **User Reviews & Ratings**
  Feedback system to ensure quality and trust.

* **Notifications & Alerts**
  Booking confirmations, reminders, and special offers via email.

# ➕ Payout Feature for Hosts

FlexiSpace includes a **Payout System** for hosts. When a space is booked and the payment is completed, the host’s earnings are tracked. Hosts can securely withdraw their balance through integrated payout APIs (e.g., Kora Pay). The payout system ensures quick, automated transfers and clear transaction histories for hosts.

**Highlights:**

* Automated payout requests.
* Secure transaction processing.
* Dashboard view for hosts to track earnings and withdrawal status.
* Webhooks for real-time payout status updates.

This feature empowers space providers with financial transparency and ease of fund management.

## 👥 Target Audience

**Primary Users:**

* Remote workers & freelancers
* Creatives & entrepreneurs
* Digital nomads
* Startups & small teams

**Secondary Users:**

* Landlords & property owners
* Creative studio owners
* Coworking hub owners

---

## 📊 Research & Insights

**Methodology:**

* *Quantitative:* Surveys via Google Forms for primary users
* *Qualitative:* Interviews with hosts (secondary users)

**Key Findings:**

* The 26–35 age group equally prefers coworking spaces and creative hubs.
* Major challenges: High costs, location issues, scheduling conflicts, safety concerns.
* 88% would use an online platform to book affordable spaces in Lagos.
* Top features: Detailed listings, secure booking/payment, and user reviews.
* 71% gave strong positive interest in using a dedicated platform for workspaces and co-living.

**Actionable Decisions:**

* Build trust with verified listings and transparency.
* Include real-time availability and secure payments.
* Offer dynamic, competitive pricing.
* Strengthen customer support.
* Foster community through events and reviews.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** SQL (via Sequelize ORM)
* **File Storage:** Cloudinary for image uploads
* **Authentication:** JWT or similar
* **Other Tools:** Lodash


---

## 🚀 Getting Started

### 1️⃣ Prerequisites

* Node.js 
* npm or yarn
* SQL database (MySQL and Sequelize)
* Cloudinary account

### 2️⃣ Clone & Install

```bash
git clone https://github.com/chinasa056/HubSpot
cd HubSpot
npm install
```

### 3️⃣ Setup Environment

Create a `.env` file:

```
DATABASE_NAME = 
DATABASE_USERNAME = 
DATABASE_PASSWORD = 
DATABASE_HOST = 
DATABASE_DIALECT = 

CLOUD_NAME = 
API_KEY = 
API_SECRET = 
```

### 4️⃣ Run Migrations (if any)

```bash
npx sequelize db:migrate
```

### 5️⃣ Start Server

```bash
npm run dev
```

Visit: `http://localhost:PORT`

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests. Follow best practices for code style and commit messages.

---

## 📫 Contact

* Backend Lead: \[Chinasa Acha]
* Email: \[[chinasaacha05@gmail.com](mailto:chinasaacha05@gmail.com)]
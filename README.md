Local Job Board App

A simple, privacy-friendly platform where local community members can post and find small, short-term jobs and gigs — without accounts, tracking, or paywalls.

Overview

This project provides a community-focused job board for local gig-style work. It allows users to post and browse local jobs without creating an account. Each post includes contact information and a one-word passphrase that enables the original poster to remove the job listing later. Posts automatically expire after 2 weeks to keep listings current.

Moderation tools are included via a hidden admin route and Firebase authentication, allowing for spam management and content review. The app also includes a roadmap for sponsors and local business event listings.

Features

Post short-term or one-time local jobs (e.g., yard work, help moving, babysitting)

No account required — just your contact info and a passphrase to remove posts

Job posts auto-expire after 2 weeks

Browse by location

Report posts for spam or inappropriate content

Admin panel with Firebase login for moderation

Sponsor and event support planned for local businesses

Tech Stack

Frontend: React + TypeScript + TailwindCSS

Backend: Node.js + Express

Database: PostgreSQL (hosted on Render)

Auth: Firebase (admin-only)

Deployment: GitHub + Render

Getting Started

1. Clone the Repository

git clone https://github.com/yourusername/local-job-board.git
cd local-job-board

2. Set up environment variables

Create a .env file in both the frontend and backend with values like:

Backend (.env)

DATABASE_URL=postgres://youruser:yourpass@yourhost:5432/community_board
MASTER_PASSPHRASE=YourStrongMasterKeyHere

Frontend (.env for Vite)

VITE_API_URL=https://your-backend.onrender.com

3. Run Locally

Backend

cd server
npm install
npm start

Frontend

cd client
npm install
npm run dev

Admin Access

Admin route is hidden and requires:

Clicking the header title 10 times within 6 seconds to reveal

Firebase login with authorized credentials

Reported Posts

Admin users can:

View all reported posts

Remove inappropriate content

Use a master passphrase to override any post deletion

Upcoming Features

Event board for local business promotions

Sponsor submission system

Community improvement feedback form

Contributing

Have an idea to improve the project? Fork the repo and open a PR — or submit feedback.

License

MIT License — use freely, modify for your own local communities!

Made with care to help neighbors help neighbors.


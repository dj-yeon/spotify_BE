# Spotify Clone

This project is a music platform clone built using React, Next.js 13 (with Server-Side Rendering), Docker, and AWS (EC2, Load Balancer). The backend is powered by NestJS, while the frontend is implemented with React and Next.js.

## References

The design and React portion of this project were inspired by the following tutorial:

- [CodeWithAntonio - Spotify Clone with React, Next.js, Tailwind CSS & Supabase](https://www.youtube.com/watch?v=2aeMRB8LL4o&ab_channel=CodeWithAntonio)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [License](#license)

## Project Overview

This project replicates core functionality of a music platform where users can browse music, like tracks, and search for songs. It provides the following features:

- Home page: Display a list of tracks.
- Liked page: Show tracks liked by the user.
- Search page: Allow users to search for music.
- Modals: For user signup, login, and music upload.

The app is deployed using AWS services, with EC2 instances running the application and an Elastic Load Balancer for managing port number.

## Features

- Home Page: Browse music tracks.
- Liked Page: Manage liked tracks.
- Search Page: Find songs using a search function.
- Modals:
  - Sign-Up: New user registration.
  - Login: User authentication.
  - Upload: Upload music tracks.

## Technology Stack

### Frontend:

- React
- Next.js 13 (with Server-Side Rendering)
- TypeScript
- Tailwind

### Backend:

- NestJS
- PostgreSQL (Dockerized)
- JWT Authentication

### Deployment:

- AWS EC2 (for hosting both frontend and backend)
- AWS Load Balancer (for managing port number)
- Docker (for containerization)

## Usage

1. Visit the homepage to browse music.
2. Like your favorite tracks and view them on the Liked page.
3. Use the search functionality to discover new music.
4. Register or login using the provided modals to unlock additional features such as track upload.

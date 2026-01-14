<h1 align="center">Spara</h1>

**Spara** (Swedish for "Save") is your personal web archive. Save, organize, and share with ease—a simple and fast bookmark manager. A sleek tool designed for users who value simplicity and speed. Built with the MERN stack, it features a clean UI, secure authentication, and a focused dashboard for managing your digital library.

![Spara Preview](./assets/dashboard.png)

## Features

- **Minimalist Dashboard**: A distraction-free interface for your links.
- **Secure Auth**: Full JWT-based authentication flow (Login/Signup).
- **Security Suite**: Update passwords with current password verification.
- **Danger Zone**: One-click library clearing and account deletion.
- **Theming**: Native Dark and Light mode support.

## How It's Made

**Tech used:** MongoDB, Express, React, Node.js, Redux Toolkit, Tailwind CSS, Shadcn UI.

Spara was born out of a desire for a one-stop-shop for my digital library. Frustrated by the friction of tracking bookmarks across multiple devices, browsers, and accounts, I wanted a tool that felt "invisible". Low friction and high speed.

I utilized RTK Query to handle data fetching and caching, ensuring the UI remains snappy and responsive. On the server, I implemented a secure JWT-based authentication system using HTTP only cookies to prioritize user security and data privacy. While the tool is currently not deployed, the repository is structured so anyone can clone and host their own instance. The combination of a RESTful API and a modular slice pattern on the frontend makes the state management both predictable and easy to scale.

Feel free to clone this repo and create a project using Spara as a starting point.

## App Walkthrough

#### Signup
![Signup](./assets/signup.png)

#### Login
![Login](./assets/login.png)

#### Dashboard
![Dashboard](./assets/dashboard.png)

#### Sort by Favorites
![Sort by Favorites](./assets/favorites.png)

#### Update Bookmark
![Settings](./assets/edit.png)

#### Settings
![Settings](./assets/settings.png)

#### 404 Page
![404 Page](./assets/not-found.png)

Dark mode screenshots are available in the assets directory in the repo's root.

####

## Getting Started

### Prerequisites

- Node.js
- pnpm/npm
- MongoDB Atlas or local instance

### Installation
1. Clone and install dependencies

```bash
git clone https://github.com/jordansmalls/spara.git
cd spara

# navigate to client directory and install packages
cd client && pnpm install

# navigate to server directory and install packages
cd .. && cd server && pnpm install
```

2. Create a `.env` in the root of the server directory
```env
NODE_ENV=development
JWT_SECRET=YOUR_SUPER_SECRET_JWT_SECRET_STRING_HERE
PORT=4000
MONGO_URI=<YOUR_MONGO_URI_HERE>
```
3. In separate terminal windows, run both the client and server

Client
```bash
cd client
pnpm run dev
```

Server
```bash
cd server
pnpm run dev
```
By default the application runs on port 4000, unless you change the port in your `.env` file.

## Future Roadmap

I built Spara to solve a personal frustration: managing bookmarks across multiple browsers, devices, and accounts. I wanted a standalone, lightweight tool that wasn't bloated like Notion or Obsidian—a "digital time capsule" that ensures your bookmarks stay with you, regardless of what machine you're using, now or 10 years from now.

While the current version provides a solid foundation, I’ve identified several key features to enhance scalability and UX:


- **Tags:** Implement a custom tag system to allow users to categorize bookmarks ("Work", "Inspiration", "Read Later") for better organization.

- **Intelligent Search:** Add a full text search engine (or MongoDB text indexing) to help users retrieve buried links instantly as their libraries grow.

- **Pagination & Lazy Loading:** Optimizing the dashboard for large scale data by replacing the current list with windowed pagination to maintain high performance.

- **Usage Analytics:** Tracking click-through rates on bookmarks to introduce "Most Frequently Visited" sorting, bringing high value bookmarks to the top of the UI. Also useful for sorting.

- **Public Scalability:** Implement Rate Limiting (via express-rate-limit or similar package) and Helmet.js to harden the API for public facing production environments.

## Contributing

I built this project to be a clean and extensible starting point. Whether you want to implement one of the features above or have ideas of your own, feel free to fork the repo or submit a pull request. I’m always open to collaborating and seeing how others evolve this tool!

## License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software for personal or commercial purposes. See the [LICENSE](LICENSE) file for more details.


## Contact

If you wish to chat about the project, you can reach out to me on [twitter](https://www.x.com/@jsmallsdev) or find out more details on my [personal site](https://jsmalls.net).

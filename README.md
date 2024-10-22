# Social Media Project
This project is a simple social media application built with React.js for the front end and Node.js and Express.js for the back end.
<img src="https://www.fenews.co.uk/wp-content/uploads/2022/01/social-media-1200x800.jpg" height="400px" width="100%" style="object-fit: cover">

## Prerequisites

- Node.js and npm
- MongoDB

## Usable Function
- Message
- Add Friend
- Fill in the YouTube URL -> It will automatically download and convert to mp3
- Profile
- Share post/profile URL
- CRUD Post
- Post video/image/text

## Project Structure
```bash
server
├── api
├── app.js
├── configs
├── controllers
├── node_modules
├── package-lock.json
├── package.json
├── public
├── socket
├── ssl
└── utils

client
├── node_modules
├── package-lock.json
├── package.json
├── public
├── src
└── ssl
```

## Getting Started

### 1. Installation (If you installed, please skip this step)
- Node.js
- MongoDB

### 2. Clone the repository

```bash
git clone https://github.com/Jeffreys38/secure-book-social-media.git
cd secure-book-social-media

cd server
npm start

cd client
npm start

** Note:
The first time, you don't have music data so you will see the center-right bar that doesn't show the image (it won't affect to process, you can fix it).
After you fill YouTube URL, it will work well.

Enjoy it
```


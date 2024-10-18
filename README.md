# TFS POS

POS Software for TFS, a web application developed using the MERN stack, which comprises MongoDB, Express, React, and Node.js. This application functions as a point of sale (POS) system, enabling users to manage products, customers, and sales efficiently.

# Deployment

Deployed POS Can be accessed from the link below:

[https://tfs-pos.vercel.app/](https://tfs-pos.vercel.app/)

## Installation

- Clone the repository from GitHub: 

       git clone https://github.com/moizali01/tfs-pos.git
    
- Navigate to the server directory: 

       cd tfs-pos/server
    
- Install the server dependencies: 

       npm install express dotenv cors colors body-parser bcrypt joi mongoose morgan nodemon zxcvbn
    
- Change to the client directory: 

       cd ../client
    
- Install the client dependencies: 

       npm install react-router-dom react-redux redux redux-thunk axios antd 
    
- Create a `.env` file in the root directory with the following environment variables:

       DB_URL = mongodb+srv://<user>:<pass>@cluster0.aveas.mongodb.net/ 

- Start the server: 

       node index.js
    
- Open a new terminal, navigate to the client directory:

       cd client
    
- Launch the client: 

       npm start
    
- Access the application by opening your web browser and visiting http://localhost:3000.

## Client-side Functionality

The client side of the application is built with React and offers the following features:

- View a complete list of products, customers, and sales
- Create new products, customers, or sales
- Edit existing products, customers, or sales
- Delete products, customers, or sales

The client utilizes Axios for making HTTP requests to the server-side API.

## Technology Stack

- **MongoDB**: NoSQL database for data storage
- **Express**: Backend framework for building RESTful APIs
- **React**: Frontend framework for creating user interfaces
- **Node.js**: JavaScript runtime environment for developing scalable server-side applications
- **Bcrypt**: Password hashing library for secure password storage
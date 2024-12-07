import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import path from "path";

require('dotenv').config({ path: __dirname+'/.env' });
 
export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private readonly DEFAULT_PORT = parseInt(process.env.PORT);

  constructor() {
    this.initialize();

    this.handleRoutes();
    this.handleSocketConnection();
  }
 
  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer);
    this.configureApp();
  }
  
  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      res.send(`<h1>Hello World</h1>`); 
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", socket => {
      console.log("Socket connected.");
      
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

      // receive from client
      socket.on("user_join", function(data) {
          this.username = data;
          // send to client
          socket.broadcast.emit("user_join", data);
      });
  
      socket.on("chat_message", function(data) {
          data.username = this.username;
          socket.broadcast.emit("chat_message", data);
      });
  
      socket.on("disconnect", function() {
          socket.broadcast.emit("user_leave", this.username);
      });
    });
  }
  
  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }
}
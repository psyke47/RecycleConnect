import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { z } from "zod";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { 
  registerUserSchema, loginSchema, updateProfileSchema, 
  insertWasteListingSchema, insertTransactionSchema,
  UserRole, ListingStatus, TransactionStatus 
} from "@shared/schema";

// Setup session store
const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new SessionStore({ checkPeriod: 86400000 }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "recycleconnect-secret",
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Incorrect email or password" });
          }
          // In a real app, use bcrypt to compare passwords
          if (user.password !== password) {
            return done(null, false, { message: "Incorrect email or password" });
          }
          
          // Don't return password to client
          const { password: _, ...userWithoutPassword } = user;
          return done(null, userWithoutPassword);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      
      // Don't return password to client
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  // Check if user is authenticated middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Check if user has specific role middleware
  const hasRole = (role: UserRole) => (req: Request, res: Response, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as any;
    if (user.role !== role) {
      return res.status(403).json({ message: "Forbidden: Incorrect role" });
    }
    
    next();
  };

  // Auth Routes
  // Register route
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }
      
      // In a real app, hash the password before storing it
      const user = await storage.createUser(validatedData);
      
      // Don't return password to client
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Login route
  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.json(user);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    res.json(req.user);
  });

  // User Profile Routes
  // Update user profile
  app.put("/api/users/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const validatedData = updateProfileSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, validatedData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password to client
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Waste Listing Routes
  // Create a waste listing (Collectors only)
  app.post("/api/listings", isAuthenticated, hasRole(UserRole.COLLECTOR), async (req, res) => {
    try {
      const collectorId = (req.user as any).id;
      const validatedData = insertWasteListingSchema.parse({
        ...req.body,
        collectorId
      });
      
      const listing = await storage.createWasteListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Get all waste listings by collector
  app.get("/api/listings/collector", isAuthenticated, hasRole(UserRole.COLLECTOR), async (req, res) => {
    try {
      const collectorId = (req.user as any).id;
      const listings = await storage.getWasteListingsByCollector(collectorId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Get available waste listings (for transporters and buyers)
  app.get("/api/listings/available", isAuthenticated, async (req, res) => {
    try {
      const listings = await storage.getAvailableWasteListings();
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Update a waste listing (Collectors only)
  app.put("/api/listings/:id", isAuthenticated, hasRole(UserRole.COLLECTOR), async (req, res) => {
    try {
      const listingId = parseInt(req.params.id);
      const collectorId = (req.user as any).id;
      
      // Check if listing exists and belongs to this collector
      const listing = await storage.getWasteListing(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.collectorId !== collectorId) {
        return res.status(403).json({ message: "You can only update your own listings" });
      }
      
      const updatedListing = await storage.updateWasteListing(listingId, req.body);
      res.json(updatedListing);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Delete a waste listing (Collectors only)
  app.delete("/api/listings/:id", isAuthenticated, hasRole(UserRole.COLLECTOR), async (req, res) => {
    try {
      const listingId = parseInt(req.params.id);
      const collectorId = (req.user as any).id;
      
      // Check if listing exists and belongs to this collector
      const listing = await storage.getWasteListing(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.collectorId !== collectorId) {
        return res.status(403).json({ message: "You can only delete your own listings" });
      }
      
      await storage.deleteWasteListing(listingId);
      res.json({ message: "Listing deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Transaction Routes
  // Create a transaction (when a transporter accepts a pickup)
  app.post("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const role = (req.user as any).role;
      
      let transactionData = insertTransactionSchema.parse(req.body);
      
      // Set the appropriate user ID based on role
      if (role === UserRole.TRANSPORTER) {
        transactionData = { ...transactionData, transporterId: userId };
      } else if (role === UserRole.BUYER) {
        transactionData = { ...transactionData, buyerId: userId };
      } else {
        return res.status(403).json({ message: "Only transporters and buyers can create transactions" });
      }
      
      // Check if listing exists and is available
      const listing = await storage.getWasteListing(transactionData.listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.status !== ListingStatus.AVAILABLE) {
        return res.status(400).json({ message: "This listing is not available" });
      }
      
      // Create transaction
      const transaction = await storage.createTransaction(transactionData);
      
      // Update listing status
      if (role === UserRole.TRANSPORTER) {
        await storage.updateWasteListing(listing.id, { status: ListingStatus.PENDING_PICKUP });
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Get user's transactions
  app.get("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const role = (req.user as any).role;
      
      const transactions = await storage.getTransactionsByUser(userId, role);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Update transaction status
  app.put("/api/transactions/:id", isAuthenticated, async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      const role = (req.user as any).role;
      
      // Check if transaction exists and user is involved
      const transaction = await storage.getTransaction(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      // Check if user is involved in this transaction
      if (
        (role === UserRole.COLLECTOR && transaction.collectorId !== userId) ||
        (role === UserRole.TRANSPORTER && transaction.transporterId !== userId) ||
        (role === UserRole.BUYER && transaction.buyerId !== userId)
      ) {
        return res.status(403).json({ message: "You are not involved in this transaction" });
      }
      
      // Update transaction
      const updatedTransaction = await storage.updateTransaction(transactionId, req.body);
      
      // If updating status, also update the listing status accordingly
      if (req.body.status) {
        const listing = await storage.getWasteListing(transaction.listingId);
        if (listing) {
          let newListingStatus = listing.status;
          
          if (req.body.status === TransactionStatus.COMPLETED) {
            newListingStatus = ListingStatus.COMPLETED;
          } else if (req.body.status === TransactionStatus.CANCELLED) {
            newListingStatus = ListingStatus.AVAILABLE;
          }
          
          await storage.updateWasteListing(listing.id, { status: newListingStatus });
        }
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

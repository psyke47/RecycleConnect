import { 
  User, InsertUser, WasteListing, InsertWasteListing, 
  Transaction, InsertTransaction, UserRole, ListingStatus, TransactionStatus 
} from "@shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: UserRole): Promise<User[]>;
  
  // Waste listing operations
  getWasteListing(id: number): Promise<WasteListing | undefined>;
  createWasteListing(listing: InsertWasteListing): Promise<WasteListing>;
  updateWasteListing(id: number, listing: Partial<WasteListing>): Promise<WasteListing | undefined>;
  deleteWasteListing(id: number): Promise<boolean>;
  getWasteListingsByCollector(collectorId: number): Promise<WasteListing[]>;
  getAvailableWasteListings(): Promise<WasteListing[]>;
  getWasteListingsByStatus(status: ListingStatus): Promise<WasteListing[]>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  getTransactionsByUser(userId: number, role: UserRole): Promise<Transaction[]>;
  getTransactionsByListing(listingId: number): Promise<Transaction[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wasteListings: Map<number, WasteListing>;
  private transactions: Map<number, Transaction>;
  private userId: number;
  private listingId: number;
  private transactionId: number;

  constructor() {
    this.users = new Map();
    this.wasteListings = new Map();
    this.transactions = new Map();
    this.userId = 1;
    this.listingId = 1;
    this.transactionId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt, profileComplete: false };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === role
    );
  }

  // Waste listing methods
  async getWasteListing(id: number): Promise<WasteListing | undefined> {
    return this.wasteListings.get(id);
  }

  async createWasteListing(insertListing: InsertWasteListing): Promise<WasteListing> {
    const id = this.listingId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const status = ListingStatus.AVAILABLE;
    
    const listing: WasteListing = { 
      ...insertListing, 
      id, 
      createdAt, 
      updatedAt, 
      status
    };
    
    this.wasteListings.set(id, listing);
    return listing;
  }

  async updateWasteListing(id: number, listingData: Partial<WasteListing>): Promise<WasteListing | undefined> {
    const listing = this.wasteListings.get(id);
    if (!listing) return undefined;
    
    const updatedListing = { 
      ...listing, 
      ...listingData,
      updatedAt: new Date() 
    };
    
    this.wasteListings.set(id, updatedListing);
    return updatedListing;
  }

  async deleteWasteListing(id: number): Promise<boolean> {
    return this.wasteListings.delete(id);
  }

  async getWasteListingsByCollector(collectorId: number): Promise<WasteListing[]> {
    return Array.from(this.wasteListings.values()).filter(
      (listing) => listing.collectorId === collectorId
    );
  }

  async getAvailableWasteListings(): Promise<WasteListing[]> {
    return Array.from(this.wasteListings.values()).filter(
      (listing) => listing.status === ListingStatus.AVAILABLE
    );
  }

  async getWasteListingsByStatus(status: ListingStatus): Promise<WasteListing[]> {
    return Array.from(this.wasteListings.values()).filter(
      (listing) => listing.status === status
    );
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const status = TransactionStatus.PENDING;
    
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt, 
      updatedAt, 
      status
    };
    
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { 
      ...transaction, 
      ...transactionData,
      updatedAt: new Date() 
    };
    
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async getTransactionsByUser(userId: number, role: UserRole): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter((transaction) => {
      if (role === UserRole.COLLECTOR) return transaction.collectorId === userId;
      if (role === UserRole.TRANSPORTER) return transaction.transporterId === userId;
      if (role === UserRole.BUYER) return transaction.buyerId === userId;
      return false;
    });
  }

  async getTransactionsByListing(listingId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.listingId === listingId
    );
  }
}

export const storage = new MemStorage();

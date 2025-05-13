import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionStatus, UserRole } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth";
import { Search, Package, FileCheck, XCircle } from "lucide-react";

export default function TransactionHistory() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  // Filter transactions based on status and search term
  const filteredTransactions = transactions?.filter((transaction) => {
    // Status filter
    if (filter !== "all" && transaction.status !== filter) {
      return false;
    }
    
    // Search filter - simple implementation just for demonstration
    if (search && search.trim() !== "") {
      const searchTerm = search.toLowerCase();
      // Search by ID (you might want to expand this to search other fields)
      return transaction.id.toString().includes(searchTerm);
    }
    
    return true;
  }) || [];
  
  // Get status badge color
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <FileCheck className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case TransactionStatus.CANCELLED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Package className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };
  
  // Get role-specific title
  const getTransactionTitle = () => {
    if (!user) return "Transactions";
    
    switch (user.role) {
      case UserRole.COLLECTOR:
        return "Materials You've Listed";
      case UserRole.TRANSPORTER:
        return "Materials You're Transporting";
      case UserRole.BUYER:
        return "Materials You're Purchasing";
      default:
        return "Transactions";
    }
  };
  
  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No transactions yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        {user?.role === UserRole.COLLECTOR
          ? "Create a listing to start exchanging recyclables."
          : "Browse available listings to start transactions."}
      </p>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTransactionTitle()}</CardTitle>
        <CardDescription>
          View and manage your material exchanges
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Select
              value={filter}
              onValueChange={setFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={TransactionStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={TransactionStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search" 
              placeholder="Search transactions..."
              className="w-full pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">#{transaction.id}</TableCell>
                    <TableCell>Listing #{transaction.listingId}</TableCell>
                    <TableCell>
                      {transaction.createdAt instanceof Date
                        ? formatDistanceToNow(transaction.createdAt, { addSuffix: true })
                        : formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>${transaction.totalAmount?.toFixed(2) || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { WasteListing, ListingStatus } from "@shared/schema";
import WasteListingForm from "./components/WasteListingForm";
import ProfileForm from "./components/ProfileForm";
import TransactionHistory from "./components/TransactionHistory";
import { useAuth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { 
  BarChart3, 
  ArrowRight, 
  PlusCircle, 
  Package, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle
} from "lucide-react";

export default function CollectorDashboard() {
  const { user } = useAuth();
  const [showNewListing, setShowNewListing] = useState(false);
  
  // Fetch collector's listings
  const { data: listings, isLoading } = useQuery<WasteListing[]>({
    queryKey: ["/api/listings/collector"],
  });
  
  // Badge components for different listing statuses
  const statusBadge = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.AVAILABLE:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Send className="mr-1 h-3 w-3" />
            Available
          </Badge>
        );
      case ListingStatus.PENDING_PICKUP:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending Pickup
          </Badge>
        );
      case ListingStatus.IN_TRANSIT:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Package className="mr-1 h-3 w-3" />
            In Transit
          </Badge>
        );
      case ListingStatus.DELIVERED:
      case ListingStatus.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case ListingStatus.CANCELLED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">Unknown</Badge>
        );
    }
  };
  
  // Filter active and past listings
  const activeListings = listings?.filter(listing => 
    listing.status === ListingStatus.AVAILABLE || 
    listing.status === ListingStatus.PENDING_PICKUP || 
    listing.status === ListingStatus.IN_TRANSIT
  ) || [];
  
  const pastListings = listings?.filter(listing => 
    listing.status === ListingStatus.DELIVERED || 
    listing.status === ListingStatus.COMPLETED || 
    listing.status === ListingStatus.CANCELLED
  ) || [];
  
  // Get total revenue from completed listings
  const totalRevenue = pastListings.reduce((sum, listing) => {
    if (listing.status === ListingStatus.COMPLETED) {
      return sum + (listing.price * listing.quantity);
    }
    return sum;
  }, 0);
  
  // Empty state when no listings
  const EmptyListingsState = () => (
    <div className="text-center py-12">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No listings yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating your first waste listing
      </p>
      <Button 
        className="mt-4" 
        size="sm" 
        onClick={() => setShowNewListing(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New Listing
      </Button>
    </div>
  );
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar className="hidden sm:block w-64 shrink-0" />
      
      <div className="flex-1">
        <DashboardHeader title="Collector Dashboard" />
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold gradient-heading mb-6">Welcome, {user?.fullName || user?.username}</h2>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Listings</p>
                      <h3 className="text-2xl font-bold">{activeListings.length}</h3>
                    </div>
                    <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed Exchanges</p>
                      <h3 className="text-2xl font-bold">
                        {pastListings.filter(l => l.status === ListingStatus.COMPLETED).length}
                      </h3>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Actions Section */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Dialog open={showNewListing} onOpenChange={setShowNewListing}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create New Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create Waste Listing</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to create a new waste listing for collection.
                    </DialogDescription>
                  </DialogHeader>
                  <WasteListingForm />
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Active Listings Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <CardDescription>
                  Manage your current recyclable material listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500">Loading your listings...</p>
                  </div>
                ) : activeListings.length === 0 ? (
                  <EmptyListingsState />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeListings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell className="font-medium capitalize">{listing.materialType}</TableCell>
                            <TableCell>{listing.quantity} {listing.unit}</TableCell>
                            <TableCell>${listing.price} / {listing.unit}</TableCell>
                            <TableCell>
                              {listing.createdAt instanceof Date
                                ? formatDistanceToNow(listing.createdAt, { addSuffix: true })
                                : formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell>{statusBadge(listing.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Transaction History Section */}
            <TransactionHistory />
            
            {/* Profile Form Section */}
            <div className="mt-8">
              <ProfileForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

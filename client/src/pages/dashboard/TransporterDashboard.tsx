import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { WasteListing, ListingStatus, InsertTransaction } from "@shared/schema";
import ProfileForm from "./components/ProfileForm";
import TransactionHistory from "./components/TransactionHistory";
import { useAuth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { 
  TruckIcon,
  ArrowRight, 
  Truck, 
  SearchCheck, 
  CheckCircle2,
  Filter,
  MapPin,
  Clock,
  Box
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TransporterDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedListing, setSelectedListing] = useState<WasteListing | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Fetch available listings
  const { data: availableListings, isLoading } = useQuery<WasteListing[]>({
    queryKey: ["/api/listings/available"],
  });
  
  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (data: Partial<InsertTransaction>) => {
      const res = await apiRequest("POST", "/api/transactions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/listings/available"] });
      toast({
        title: "Pickup scheduled",
        description: "You have successfully scheduled a pickup for this listing",
      });
      setShowDetailsDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to schedule pickup",
        description: error.message || "An error occurred while scheduling the pickup",
        variant: "destructive",
      });
    },
  });
  
  // Schedule pickup function
  const handleSchedulePickup = () => {
    if (!selectedListing) return;
    
    const transactionData: Partial<InsertTransaction> = {
      listingId: selectedListing.id,
      collectorId: selectedListing.collectorId,
      totalAmount: selectedListing.price * selectedListing.quantity,
      pickupDate: new Date(),
    };
    
    createTransaction.mutate(transactionData);
  };
  
  // Open details dialog
  const openDetailsDialog = (listing: WasteListing) => {
    setSelectedListing(listing);
    setShowDetailsDialog(true);
  };
  
  // Empty state when no listings
  const EmptyListingsState = () => (
    <div className="text-center py-12">
      <SearchCheck className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No available listings</h3>
      <p className="mt-1 text-sm text-gray-500">
        Check back later for new recycling opportunities
      </p>
    </div>
  );
  
  // Filter controls for listings (placeholder for now)
  const FilterControls = () => (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
    </div>
  );
  
  // Statistics for transporter
  const activePickups = 0; // In a real app, this would come from the transactions query
  const completedDeliveries = 0; // In a real app, this would come from the transactions query
  const totalEarnings = 0; // In a real app, this would be calculated from the transactions
  
  return (
    <div className="flex min-h-screen bg-gray-50 transporter-theme">
      <DashboardSidebar className="hidden sm:block w-64 shrink-0" />
      
      <div className="flex-1">
        <DashboardHeader title="Transporter Dashboard" />
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold transporter-gradient-heading mb-6">
              Welcome, {user?.fullName || user?.username}
            </h2>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Pickups</p>
                      <h3 className="text-2xl font-bold">{activePickups}</h3>
                    </div>
                    <div className="h-12 w-12 bg-secondary-50 rounded-full flex items-center justify-center text-secondary-500">
                      <Truck className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed Deliveries</p>
                      <h3 className="text-2xl font-bold">{completedDeliveries}</h3>
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
                      <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                      <h3 className="text-2xl font-bold">${totalEarnings.toFixed(2)}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                      <TruckIcon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Available Listings Section */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Available Pickups</CardTitle>
                  <CardDescription>
                    Browse recyclable materials ready for transport
                  </CardDescription>
                </div>
                <FilterControls />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500">Finding available listings...</p>
                  </div>
                ) : !availableListings || availableListings.length === 0 ? (
                  <EmptyListingsState />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Date Listed</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableListings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell className="font-medium capitalize">{listing.materialType}</TableCell>
                            <TableCell>{listing.quantity} {listing.unit}</TableCell>
                            <TableCell>${listing.price} / {listing.unit}</TableCell>
                            <TableCell>{listing.location || "Not specified"}</TableCell>
                            <TableCell>
                              {listing.createdAt instanceof Date
                                ? formatDistanceToNow(listing.createdAt, { addSuffix: true })
                                : formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openDetailsDialog(listing)}
                              >
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
      
      {/* Listing Details Dialog */}
      {selectedListing && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Listing Details</DialogTitle>
              <DialogDescription>
                Review the details before scheduling a pickup
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Badge className="capitalize">{selectedListing.materialType}</Badge>
                <Badge variant="outline">{selectedListing.quantity} {selectedListing.unit}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="text-lg font-semibold">${selectedListing.price} / {selectedListing.unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Value</p>
                  <p className="text-lg font-semibold">
                    ${(selectedListing.price * selectedListing.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Pickup Location
                </p>
                <p className="text-base">
                  {selectedListing.location || "No specific location provided"}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Listed
                </p>
                <p className="text-base">
                  {selectedListing.createdAt instanceof Date
                    ? formatDistanceToNow(selectedListing.createdAt, { addSuffix: true })
                    : formatDistanceToNow(new Date(selectedListing.createdAt), { addSuffix: true })}
                </p>
              </div>
              
              {selectedListing.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Box className="h-4 w-4 mr-1" /> Description
                  </p>
                  <p className="text-base mt-1">{selectedListing.description}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSchedulePickup}
                disabled={createTransaction.isPending}
              >
                {createTransaction.isPending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Truck className="mr-2 h-4 w-4" />
                    Schedule Pickup
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WasteListing, ListingStatus, InsertTransaction, MaterialType } from "@shared/schema";
import ProfileForm from "./components/ProfileForm";
import TransactionHistory from "./components/TransactionHistory";
import { useAuth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { 
  Store,
  ArrowRight, 
  ShoppingCart, 
  BarChart3, 
  SearchCheck, 
  CheckCircle2,
  Filter,
  MapPin,
  Clock,
  Box,
  AlertCircle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedListing, setSelectedListing] = useState<WasteListing | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  
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
        title: "Purchase successful",
        description: "You have successfully purchased this material",
      });
      setShowDetailsDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Purchase failed",
        description: error.message || "An error occurred while making the purchase",
        variant: "destructive",
      });
    },
  });
  
  // Purchase materials function
  const handlePurchase = () => {
    if (!selectedListing) return;
    
    const transactionData: Partial<InsertTransaction> = {
      listingId: selectedListing.id,
      collectorId: selectedListing.collectorId,
      totalAmount: selectedListing.price * selectedListing.quantity,
    };
    
    createTransaction.mutate(transactionData);
  };
  
  // Open details dialog
  const openDetailsDialog = (listing: WasteListing) => {
    setSelectedListing(listing);
    setShowDetailsDialog(true);
  };
  
  // Filter listings by material type
  const filteredListings = availableListings?.filter(listing => {
    if (materialFilter === "all") return true;
    return listing.materialType === materialFilter;
  }) || [];
  
  // Empty state when no listings
  const EmptyListingsState = () => (
    <div className="text-center py-12">
      <SearchCheck className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No available materials</h3>
      <p className="mt-1 text-sm text-gray-500">
        Check back later for new recycling materials
      </p>
    </div>
  );
  
  // Material type filter
  const MaterialFilter = () => (
    <div className="flex items-center">
      <Select value={materialFilter} onValueChange={setMaterialFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by material" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Materials</SelectItem>
          <SelectItem value={MaterialType.PAPER}>Paper</SelectItem>
          <SelectItem value={MaterialType.CARDBOARD}>Cardboard</SelectItem>
          <SelectItem value={MaterialType.PLASTIC}>Plastic</SelectItem>
          <SelectItem value={MaterialType.GLASS}>Glass</SelectItem>
          <SelectItem value={MaterialType.METAL}>Metal</SelectItem>
          <SelectItem value={MaterialType.EWASTE}>E-Waste</SelectItem>
          <SelectItem value={MaterialType.ORGANIC}>Organic</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
  
  // Statistics for buyer
  const activeOrders = 0; // In a real app, this would come from the transactions query
  const completedPurchases = 0; // In a real app, this would come from the transactions query
  const totalSpent = 0; // In a real app, this would be calculated from the transactions
  
  return (
    <div className="flex min-h-screen bg-gray-50 buyer-theme">
      <DashboardSidebar className="hidden sm:block w-64 shrink-0" />
      
      <div className="flex-1">
        <DashboardHeader title="Buyer Dashboard" />
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold buyer-gradient-heading mb-6">
              Welcome, {user?.fullName || user?.username}
            </h2>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Orders</p>
                      <h3 className="text-2xl font-bold">{activeOrders}</h3>
                    </div>
                    <div className="h-12 w-12 bg-accent-50 rounded-full flex items-center justify-center text-accent-500">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed Purchases</p>
                      <h3 className="text-2xl font-bold">{completedPurchases}</h3>
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
                      <p className="text-sm font-medium text-gray-500">Total Spent</p>
                      <h3 className="text-2xl font-bold">${totalSpent.toFixed(2)}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Materials Marketplace Section */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Materials Marketplace</CardTitle>
                  <CardDescription>
                    Browse and purchase recyclable materials
                  </CardDescription>
                </div>
                <MaterialFilter />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500">Loading available materials...</p>
                  </div>
                ) : !filteredListings || filteredListings.length === 0 ? (
                  <EmptyListingsState />
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredListings.map((listing) => (
                        <Card key={listing.id} className="overflow-hidden">
                          <div className={`h-2 ${getMaterialColor(listing.materialType)}`}></div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <Badge className="capitalize">{listing.materialType}</Badge>
                              <p className="text-lg font-bold">${listing.price}/{listing.unit}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Box className="h-4 w-4 text-gray-400" />
                                <p className="text-sm">{listing.quantity} {listing.unit}</p>
                              </div>
                              {listing.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <p className="text-sm">{listing.location}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <p className="text-sm">
                                  {listing.createdAt instanceof Date
                                    ? formatDistanceToNow(listing.createdAt, { addSuffix: true })
                                    : formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <Button 
                              className="w-full mt-4" 
                              variant="outline"
                              onClick={() => openDetailsDialog(listing)}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
      
      {/* Material Details Dialog */}
      {selectedListing && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Material Details</DialogTitle>
              <DialogDescription>
                Review the details before making a purchase
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Badge className="capitalize">{selectedListing.materialType}</Badge>
                <Badge variant="outline">{selectedListing.quantity} {selectedListing.unit}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Price per {selectedListing.unit}</p>
                  <p className="text-lg font-semibold">${selectedListing.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Cost</p>
                  <p className="text-lg font-semibold">
                    ${(selectedListing.price * selectedListing.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Location
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
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Important Note</p>
                    <p className="text-sm text-amber-700">
                      By purchasing, you agree to arrange transport for this material.
                      You can use a transporter within the platform or organize your own pickup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePurchase}
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
                    <Store className="mr-2 h-4 w-4" />
                    Purchase Now
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

// Helper function to get color class based on material type
function getMaterialColor(materialType: MaterialType): string {
  switch (materialType) {
    case MaterialType.PAPER:
      return "bg-blue-500";
    case MaterialType.CARDBOARD:
      return "bg-amber-600";
    case MaterialType.PLASTIC:
      return "bg-sky-500";
    case MaterialType.GLASS:
      return "bg-teal-500";
    case MaterialType.METAL:
      return "bg-slate-500";
    case MaterialType.EWASTE:
      return "bg-red-500";
    case MaterialType.ORGANIC:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

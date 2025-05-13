import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertWasteListingSchema, MaterialType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function WasteListingForm() {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertWasteListingSchema),
    defaultValues: {
      materialType: MaterialType.PAPER,
      quantity: 0,
      unit: "kg",
      description: "",
      location: "",
      price: 0
    },
  });
  
  const createListing = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/listings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings/collector"] });
      toast({
        title: "Listing created",
        description: "Your waste listing has been created successfully",
      });
      form.reset({
        materialType: MaterialType.PAPER,
        quantity: 0,
        unit: "kg",
        description: "",
        location: "",
        price: 0
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create listing",
        description: error.message || "An error occurred while creating your listing",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: any) => {
    // Convert numeric fields from string to number
    data.quantity = parseFloat(data.quantity);
    data.price = parseFloat(data.price);
    
    createListing.mutate(data);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Waste Listing</CardTitle>
        <CardDescription>
          Add details about the recyclable materials you want to list
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="materialType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={MaterialType.PAPER}>Paper</SelectItem>
                        <SelectItem value={MaterialType.CARDBOARD}>Cardboard</SelectItem>
                        <SelectItem value={MaterialType.PLASTIC}>Plastic</SelectItem>
                        <SelectItem value={MaterialType.GLASS}>Glass</SelectItem>
                        <SelectItem value={MaterialType.METAL}>Metal</SelectItem>
                        <SelectItem value={MaterialType.EWASTE}>E-Waste</SelectItem>
                        <SelectItem value={MaterialType.ORGANIC}>Organic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="ton">Tons</SelectItem>
                          <SelectItem value="lb">Pounds (lb)</SelectItem>
                          <SelectItem value="pc">Pieces</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Unit ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Set your desired price per unit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Where should transporters pick up the materials?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4} 
                        placeholder="Provide details about the material condition, preparation, etc."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={createListing.isPending}>
                {createListing.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t text-sm text-gray-600">
        <p>
          Listings with accurate details are more likely to get picked up quickly.
        </p>
      </CardFooter>
    </Card>
  );
}

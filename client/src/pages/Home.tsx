import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserRole } from "@shared/schema";
import { Recycle, Truck, Store, UserCheck, ClipboardList, MapPin, ArrowLeftRight, Bell, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscription successful!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-20">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Exchange Recyclables.</span>
                <span className="block gradient-heading">Build a Circular Economy.</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                RecycleConnect brings together waste collectors, transporters, and buyers in one seamless platform. Efficiently exchange recyclables and contribute to a sustainable future.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Link href={`/register?role=${UserRole.COLLECTOR}`}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                      Collector
                    </Button>
                  </Link>
                  <Link href={`/register?role=${UserRole.TRANSPORTER}`}>
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" size="lg">
                      Transporter
                    </Button>
                  </Link>
                  <Link href={`/register?role=${UserRole.BUYER}`}>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                      Buyer
                    </Button>
                  </Link>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Choose your role to get started. It's free to sign up!
                </p>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img
                  className="w-full rounded-lg"
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Recycling facility with workers sorting materials"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Three simple steps to connect waste collectors, transporters, and buyers.
            </p>
          </div>

          <div className="mt-16">
            <div className="flex flex-wrap -m-4">
              <div className="p-4 md:w-1/3 flex">
                <div className="flex-grow pl-6">
                  <div className="inline-flex items-center justify-center rounded-md bg-primary-100 text-primary-500 mb-4 flex-shrink-0 p-4">
                    <Recycle className="h-6 w-6" />
                  </div>
                  <h2 className="text-gray-900 text-lg font-medium mb-3">Collectors</h2>
                  <p className="leading-relaxed text-base text-gray-600">
                    Register as a collector, log your recyclable waste, and request pickup. Get fair prices for your materials.
                  </p>
                </div>
              </div>
              <div className="p-4 md:w-1/3 flex">
                <div className="flex-grow pl-6">
                  <div className="inline-flex items-center justify-center rounded-md bg-secondary-100 text-secondary-500 mb-4 flex-shrink-0 p-4">
                    <Truck className="h-6 w-6" />
                  </div>
                  <h2 className="text-gray-900 text-lg font-medium mb-3">Transporters</h2>
                  <p className="leading-relaxed text-base text-gray-600">
                    Find collection opportunities, schedule pickups, and deliver materials to buyers in your area.
                  </p>
                </div>
              </div>
              <div className="p-4 md:w-1/3 flex">
                <div className="flex-grow pl-6">
                  <div className="inline-flex items-center justify-center rounded-md bg-accent-100 text-accent-500 mb-4 flex-shrink-0 p-4">
                    <Store className="h-6 w-6" />
                  </div>
                  <h2 className="text-gray-900 text-lg font-medium mb-3">Buyers</h2>
                  <p className="leading-relaxed text-base text-gray-600">
                    Browse available materials, set competitive prices, and receive quality recyclables directly from verified sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Platform Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to efficiently manage recyclable waste.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="feature-card">
                <div className="text-primary-500 mb-4">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Role-Based Access</h3>
                <p className="mt-2 text-gray-600">Customized dashboards and features based on your role in the recycling chain.</p>
              </div>
              <div className="feature-card">
                <div className="text-primary-500 mb-4">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Waste Inventory</h3>
                <p className="mt-2 text-gray-600">Easily track and manage recyclable materials with detailed specifications.</p>
              </div>
              <div className="feature-card">
                <div className="text-primary-500 mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Location Mapping</h3>
                <p className="mt-2 text-gray-600">Find nearby collection points, transporters, and buyers to minimize transit time.</p>
              </div>
              <div className="feature-card">
                <div className="text-primary-500 mb-4">
                  <ArrowLeftRight className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Transaction Management</h3>
                <p className="mt-2 text-gray-600">Complete history of all exchanges with transparent pricing information.</p>
              </div>
              <div className="feature-card">
                <div className="text-primary-500 mb-4">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Real-time Notifications</h3>
                <p className="mt-2 text-gray-600">Get alerts for new pickup requests, material availability, and completed transactions.</p>
              </div>
              <div className="feature-card">
                <div className="text-primary-500 mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
                <p className="mt-2 text-gray-600">Track your environmental impact and business performance with visual reporting.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-100">Sign up today and join our network.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Sign Up Now
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/#how-it-works">
                <Button variant="outline" className="bg-primary-600 text-white border-primary-400 hover:bg-primary-700" size="lg">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Email Signup */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Stay Updated</h3>
              <p className="mt-3 text-lg text-gray-600">
                Sign up for our newsletter to receive the latest RecycleConnect updates and sustainability news.
              </p>
              <div className="mt-8">
                <form onSubmit={handleSubscribe} className="mt-1 flex">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base placeholder-gray-400"
                  />
                  <Button type="submit" className="ml-3 flex-shrink-0">
                    Subscribe
                  </Button>
                </form>
                <p className="mt-3 text-sm text-gray-500">
                  We care about your data. Read our <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Privacy Policy</a>.
                </p>
              </div>
            </div>
            <div className="mt-12 md:mt-0">
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Have Questions?</h3>
              <p className="mt-3 text-lg text-gray-600">
                Our support team is ready to help you navigate the RecycleConnect platform.
              </p>
              <div className="mt-8">
                <div className="flex">
                  <div className="flex-shrink-0 text-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-base text-gray-600">
                    <p>support@recycleconnect.com</p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  <div className="flex-shrink-0 text-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-base text-gray-600">
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 text-lg text-gray-600">
              Have a different question and can't find the answer you're looking for? Reach out to our support team.
            </p>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  What types of recyclable materials can I trade on the platform?
                </AccordionTrigger>
                <AccordionContent>
                  RecycleConnect supports a wide range of materials including paper, cardboard, plastics (sorted by type), glass, metals, e-waste, and organic waste. Each category has specific guidelines for collection and transport.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  How are prices determined for recyclable materials?
                </AccordionTrigger>
                <AccordionContent>
                  Prices are market-driven and set by buyers based on material quality, quantity, and current demand. Our platform ensures transparency by showing the average market rate for each material type.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  What are the requirements to register as a transporter?
                </AccordionTrigger>
                <AccordionContent>
                  Transporters need to provide valid identification, vehicle information, proof of insurance, and any required local permits for waste transportation. Our verification process ensures all transporters meet regulatory requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  How does the platform ensure quality control?
                </AccordionTrigger>
                <AccordionContent>
                  We implement a rating system for all users, verification at pickup and delivery points, and dispute resolution processes. Materials must meet specified quality standards, which are checked at delivery.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

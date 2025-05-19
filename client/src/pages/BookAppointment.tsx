import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'wouter';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
  service: z.string().default(""),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const BookAppointment = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      service: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your appointment request has been sent. We'll be in touch soon to confirm.",
        variant: "default",
      });
      form.reset();
      setFormSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    mutation.mutate(data);
  }

  const services = [
    { value: "maintenance", label: "Routine Maintenance" },
    { value: "repair", label: "Diagnostics & Repair" },
    { value: "performance", label: "Performance Upgrades" },
    { value: "bodywork", label: "Body Work & Paint" },
    { value: "detailing", label: "Interior Detailing" },
    { value: "wheels", label: "Wheel & Tire Services" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-[#f1faee] font-sans">
      <Header />
      
      <section className="py-20 bg-[#1d3557] text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] mb-4">Book an Appointment</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Fill out the form below to schedule your appointment with our expert technicians.
          </p>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              {formSubmitted ? (
                <div className="bg-green-50 p-8 rounded-xl text-center">
                  <div className="text-green-500 text-5xl mb-4">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1d3557] mb-4">Thank You!</h3>
                  <p className="text-lg mb-6">Your appointment request has been submitted successfully. We'll get back to you shortly to confirm your booking.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      className="bg-[#1d3557] hover:bg-[#457b9d]"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Book Another Appointment
                    </Button>
                    <Link href="/">
                      <Button variant="outline">
                        Return to Homepage
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#1d3557] mb-6">Client Information</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-[#1d3557] mb-4">Address Information</h3>
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Street Address</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">City</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">State</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Zip Code</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-[#1d3557] mb-4">Service Details</h3>
                        
                        <FormField
                          control={form.control}
                          name="service"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Service Needed</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]">
                                    <SelectValue placeholder="Select a Service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {services.map((service) => (
                                    <SelectItem key={service.value} value={service.value}>
                                      {service.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel className="text-gray-700 font-medium">Additional Details</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={5}
                                  className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                                  placeholder="Please provide any specific details about your vehicle or service requirements"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-[#e63946] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg w-full"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : "Book Appointment"}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BookAppointment;
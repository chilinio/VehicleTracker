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

const Contact = () => {
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
        description: "Your message has been sent. We'll be in touch soon.",
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
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-['Montserrat'] text-[#1d3557] mb-4">Contact Us</h2>
          <p className="text-lg text-[#457b9d]">
            Reach out for appointments, quotes, or any questions about our services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="order-2 lg:order-1">
            {formSubmitted ? (
              <div className="bg-green-50 p-8 rounded-xl text-center">
                <div className="text-green-500 text-5xl mb-4">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1d3557] mb-4">Thank You!</h3>
                <p className="text-lg mb-6">Your message has been sent successfully. We'll get back to you shortly.</p>
                <Button 
                  className="bg-[#1d3557] hover:bg-[#457b9d]"
                  onClick={() => setFormSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e63946]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                        Sending...
                      </span>
                    ) : "Send Message"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg h-full">
              <h3 className="text-2xl font-bold text-[#1d3557] mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#e63946]/10 text-[#e63946] p-3 rounded-full mr-4">
                    <i className="fas fa-map-marker-alt text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1d3557] mb-1">Our Location</h4>
                    <p className="text-gray-600">
                      1234 Auto Drive, Mechanicsville<br />
                      CA 92345, United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#e63946]/10 text-[#e63946] p-3 rounded-full mr-4">
                    <i className="fas fa-phone-alt text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1d3557] mb-1">Phone Number</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#e63946]/10 text-[#e63946] p-3 rounded-full mr-4">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1d3557] mb-1">Email Address</h4>
                    <p className="text-gray-600">info@autoextreme.com</p>
                    <p className="text-gray-600">service@autoextreme.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#e63946]/10 text-[#e63946] p-3 rounded-full mr-4">
                    <i className="fas fa-clock text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1d3557] mb-1">Working Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 rounded-xl overflow-hidden h-64">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.7223831721174!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1631120308452!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="Google Maps location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

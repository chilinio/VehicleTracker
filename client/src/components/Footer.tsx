import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const subscribeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type SubscribeFormValues = z.infer<typeof subscribeSchema>;

const Footer = () => {
  const { toast } = useToast();
  const [year] = useState(new Date().getFullYear());
  
  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SubscribeFormValues) => {
      return apiRequest('POST', '/api/subscribe', data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: SubscribeFormValues) {
    mutation.mutate(data);
  }

  // Links for navigation
  const quickLinks = [
    { label: 'Home', href: '#' },
    { label: 'Services', href: '#services' },
    { label: 'About Us', href: '#about' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const serviceLinks = [
    { label: 'Routine Maintenance', href: '#' },
    { label: 'Diagnostics & Repair', href: '#' },
    { label: 'Performance Upgrades', href: '#' },
    { label: 'Body Work & Paint', href: '#' },
    { label: 'Interior Detailing', href: '#' },
    { label: 'Wheel & Tire Services', href: '#' },
  ];

  // Social media links
  const socialLinks = [
    { icon: 'fab fa-facebook-f', href: '#', label: 'Facebook' },
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
    { icon: 'fab fa-instagram', href: '#', label: 'Instagram' },
    { icon: 'fab fa-youtube', href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#1d3557] text-white pt-16 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-[#e63946] mb-6">Auto Extreme</h3>
            <p className="text-gray-300 mb-6">
              Providing premium automotive maintenance and customization services since 2005. 
              We pride ourselves on quality workmanship and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="bg-white/10 hover:bg-[#e63946] text-white p-2 rounded-full transition-colors"
                  aria-label={social.label}
                >
                  <i className={`${social.icon} w-5 h-5 flex items-center justify-center`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-[#e63946] mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-[#e63946] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-bold text-[#e63946] mb-6">Our Services</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-[#e63946] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-[#e63946] mb-6">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Your Email Address"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e63946] text-white placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-[#e63946] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>&copy; {year} Auto Extreme. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#" className="hover:text-[#e63946] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#e63946] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#e63946] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

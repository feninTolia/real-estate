'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const Hero = () => {
  return (
    <div className=" relative h-screen">
      <Image
        src={'/landing-splash.jpg'}
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
      >
        <div className="max-w-4xl mx-auto px-16 sm:px-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="text-xl text-white mb-8">
            Explore our wide range of rental properties tailored to fit your
            lifestyle and needs!
          </p>
          <div className="flex justify-center">
            <Input
              type="text"
              value="Search query"
              onChange={() => {}}
              placeholder="Search by city, neighborhood or address"
              className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12"
            />
            <Button
              onClick={() => {}}
              variant="secondary"
              className="bg-secondary-500 h-12 border-none rounded-none rounded-r-xl text-white hover:bg-secondary-600"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;

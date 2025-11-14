"use client";
import { useState } from 'react';
import FlightSearchForm from './BookFlight/FlightSearchForm';

export default function BookFlight() {
      return (
      <div className="w-full min-h-screen flex items-center bg-stone-200/0 flex-col justify-start bg-image bg-cover bg-center bg-[url('@/images/clouds.jpg')] p-4">
        <div className="rounded-md bg-white max-w-3xl p-6 shadow flex">
            <h2 className="text-lg font-medium">Flight Search Parameters</h2>
            <FlightSearchForm />
        </div>
    </div>
    );
}c
"use client"
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import React, { ReactNode } from 'react'
import {  ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>

    </ClerkProvider>
  )
}

 
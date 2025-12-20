"use client";
import React from "react";
import { Box } from "@mui/material";
import AdminSidebar from "../../../components/layout/AdminSidebar";
import { useAppSelector } from "../../../store/hooks";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminLayout({ children }) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <Box className="flex">
     
     <AdminSidebar />
      <Box className="flex-1 ">
         <AdminHeader/>
        {children}
      </Box>
    </Box>

  
  );
}




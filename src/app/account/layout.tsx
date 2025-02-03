"use client";
import React, { PropsWithChildren } from "react";
import { motion } from "framer-motion";

const AccountLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <motion.div
      initial={{
        y: -20,
        opacity: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      
      className="w-full h-screen flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

export default AccountLayout;

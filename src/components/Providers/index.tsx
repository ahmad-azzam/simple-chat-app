"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

type TProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<TProvidersProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </>
  );
};

export default Providers;

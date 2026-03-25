"use client";

import React from 'react';

export const ActionButton = ({ label, onClick }: { label: string; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
    >
      {label}
    </button>
  );
};

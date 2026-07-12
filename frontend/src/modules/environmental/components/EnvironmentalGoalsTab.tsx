import React from 'react';

export function EnvironmentalGoalsTab() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-12 text-center flex flex-col items-center shadow-sm">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl text-blue-600">🎯</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Environmental Goals</h2>
      <p className="text-slate-500 max-w-md mx-auto">
        Set CO2 reduction targets for your departments and track your progress in real-time.
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Create Goal
      </button>
    </div>
  );
}

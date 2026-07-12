

export function CarbonTransactionsTab() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-12 text-center flex flex-col items-center shadow-sm">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl text-green-600">📝</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Carbon Transactions</h2>
      <p className="text-slate-500 max-w-md mx-auto">
        Log and view carbon transactions linked to your emission factors and products.
      </p>
      <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        Log Transaction
      </button>
    </div>
  );
}

export function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Status Distribution */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Customer Status Distribution</h3>
                <div className="flex items-center justify-center relative h-64">
                    {/* CSS Doughnut Chart Mockup */}
                    <div className="relative h-48 w-48 rounded-full border-[16px] border-blue-100 flex items-center justify-center">
                        {/* Segments would normally be SVG, here just a ring and text */}
                        <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-l-transparent border-b-transparent rotate-45 transform"></div>
                        <div className="absolute inset-0 rounded-full border-[16px] border-green-400 border-l-transparent border-t-transparent border-r-transparent -rotate-45 transform"></div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">315</div>
                            <div className="text-sm text-gray-500">Total</div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-600">Waiting</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                        <span className="text-sm text-gray-600">Served</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-100" />
                        <span className="text-sm text-gray-600">Missed</span>
                    </div>
                </div>
            </div>

            {/* Hourly Queue Volume */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Hourly Queue Volume</h3>
                <div className="h-64 flex items-end justify-between gap-2 px-2">
                    {/* Mock Bars */}
                    {[20, 35, 45, 30, 55, 65, 40, 30, 45, 25, 15, 10].map((height, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-full">
                            <div
                                className="w-full bg-blue-600 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                style={{ height: `${height * 1.5}%` }}
                            />
                            {i % 2 === 0 && (
                                <span className="text-xs text-gray-400 mt-1">{9 + i}am</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

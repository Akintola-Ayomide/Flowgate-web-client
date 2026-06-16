import { BarChart3, Clock } from "lucide-react"

export function DashboardCharts() {
    return (
        <div className="bg-background border border-border/80 rounded-md p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
            <div className="relative z-10">
                <div className="w-12 h-12 bg-secondary border border-border/60 text-primary rounded-md flex items-center justify-center mx-auto mb-5 shadow-xs">
                    <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-1 tracking-tight">Queue Analytics Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5 font-medium leading-relaxed">
                    Visualizations for customer distribution and hourly traffic metrics are currently in development.
                </p>
                <div className="inline-flex items-center justify-center px-3 py-1 border border-primary/20 bg-primary/5 text-primary rounded-full text-[10px] font-bold tracking-wider uppercase">
                    <Clock className="w-3 h-3 mr-1.5" />
                    In Development
                </div>
            </div>
        </div>
    )
}

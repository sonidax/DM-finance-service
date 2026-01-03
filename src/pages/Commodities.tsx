import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coins, Gem, Calendar, Percent, TrendingUp, Info, CheckCircle, BarChart3, Wallet } from "lucide-react";
import { goldBondsData, silverBondsData } from "@/data/mockData";
import { InvestModal, InvestProduct } from "@/components/InvestModal";

export default function Commodities() {
  // State for investment modal
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InvestProduct | null>(null);

  // Handler to open invest modal with product details
  const handleInvest = (product: InvestProduct) => {
    setSelectedProduct(product);
    setIsInvestModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
      case "Available":
        return "bg-success/10 text-success border-success/20";
      case "Upcoming":
        return "bg-warning/10 text-warning border-warning/20";
      case "Closed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Commodities
          </h1>
          <p className="text-muted-foreground mt-2">
            live data of Gold,Silver,Natural gas, and Crude oil
          </p>
        </div>

        {/* Top Commodities quick strip (compact, data-only) */}
        <div className="mb-8">
          <div className="rounded-xl bg-card p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Top Commodities</h3>
                <p className="text-sm text-muted-foreground">Nearest Future Expiry Price Today</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-destructive text-destructive-foreground">LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[{
                id: 'crude', name: 'Crude Oil', expiry: '18 Dec 2025', price: '5,235.00', change: -11.00, pct: -0.21, img: '/crudeOilV2.svg'
              }, {
                id: 'gas', name: 'Natural Gas', expiry: '26 Dec 2025', price: '413.00', change: -8.70, pct: -2.06, img: '/naturalGasV3.svg'
              }, {
                id: 'gold', name: 'Gold', expiry: '05 Feb 2026', price: '1,29,914.00', change: -193.00, pct: -0.15, img: '/goldV3.svg'
              }, {
                id: 'silver', name: 'Silver', expiry: '05 Mar 2026', price: '1,89,595.00', change: 1531.00, pct: 0.81, img: '/silverV3.svg'
              }].map((c) => (
                <div key={c.id} className="flex items-center gap-4 p-3 rounded-md bg-transparent border border-border/40">
                  <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                    <img src={c.img} alt={c.name} className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.expiry}</span>
                    </div>
                    <div className="mt-1 text-sm">
                      <span className={`font-semibold ${c.change > 0 ? 'text-success' : 'text-destructive'}`}>₹{c.price}</span>
                      <span className="ml-2 text-muted-foreground">{c.change > 0 ? '▲' : '▼'} ₹{Math.abs(c.change).toLocaleString('en-IN')} ({c.pct}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

       
      </div>

      {/* Reusable Investment Modal */}
   
    </Layout>
  );
}

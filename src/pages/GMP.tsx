import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { gmpData, activeIPOs } from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function GMP() {
  const positiveGMP = gmpData.filter(g => g.gmp > 0);
  const negativeGMP = gmpData.filter(g => g.gmp < 0);
  const neutralGMP = gmpData.filter(g => g.gmp === 0);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return "—";
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (s && isNaN(s.getTime()) && e && isNaN(e.getTime())) return "—";

    const fmtMonth = (d: Date) => d.toLocaleString("en-IN", { month: "short" });

    if (s && e && !isNaN(s.getTime()) && !isNaN(e.getTime())) {
      if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
        return `${s.getDate()}-${e.getDate()} ${fmtMonth(s)}`;
      }
      return `${s.getDate()} ${fmtMonth(s)} - ${e.getDate()} ${fmtMonth(e)}`;
    }

    const only = s || e;
    if (only && !isNaN(only.getTime())) return `${only.getDate()} ${fmtMonth(only)}`;
    return "—";
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Grey Market Premium
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-5 w-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>GMP (Grey Market Premium) is the premium at which IPO shares are traded in the unofficial market before listing. It indicates market sentiment about the IPO.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground">
            Track real-time grey market premium for upcoming and recent IPOs
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Positive GMP</p>
                  <p className="text-3xl font-bold text-success">{positiveGMP.length}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-success/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Negative GMP</p>
                  <p className="text-3xl font-bold text-destructive">{negativeGMP.length}</p>
                </div>
                <TrendingDown className="h-10 w-10 text-destructive/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Neutral GMP</p>
                  <p className="text-3xl font-bold text-muted-foreground">{neutralGMP.length}</p>
                </div>
                <Minus className="h-10 w-10 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GMP Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Current GMP Data</CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                      <TableHead>IPO Name</TableHead>
                      <TableHead className="text-right">IPO Price</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                      <TableHead className="text-right">GMP</TableHead>
                      <TableHead className="text-right">Expected Listing</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {gmpData.map((item) => {
                      // try to find matching IPO in activeIPOs to show open-close dates or listing date
                        const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();
                        const itemNorm = normalize(item.name || '');

                        // Primary exact/substring match
                        let match = activeIPOs.find(a => {
                          const aNorm = normalize(a.name || '');
                          return aNorm.includes(itemNorm) || itemNorm.includes(aNorm) || aNorm === itemNorm;
                        });

                        // Fallback: match by first N characters (helps with small typos or truncated names)
                        if (!match && itemNorm.length >= 3) {
                          const prefix = itemNorm.slice(0, 4);
                          match = activeIPOs.find(a => normalize(a.name || '').includes(prefix) || prefix.includes(normalize(a.name || '').slice(0,4)));
                        }

                        // Final fallback: try case-insensitive includes on original names
                        if (!match) {
                          match = activeIPOs.find(a => (a.name || '').toLowerCase().includes((item.name || '').toLowerCase()) || (item.name || '').toLowerCase().includes((a.name || '').toLowerCase()));
                        }

                        let dateDisplay = '—';
                        if (match) {
                          if (match.openDate || match.closeDate) {
                            dateDisplay = formatDateRange(match.openDate, match.closeDate);
                          } else if (match.listingDate) {
                            const d = new Date(match.listingDate);
                            if (!isNaN(d.getTime())) dateDisplay = `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short' })}`;
                          }
                        }

                      return (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">₹{item.ipo_price}</TableCell>
                          <TableCell className="text-right">{dateDisplay}</TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant="outline" 
                              className={
                                item.gmp > 0 
                                  ? "bg-success/10 text-success border-success/20" 
                                  : item.gmp < 0 
                                    ? "bg-destructive/10 text-destructive border-destructive/20"
                                    : "bg-muted text-muted-foreground"
                              }
                            >
                              {item.gmp > 0 ? '+' : ''}₹{item.gmp}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">₹{item.expected_listing}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {getChangeIcon(item.change)}
                              <span className={
                                item.change > 0 
                                  ? "text-success" 
                                  : item.change < 0 
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                              }>
                                {item.change > 0 ? '+' : ''}{item.change}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-6 bg-warning/5 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  GMP data is collected from various sources and is indicative only. Grey market trading is unofficial and carries significant risks. 
                  The actual listing price may vary from the expected price. This data should not be considered as investment advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

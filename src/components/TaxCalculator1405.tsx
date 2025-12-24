import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Percent, BadgePercent, CircleDollarSign } from "lucide-react";

// Tax brackets for 1405 (in million Tomans - annual, based on taxable income after exemption)
const TAX_EXEMPTION_ANNUAL = 48; // 48 million Tomans annual exemption (480 million Rials)
const TAX_BRACKETS = [
  { min: 0, max: 48, rate: 10 },      // 0 تا 48 میلیون تومان مازاد بر معافیت
  { min: 48, max: 96, rate: 15 },     // 48 تا 96 میلیون تومان مازاد
  { min: 96, max: 192, rate: 20 },    // 96 تا 192 میلیون تومان مازاد
  { min: 192, max: 312, rate: 25 },   // 192 تا 312 میلیون تومان مازاد
  { min: 312, max: Infinity, rate: 30 }, // بیش از 312 میلیون تومان مازاد
];

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("fa-IR").format(Math.round(num));
};

const TaxCalculator1405 = () => {
  const [income, setIncome] = useState<string>("");
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");

  const calculateTax = useMemo(() => {
    const numericIncome = parseFloat(income.replace(/,/g, "")) || 0;
    
    // Convert to annual if monthly
    const annualIncome = period === "monthly" ? numericIncome * 12 : numericIncome;
    
    // Apply exemption
    const taxableIncome = Math.max(0, annualIncome - TAX_EXEMPTION_ANNUAL);
    
    if (taxableIncome === 0) {
      return {
        annualIncome,
        taxableIncome: 0,
        totalTax: 0,
        monthlyTax: 0,
        effectiveRate: 0,
        breakdown: [],
      };
    }

    let remainingIncome = taxableIncome;
    let totalTax = 0;
    const breakdown: { bracket: string; amount: number; rate: number; tax: number }[] = [];

    for (const bracket of TAX_BRACKETS) {
      if (remainingIncome <= 0) break;

      const bracketSize = bracket.max === Infinity 
        ? remainingIncome 
        : Math.min(bracket.max - bracket.min, remainingIncome);
      
      const taxInBracket = bracketSize * (bracket.rate / 100);
      totalTax += taxInBracket;

      if (bracketSize > 0) {
        breakdown.push({
          bracket: bracket.max === Infinity 
            ? `بالای ${formatNumber(bracket.min)} میلیون` 
            : `${formatNumber(bracket.min)} تا ${formatNumber(bracket.max)} میلیون`,
          amount: bracketSize,
          rate: bracket.rate,
          tax: taxInBracket,
        });
      }

      remainingIncome -= bracketSize;
    }

    const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

    return {
      annualIncome,
      taxableIncome,
      totalTax,
      monthlyTax: totalTax / 12,
      effectiveRate,
      breakdown,
    };
  }, [income, period]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    if (value) {
      setIncome(formatNumber(parseInt(value)));
    } else {
      setIncome("");
    }
  };

  return (
    <Card className="w-full border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-l from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl text-persian">ماشین حساب مالیات ۱۴۰۵</CardTitle>
            <CardDescription className="text-persian">
              محاسبه مالیات بر درآمد بر اساس پلکان‌های لایحه بودجه ۱۴۰۵
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income" className="text-persian font-medium">
              درآمد (میلیون تومان)
            </Label>
            <div className="relative">
              <CircleDollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="income"
                type="text"
                inputMode="numeric"
                placeholder="مثال: ۱۰۰"
                value={income}
                onChange={handleIncomeChange}
                className="pr-10 text-lg text-persian"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-persian font-medium">دوره درآمد</Label>
            <RadioGroup
              value={period}
              onValueChange={(value) => setPeriod(value as "monthly" | "annual")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="text-persian cursor-pointer">ماهانه</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual" className="text-persian cursor-pointer">سالانه</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Separator />

        {/* Results Section */}
        {income && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground text-persian">درآمد سالانه</span>
                </div>
                <div className="text-lg font-bold text-foreground text-persian">
                  {formatNumber(calculateTax.annualIncome)} میلیون
                </div>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BadgePercent className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground text-persian">درآمد مشمول مالیات</span>
                </div>
                <div className="text-lg font-bold text-foreground text-persian">
                  {formatNumber(calculateTax.taxableIncome)} میلیون
                </div>
              </div>
            </div>

            {/* Tax Results */}
            <div className="bg-primary/10 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-persian font-medium">مالیات سالانه:</span>
                <span className="text-xl font-bold text-primary text-persian">
                  {formatNumber(calculateTax.totalTax)} میلیون تومان
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-persian font-medium">مالیات ماهانه:</span>
                <span className="text-lg font-semibold text-foreground text-persian">
                  {formatNumber(calculateTax.monthlyTax)} میلیون تومان
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-persian font-medium">نرخ مؤثر مالیات:</span>
                <span className="text-lg font-semibold text-foreground text-persian">
                  {calculateTax.effectiveRate.toFixed(1)}٪
                </span>
              </div>
            </div>

            {/* Tax Breakdown */}
            {calculateTax.breakdown.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-persian flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" />
                  جزئیات محاسبه
                </h4>
                <div className="space-y-2">
                  {calculateTax.breakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-secondary/30 rounded-lg p-3 text-sm"
                    >
                      <div className="text-persian">
                        <span className="text-muted-foreground">{item.bracket}</span>
                        <span className="mx-2">×</span>
                        <span className="font-medium">{item.rate}٪</span>
                      </div>
                      <span className="font-semibold text-persian">
                        {formatNumber(item.tax)} میلیون
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exemption Notice */}
            {calculateTax.taxableIncome === 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <span className="text-green-600 dark:text-green-400 text-persian font-medium">
                  ✓ درآمد شما کمتر از سقف معافیت مالیاتی ({formatNumber(TAX_EXEMPTION_ANNUAL)} میلیون تومان سالانه) است
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tax Brackets Reference */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <h4 className="font-medium text-persian text-sm">پلکان‌های مالیاتی لایحه بودجه ۱۴۰۵:</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between text-persian">
              <span className="text-muted-foreground">سقف معافیت سالانه:</span>
              <span className="font-medium">{formatNumber(TAX_EXEMPTION_ANNUAL)} میلیون تومان</span>
            </div>
            {TAX_BRACKETS.map((bracket, index) => (
              <div key={index} className="flex justify-between text-persian">
                <span className="text-muted-foreground">
                  {bracket.max === Infinity 
                    ? `بالای ${formatNumber(bracket.min)} میلیون` 
                    : `${formatNumber(bracket.min)} تا ${formatNumber(bracket.max)} میلیون`}
                </span>
                <span className="font-medium text-primary">{bracket.rate}٪</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator1405;

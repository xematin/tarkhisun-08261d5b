import React, { useState } from 'react';
import { Calculator, Car, Smartphone, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// نرخ ارز گمرکی ۱۴۰۵ (براساس لایحه بودجه: ۱۰۳,۰۰۰ تومان به ازای هر یورو)
const CUSTOMS_EXCHANGE_RATE_EUR = 103000; // تومان به ازای هر یورو
const CUSTOMS_EXCHANGE_RATE = 95370; // تومان به ازای هر دلار (تقریبی)
const EURO_TO_DOLLAR = 1.08; // نرخ تبدیل یورو به دلار

// تعرفه‌های خودرو
const CAR_TARIFFS = {
  electric: { name: 'برقی', duty: 0.04, description: '۴٪ حقوق ورودی' },
  hybrid: { name: 'هیبریدی', duty: 0.15, description: '۱۵٪ حقوق ورودی' },
  gasoline_under_1500: { name: 'بنزینی زیر ۱۵۰۰ سی‌سی', duty: 0.55, description: '۵۵٪ حقوق ورودی' },
  gasoline_1500_2000: { name: 'بنزینی ۱۵۰۰ تا ۲۰۰۰ سی‌سی', duty: 0.75, description: '۷۵٪ حقوق ورودی' },
  gasoline_2000_2500: { name: 'بنزینی ۲۰۰۰ تا ۲۵۰۰ سی‌سی', duty: 1.00, description: '۱۰۰٪ حقوق ورودی' },
  gasoline_2500_3000: { name: 'بنزینی ۲۵۰۰ تا ۳۰۰۰ سی‌سی', duty: 1.15, description: '۱۱۵٪ حقوق ورودی' },
  gasoline_over_3000: { name: 'بنزینی بالای ۳۰۰۰ سی‌سی', duty: 1.30, description: '۱۳۰٪ حقوق ورودی' },
};

// تعرفه‌های گوشی
const PHONE_TARIFFS = {
  under_600: { name: 'زیر ۶۰۰ یورو', duty: 0.12, registration: 900000, description: '۱۲٪ حقوق ورودی' },
  over_600: { name: 'بالای ۶۰۰ یورو', duty: 0.40, registration: 900000, description: '۴۰٪ حقوق ورودی' },
};

// نرخ مالیات بر ارزش افزوده
const VAT_RATE = 0.10;

type CalculatorType = 'car' | 'phone' | null;

const formatNumber = (num: number): string => {
  return Math.round(num).toLocaleString('fa-IR');
};

const CustomsTariffCalculator: React.FC = () => {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>(null);
  const [carType, setCarType] = useState<string>('');
  const [carPrice, setCarPrice] = useState<string>('');
  const [phoneType, setPhoneType] = useState<string>('');
  const [phonePrice, setPhonePrice] = useState<string>('');
  const [result, setResult] = useState<{
    rialValue: number;
    dutyAmount: number;
    vatAmount: number;
    registrationFee?: number;
    totalCost: number;
  } | null>(null);

  const calculateCarTariff = () => {
    if (!carType || !carPrice) return;
    
    const priceUSD = parseFloat(carPrice);
    if (isNaN(priceUSD) || priceUSD <= 0) return;

    const tariff = CAR_TARIFFS[carType as keyof typeof CAR_TARIFFS];
    const rialValue = priceUSD * CUSTOMS_EXCHANGE_RATE;
    const dutyAmount = rialValue * tariff.duty;
    const vatAmount = (rialValue + dutyAmount) * VAT_RATE;
    const totalCost = rialValue + dutyAmount + vatAmount;

    setResult({
      rialValue,
      dutyAmount,
      vatAmount,
      totalCost,
    });
  };

  const calculatePhoneTariff = () => {
    if (!phoneType || !phonePrice) return;
    
    const priceEUR = parseFloat(phonePrice);
    if (isNaN(priceEUR) || priceEUR <= 0) return;

    const tariff = PHONE_TARIFFS[phoneType as keyof typeof PHONE_TARIFFS];
    const priceUSD = priceEUR * EURO_TO_DOLLAR;
    const rialValue = priceUSD * CUSTOMS_EXCHANGE_RATE;
    const dutyAmount = rialValue * tariff.duty;
    const vatAmount = (rialValue + dutyAmount) * VAT_RATE;
    const registrationFee = tariff.registration;
    const totalCost = rialValue + dutyAmount + vatAmount + registrationFee;

    setResult({
      rialValue,
      dutyAmount,
      vatAmount,
      registrationFee,
      totalCost,
    });
  };

  const resetCalculator = () => {
    setCalculatorType(null);
    setCarType('');
    setCarPrice('');
    setPhoneType('');
    setPhonePrice('');
    setResult(null);
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl text-primary">
          <Calculator className="h-6 w-6" />
          ماشین حساب تعرفه گمرکی ۱۴۰۵
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          نرخ ارز گمرکی: {formatNumber(CUSTOMS_EXCHANGE_RATE)} تومان | مالیات ارزش افزوده: ۱۰٪
        </p>
      </CardHeader>
      <CardContent>
        {!calculatorType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary"
              onClick={() => setCalculatorType('car')}
            >
              <Car className="h-8 w-8" />
              <span className="text-lg font-medium">محاسبه تعرفه خودرو</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary"
              onClick={() => setCalculatorType('phone')}
            >
              <Smartphone className="h-8 w-8" />
              <span className="text-lg font-medium">محاسبه تعرفه گوشی</span>
            </Button>
          </div>
        ) : calculatorType === 'car' ? (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCalculator}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 ml-1" />
              بازگشت
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor="carType">نوع خودرو</Label>
              <Select value={carType} onValueChange={setCarType}>
                <SelectTrigger id="carType">
                  <SelectValue placeholder="نوع خودرو را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CAR_TARIFFS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name} - {value.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carPrice">قیمت خودرو (دلار)</Label>
              <Input
                id="carPrice"
                type="number"
                placeholder="مثال: 35000"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                className="text-left"
                dir="ltr"
              />
            </div>

            <Button 
              className="w-full" 
              onClick={calculateCarTariff}
              disabled={!carType || !carPrice}
            >
              <Calculator className="h-4 w-4 ml-2" />
              محاسبه هزینه ترخیص
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold text-primary mb-3">نتیجه محاسبه:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">ارزش ریالی:</span>
                  <span className="font-medium">{formatNumber(result.rialValue)} تومان</span>
                  
                  <span className="text-muted-foreground">حقوق ورودی:</span>
                  <span className="font-medium">{formatNumber(result.dutyAmount)} تومان</span>
                  
                  <span className="text-muted-foreground">مالیات ارزش افزوده:</span>
                  <span className="font-medium">{formatNumber(result.vatAmount)} تومان</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">مجموع هزینه ترخیص:</span>
                    <span className="text-lg font-bold text-primary">{formatNumber(result.totalCost)} تومان</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCalculator}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 ml-1" />
              بازگشت
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor="phoneType">محدوده قیمت گوشی</Label>
              <Select value={phoneType} onValueChange={setPhoneType}>
                <SelectTrigger id="phoneType">
                  <SelectValue placeholder="محدوده قیمت را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PHONE_TARIFFS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name} - {value.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phonePrice">قیمت گوشی (یورو)</Label>
              <Input
                id="phonePrice"
                type="number"
                placeholder="مثال: 1200"
                value={phonePrice}
                onChange={(e) => setPhonePrice(e.target.value)}
                className="text-left"
                dir="ltr"
              />
            </div>

            <Button 
              className="w-full" 
              onClick={calculatePhoneTariff}
              disabled={!phoneType || !phonePrice}
            >
              <Calculator className="h-4 w-4 ml-2" />
              محاسبه هزینه ترخیص
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold text-primary mb-3">نتیجه محاسبه:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">ارزش ریالی:</span>
                  <span className="font-medium">{formatNumber(result.rialValue)} تومان</span>
                  
                  <span className="text-muted-foreground">حقوق ورودی:</span>
                  <span className="font-medium">{formatNumber(result.dutyAmount)} تومان</span>
                  
                  <span className="text-muted-foreground">مالیات ارزش افزوده:</span>
                  <span className="font-medium">{formatNumber(result.vatAmount)} تومان</span>
                  
                  {result.registrationFee && (
                    <>
                      <span className="text-muted-foreground">هزینه رجیستری:</span>
                      <span className="font-medium">{formatNumber(result.registrationFee)} تومان</span>
                    </>
                  )}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">مجموع هزینه ترخیص:</span>
                    <span className="text-lg font-bold text-primary">{formatNumber(result.totalCost)} تومان</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomsTariffCalculator;

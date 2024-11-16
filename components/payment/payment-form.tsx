'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentCardIcons } from "./payment-card-icons";
import { Shield, Lock, RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThreeDSDialog } from "./ThreeDSDialog";
import { isValidCardNumber, isValidExpiryDate, isValidCVV, isValidEmail, isValidPhone, isValidName } from "./card-validation";
import { usePaymentProvider } from '@/hooks/usePaymentProvider';
import { StripeElements } from './StripeElements';
import type { Stripe, StripeElements as StripeElementsType } from '@stripe/stripe-js';

interface PaymentFormProps {
  onSubmit?: (e: React.FormEvent) => void;
  initialPackage?: string;
}

const packages = [
  {
    id: "1year",
    name: "1-Year Plan",
    price: 29.99,
    period: "year",
    description: "Best value for serious streamers",
  },
  {
    id: "2year",
    name: "2-Year Plan",
    price: 49.99,
    period: "2 years",
    description: "Extended entertainment package",
    popular: true,
  },
];

const additionalFeatures = [
  { id: "nude", label: "+18 Package", price: 4.99 },
];

const securityFeatures = [
  {
    icon: Shield,
    title: "Secure Payment",
    description: "256-bit SSL encryption",
  },
  {
    icon: Lock,
    title: "Card Security",
    description: "All major cards accepted",
  },
  {
    icon: RotateCcw,
    title: "Money Back",
    description: "30-day guarantee",
  },
];

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PT", name: "Portugal" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
];

export function PaymentForm({ onSubmit, initialPackage }: PaymentFormProps) {
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackage || "2year");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<{
    type: 'percentage' | 'fixed';
    value: number;
  } | null>(null);
  const [show3DSDialog, setShow3DSDialog] = useState(false);
  const [threeDSData, setThreeDSData] = useState<{
    url: string;
    method: string;
    payload: Record<string, string>;
  } | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isCardComplete, setIsCardComplete] = useState(false);
  const { toast } = useToast();
  const { provider, isEnabled, isLoading: isLoadingProvider } = usePaymentProvider();

  const stripeRef = useRef<{
    stripe: Stripe | null;
    elements: StripeElementsType | null;
  }>({ stripe: null, elements: null });

  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 4);
    
    if (limited.length > 2) {
      return limited.slice(0, 2) + '/' + limited.slice(2);
    }
    
    return limited;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/(\d{1,4})/g);
    return groups ? groups.join(' ').substr(0, 19) : '';
  };

  const calculateSubtotal = () => {
    if (!selectedPackage) return 0;
    
    let total = selectedPackage.price;
    
    selectedFeatures.forEach((feature) => {
      const additionalFeature = additionalFeatures.find((f) => f.id === feature);
      if (additionalFeature) {
        total += additionalFeature.price;
      }
    });

    return Number(total.toFixed(2));
  };

  const calculateTotal = () => {
    let total = calculateSubtotal();

    if (couponDiscount) {
      if (couponDiscount.type === 'percentage') {
        total = total * (1 - couponDiscount.value / 100);
      } else {
        total = Math.max(1, total - couponDiscount.value);
      }
    }

    return Number(total.toFixed(2));
  };

  const validateForm = (formData: FormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    const email = formData.get("email") as string;
    if (!isValidEmail(email)) {
      errors.push("Please enter a valid email address");
    }

    const name = formData.get("name") as string;
    if (!isValidName(name)) {
      errors.push("Please enter a valid full name");
    }

    const phone = formData.get("phone") as string;
    if (!isValidPhone(phone)) {
      errors.push("Please enter a valid phone number");
    }

    if (!selectedCountry) {
      errors.push("Please select your country");
    }

    if (provider === 'sumup') {
      const cardNumber = formData.get("card") as string;
      if (!isValidCardNumber(cardNumber)) {
        errors.push("Please enter a valid card number");
      }

      const expiry = formData.get("expiry") as string;
      if (!isValidExpiryDate(expiry)) {
        errors.push("Please enter a valid expiry date");
      }

      const cvv = formData.get("cvv") as string;
      if (!isValidCVV(cvv)) {
        errors.push("Please enter a valid CVV");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleStripeReady = (stripe: Stripe, elements: StripeElementsType) => {
    stripeRef.current = { stripe, elements };
  };

  const createCheckout = async (formData: FormData) => {
    const total = calculateTotal();
    if (total < 1) {
      throw new Error("Order amount must be at least 1 EUR");
    }

    const clientData = {
      email: formData.get("email"),
      phone: formData.get("phone"),
      name: formData.get("name"),
      country: selectedCountry,
    };

    if (provider === 'stripe') {
      const { stripe, elements } = stripeRef.current;
      if (!stripe || !elements) {
        throw new Error("Stripe has not been initialized");
      }

      const cardElement = elements.getElement('card');
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: clientData.name as string,
          email: clientData.email as string,
          phone: clientData.phone as string,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const checkoutData = {
        amount: total,
        currency: "EUR",
        checkout_reference: `ORDER-${Date.now()}`,
        description: `StreamVault ${selectedPackage?.name}`,
        paymentMethodId: paymentMethod.id,
        clientData,
        selectedPackage,
        selectedFeatures,
      };

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process payment");
      }

      const result = await response.json();

      if (result.requires_action && result.clientSecret) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          result.clientSecret
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      return { success: true };
    } else {
      // Existing SumUp checkout logic
      const checkoutData = {
        amount: total,
        currency: "EUR",
        checkout_reference: `ORDER-${Date.now()}`,
        description: `StreamVault ${selectedPackage?.name}`,
        couponCode: couponDiscount ? couponCode : undefined,
        clientData,
        selectedPackage,
        selectedFeatures
      };

      const response = await fetch("/api/sumup/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout");
      }

      return response.json();
    }
  };

  const completeCheckout = async (checkoutId: string, data: any) => {
    try {
      const response = await fetch(`/api/sumup/complete-checkout/${checkoutId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const result = await response.json();

      if (result.next_step) {
        const { url, method, payload } = result.next_step;
        setThreeDSData({ url, method, payload });
        setShow3DSDialog(true);
        pollPaymentStatus(checkoutId);
        return;
      }

      if (result.status === "PAID") {
        window.location.href = "/success";
      } else if (result.status === "FAILED") {
        window.location.href = "/failed?reason=payment_failed";
      }

      return result;
    } catch (error) {
      console.error("Error completing checkout:", error);
      window.location.href = "/failed?reason=payment_failed";
      throw error;
    }
  };

  const pollPaymentStatus = async (checkoutId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        setShow3DSDialog(false);
        window.location.href = "/failed?reason=3ds_timeout";
        return;
      }

      try {
        const response = await fetch(`/api/sumup/complete-checkout/${checkoutId}`, {
          method: 'GET',
        });
        const result = await response.json();

        if (result.status === 'PAID') {
          setShow3DSDialog(false);
          window.location.href = "/success";
          return;
        } else if (result.status === 'FAILED') {
          setShow3DSDialog(false);
          window.location.href = "/failed?reason=payment_failed";
          return;
        }

        attempts++;
        setTimeout(checkStatus, 2000);
      } catch (error) {
        console.error('Error polling payment status:', error);
        setShow3DSDialog(false);
        window.location.href = "/failed?reason=payment_failed";
      }
    };

    checkStatus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
  
    try {
      const formData = new FormData(e.currentTarget);
      
      const { isValid, errors } = validateForm(formData);
      
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: errors.join("\n"),
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
  
      if (provider === 'stripe' && !isCardComplete) {
        toast({
          title: "Validation Error",
          description: "Please complete the card details",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
  
      // Rate limiting check
      const lastAttempt = localStorage.getItem('lastPaymentAttempt');
      const now = Date.now();
      if (lastAttempt && (now - parseInt(lastAttempt)) < 30000) {
        toast({
          title: "Too Many Attempts",
          description: "Please wait 30 seconds before trying again",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      localStorage.setItem('lastPaymentAttempt', now.toString());
  
      const clientData = {
        email: formData.get("email"),
        phone: formData.get("phone"),
        name: formData.get("name"),
        country: selectedCountry,
      };
  
      if (provider === 'stripe') {
        const { stripe, elements } = stripeRef.current;
        if (!stripe || !elements) {
          throw new Error("Stripe has not been initialized");
        }
  
        const cardElement = elements.getElement('card');
        if (!cardElement) {
          throw new Error("Card element not found");
        }
  
        // Create payment method
        const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: clientData.name as string,
            email: clientData.email as string,
            phone: clientData.phone as string,
          },
        });
  
        if (pmError) {
          throw new Error(pmError.message);
        }
  
        // Create checkout with payment method
        const checkoutData = {
          amount: calculateTotal(),
          currency: "EUR",
          checkout_reference: `ORDER-${Date.now()}`,
          description: `StreamVault ${selectedPackage?.name}`,
          paymentMethodId: paymentMethod.id,
          clientData,
          selectedPackage,
          selectedFeatures,
        };
  
        const response = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkoutData),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error || "Payment failed");
        }
  
        if (result.requires_action) {
          // Handle 3D Secure authentication
          const { error: confirmError } = await stripe.confirmCardPayment(
            result.clientSecret
          );
  
          if (confirmError) {
            throw new Error(confirmError.message);
          }
  
          // Payment confirmed successfully
          window.location.href = "/success";
          return;
        }
  
        if (result.status === 'succeeded') {
          window.location.href = "/success";
          return;
        }
  
        throw new Error("Payment failed. Please try again.");
      }
  
      // ... rest of the code for SumUp remains the same ...
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
      
      // Clear the card element on error
      if (provider === 'stripe') {
        const { elements } = stripeRef.current;
        const cardElement = elements?.getElement('card');
        if (cardElement) {
          cardElement.clear();
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    e.target.value = formatted;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    e.target.value = formatted;
  };

  const validateCoupon = async () => {
    if (!couponCode) return;
    
    setIsValidatingCoupon(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (response.ok) {
        const currentTotal = calculateSubtotal();
        let discountedAmount = currentTotal;
        
        if (data.discount_type === 'percentage') {
          discountedAmount = currentTotal * (1 - data.discount_value / 100);
        } else {
          discountedAmount = Math.max(0, currentTotal - data.discount_value);
        }

        if (discountedAmount < 1) {
          toast({
            title: "Invalid Coupon",
            description: "This coupon cannot be applied to the current order amount",
            variant: "destructive",
          });
          setCouponDiscount(null);
          return;
        }

        setCouponDiscount({
          type: data.discount_type,
          value: data.discount_value,
        });
        toast({
          title: "Coupon Applied",
          description: `Discount of ${data.discount_value}${data.discount_type === 'percentage' ? '%' : '€'} applied`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: data.error,
          variant: "destructive",
        });
        setCouponDiscount(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate coupon",
        variant: "destructive",
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(null);
    toast({
      title: "Coupon Removed",
      description: "The discount has been removed from your order",
    });
  };

  if (isLoadingProvider) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Payment System Unavailable</h2>
        <p className="text-muted-foreground">
          Our payment system is currently unavailable. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Choose Your Package</h2>
          <p className="text-muted-foreground">Select the plan that works best for you</p>
        </div>

        <RadioGroup
          value={selectedPackageId}
          onValueChange={setSelectedPackageId}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {packages.map((pkg) => (
            <label
              key={pkg.id}
              className={`relative flex flex-col p-6 cursor-pointer rounded-lg border-2 transition-all ${
                selectedPackageId === pkg.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem
                value={pkg.id}
                id={pkg.id}
                className="sr-only"
              />
              {pkg.popular && (
                <span className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </span>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm">{pkg.description}</p>
                <div className="text-2xl font-bold">
                  ${pkg.price}
                  <span className="text-base font-normal text-muted-foreground">/{pkg.period}</span>
                </div>
              </div>
            </label>
          ))}
        </RadioGroup>

        <div className="space-y-4">
          <Label>Additional Features</Label>
          {additionalFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={(checked) => {
                    setSelectedFeatures(
                      checked
                        ? [...selectedFeatures, feature.id]
                        : selectedFeatures.filter((id) => id !== feature.id)
                    );
                  }}
                />
                <label htmlFor={feature.id} className="text-sm cursor-pointer">
                  {feature.label}
                </label>
              </div>
              <span className="text-sm font-semibold">+${feature.price}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon">Coupon Code</Label>
          <div className="flex space-x-2">
            <Input
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              disabled={isValidatingCoupon || couponDiscount !== null}
            />
            {couponDiscount ? (
              <Button 
                variant="outline" 
                onClick={removeCoupon}
              >
                Remove
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={validateCoupon}
                disabled={!couponCode || isValidatingCoupon}
              >
                {isValidatingCoupon ? "Validating..." : "Apply"}
              </Button>
            )}
          </div>
          {couponDiscount && (
            <p className="text-sm text-green-500">
              Discount of {couponDiscount.value}{couponDiscount.type === 'percentage' ? '%' : '€'} applied
            </p>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Payment Details</h2>
          <p className="text-muted-foreground">Enter your payment information securely</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (234) 567-8900"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
                required
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {provider === 'stripe' ? (
            <StripeElements 
              onCardChange={setIsCardComplete} 
              onStripeReady={handleStripeReady}
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input
                  id="card"
                  name="card"
                  placeholder="4242 4242 4242 4242"
                  required
                  onChange={handleCardNumberChange}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    onChange={handleExpiryChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="password"
                    maxLength={4}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <PaymentCardIcons />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="text-center space-y-2">
                <feature.icon className="h-6 w-6 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-4 pt-6">
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay ${calculateTotal()} EUR Now`}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => window.open("https://wa.me/1234567890", "_blank")}
              className="w-full"
            >
              <Icons.whatsapp className="mr-2 h-4 w-4" />
              Need help? Contact Support
            </Button>
          </div>
        </form>
      </section>

      {threeDSData && (
        <ThreeDSDialog
          isOpen={show3DSDialog}
          onClose={() => {
            setShow3DSDialog(false);
            window.location.href = "/failed?reason=3ds_cancelled";
          }}
          url={threeDSData.url}
          method={threeDSData.method}
          payload={threeDSData.payload}
        />
      )}
    </div>
  );
}
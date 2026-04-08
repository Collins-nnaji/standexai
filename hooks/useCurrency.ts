"use client";

import { useState, useEffect } from "react";

export type Currency = "USD" | "GBP" | "NGN";

interface PriceData {
  USD: number;
  GBP: number;
  NGN: number;
}

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to detect location/currency automatically
    const detectCurrency = async () => {
      try {
        // Simple locale-based detection as a fallback
        const locale = navigator.language;
        if (locale.includes("GB")) setCurrency("GBP");
        else if (locale.includes("NG")) setCurrency("NGN");
        else setCurrency("USD");

        // Optional: Could verify with a geo-IP service here
      } catch (err) {
        console.error("Currency detection failed:", err);
      } finally {
        setLoading(false);
      }
    };

    detectCurrency();
  }, []);

  const formatPrice = (prices: PriceData) => {
    const value = prices[currency];
    const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "₦";
    
    return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : currency === "GBP" ? "en-GB" : "en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return { currency, setCurrency, formatPrice, loading };
}

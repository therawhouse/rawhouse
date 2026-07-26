"use client";

import React from "react";
import { BarChart3, TrendingUp, DollarSign, Award, Calendar } from "lucide-react";

/**
 * ============================================================================
 * THE RAW HOUSE - Sales & Revenue Analytics Page
 * ============================================================================
 */

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 text-raw-ivory">
      <div className="border-b border-raw-border pb-6">
        <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold">
          FINANCIAL REPORTS
        </span>
        <h1 className="text-2xl md:text-3xl font-serif-luxury text-raw-ivory tracking-[0.1em] uppercase">
          Sales & Conversion Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-raw-card border border-raw-border p-6 rounded-sm space-y-2">
          <span className="text-xs uppercase tracking-widest text-raw-muted">Monthly Gross Revenue</span>
          <div className="text-3xl font-serif-luxury text-raw-gold font-bold">₹42,50,000</div>
          <p className="text-[11px] text-emerald-400">+24.5% compared to previous month</p>
        </div>

        <div className="bg-raw-card border border-raw-border p-6 rounded-sm space-y-2">
          <span className="text-xs uppercase tracking-widest text-raw-muted">Average Order Value (AOV)</span>
          <div className="text-3xl font-serif-luxury text-raw-ivory font-bold">₹98,400</div>
          <p className="text-[11px] text-raw-gold">Luxury high-ticket clothing items</p>
        </div>

        <div className="bg-raw-card border border-raw-border p-6 rounded-sm space-y-2">
          <span className="text-xs uppercase tracking-widest text-raw-muted">Razorpay Success Rate</span>
          <div className="text-3xl font-serif-luxury text-emerald-400 font-bold">99.2%</div>
          <p className="text-[11px] text-raw-muted">HMAC-SHA256 verified transactions</p>
        </div>
      </div>

      {/* Sales Visual Breakdown Chart simulation */}
      <div className="bg-raw-card border border-raw-border p-8 rounded-sm space-y-6">
        <h3 className="text-sm font-serif-luxury uppercase tracking-[0.2em] text-raw-gold">
          2026 Monthly Sales Trajectory (INR In Lakhs)
        </h3>

        <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4 border-b border-raw-border">
          {[
            { month: "Jan", val: 28 },
            { month: "Feb", val: 32 },
            { month: "Mar", val: 35 },
            { month: "Apr", val: 30 },
            { month: "May", val: 45 },
            { month: "Jun", val: 42 },
            { month: "Jul", val: 52 },
          ].map((bar) => (
            <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] text-raw-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                ₹{bar.val}L
              </span>
              <div
                className="w-full bg-gradient-to-t from-raw-border via-raw-gold/80 to-raw-gold hover:to-raw-goldHover transition-all rounded-t-sm"
                style={{ height: `${bar.val * 4}px` }}
              />
              <span className="text-xs text-raw-muted uppercase tracking-wider">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

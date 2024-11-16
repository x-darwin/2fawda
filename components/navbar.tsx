"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Menu, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeChange = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  const ThemeIcon = () => {
    if (!mounted) return null;
    
    if (theme === 'system') {
      return <Monitor className="h-[1.15rem] w-[1.15rem]" />;
    }
    
    return theme === 'dark' 
      ? <Sun className="h-[1.15rem] w-[1.15rem]" />
      : <Moon className="h-[1.15rem] w-[1.15rem]" />;
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-transparent">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Play className="h-5 w-5 text-primary" strokeWidth={2.5} />
              <span className="font-medium tracking-tight">StreamVault</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <span className="h-[1.15rem] w-[1.15rem]" />
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-secondary">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/75 backdrop-blur-md border-b"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Play className="h-5 w-5 text-primary" strokeWidth={2.5} />
            <span className="font-medium tracking-tight">StreamVault</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#faqs"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/#reviews"
              className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeChange}
              className="hover:bg-secondary"
            >
              <ThemeIcon />
            </Button>
            <Button asChild variant="default" className="px-6">
              <Link href="/#packages">Get Started</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeChange}
              className="hover:bg-secondary"
            >
              <ThemeIcon />
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-6">
                <nav className="flex flex-col space-y-6 mt-4">
                  <Link
                    href="/#features"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-normal hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="/#faqs"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-normal hover:text-primary transition-colors"
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/#reviews"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-normal hover:text-primary transition-colors"
                  >
                    Reviews
                  </Link>
                  <Button asChild className="w-full mt-4" size="lg">
                    <Link href="/#packages" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
import { Link, useLocation } from "wouter";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  inquiryCount: number;
  onInquiryClick: () => void;
}

export function Header({ inquiryCount, onInquiryClick }: HeaderProps) {
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md" data-testid="link-home">
              <div className="text-2xl md:text-3xl font-display font-bold text-primary">
                LaptopHub
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {!isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={onInquiryClick}
                data-testid="button-inquiry-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {inquiryCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-inquiry-count"
                  >
                    {inquiryCount}
                  </Badge>
                )}
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-home-mobile">
                      Home
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start" data-testid="link-admin-mobile">
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <div className="hidden md:block">
              <Link href="/admin">
                <Button variant="ghost" size="sm" data-testid="link-admin">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

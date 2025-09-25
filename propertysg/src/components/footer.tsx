import Link from "next/link"
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PropertySG</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Singapore&apos;s premier property listing platform. Find your dream home with ease.
            </p>
            <div className="flex space-x-4">
              <div className="text-muted-foreground cursor-default">
                <Facebook className="h-5 w-5" />
              </div>
              <div className="text-muted-foreground cursor-default">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="text-muted-foreground cursor-default">
                <Instagram className="h-5 w-5" />
              </div>
              <div className="text-muted-foreground cursor-default">
                <Linkedin className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <span className="text-muted-foreground cursor-default">
                Browse Properties
              </span>
              <span className="text-muted-foreground cursor-default">
                Find Agents
              </span>
              <span className="text-muted-foreground cursor-default">
                List Your Property
              </span>
              <span className="text-muted-foreground cursor-default">
                Mortgage Calculator
              </span>
            </nav>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Types</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <span className="text-muted-foreground cursor-default">
                HDB Flats
              </span>
              <span className="text-muted-foreground cursor-default">
                Condominiums
              </span>
              <span className="text-muted-foreground cursor-default">
                Landed Properties
              </span>
              <span className="text-muted-foreground cursor-default">
                Commercial
              </span>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+65 6123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@propertysg.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Orchard Road, Singapore 238895</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PropertySG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

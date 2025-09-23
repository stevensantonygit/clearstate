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
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/properties" className="text-muted-foreground hover:text-primary">
                Browse Properties
              </Link>
              <Link href="/agents" className="text-muted-foreground hover:text-primary">
                Find Agents
              </Link>
              <Link href="/list-property" className="text-muted-foreground hover:text-primary">
                List Your Property
              </Link>
              <Link href="/mortgage-calculator" className="text-muted-foreground hover:text-primary">
                Mortgage Calculator
              </Link>
            </nav>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Types</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/properties?type=hdb" className="text-muted-foreground hover:text-primary">
                HDB Flats
              </Link>
              <Link href="/properties?type=condo" className="text-muted-foreground hover:text-primary">
                Condominiums
              </Link>
              <Link href="/properties?type=landed" className="text-muted-foreground hover:text-primary">
                Landed Properties
              </Link>
              <Link href="/properties?type=commercial" className="text-muted-foreground hover:text-primary">
                Commercial
              </Link>
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

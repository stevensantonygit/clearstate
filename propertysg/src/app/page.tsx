import { Button } from "@/components/ui/button"
import { Building2, Users, TrendingUp } from "lucide-react"
import AnimatedSearchInput from "@/components/animated-search"
import GetStartedButton from "@/components/get-started-button"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[#181c21] w-full h-full m-0 flex items-stretch justify-stretch">
          <div className="absolute inset-0 w-full h-full overflow-hidden pattern-bg">
            <div className="absolute cube-svg" />
          </div>
        </div>
        <div className="relative z-10 container mx-auto px-8 text-center">
          <div className="space-y-12">
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-thin text-white tracking-tight leading-tight">
                Find Your Dream
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
                  Property in Singapore
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
                Discover premium condominiums, landed properties, and exclusive developments across Singapore with expert guidance.
              </p>
            </div>
            <div className="flex justify-center">
              <AnimatedSearchInput />
            </div>
            <div className="flex justify-center">
              <GetStartedButton />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-4xl mx-auto pt-16">
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-thin text-white">1,234</div>
                <div className="text-sm text-white/40 font-light tracking-wide">Properties</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-thin text-white">567</div>
                <div className="text-sm text-white/40 font-light tracking-wide">Clients</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-thin text-white">15</div>
                <div className="text-sm text-white/40 font-light tracking-wide">Years</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-thin text-white">45</div>
                <div className="text-sm text-white/40 font-light tracking-wide">Agents</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-slate-950/50">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-light text-white">Premium Properties</h3>
              <p className="text-white/40 font-light leading-relaxed">
                Curated selection of luxury condominiums, landed properties, and exclusive developments across Singapore.
              </p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-light text-white">Expert Guidance</h3>
              <p className="text-white/40 font-light leading-relaxed">
                Professional real estate consultants with deep market knowledge and personalized service.
              </p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-light text-white">Market Intelligence</h3>
              <p className="text-white/40 font-light leading-relaxed">
                Real-time market data and trends to make informed investment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-b from-slate-950 to-black">
        <div className="container mx-auto px-8 text-center max-w-4xl">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-thin text-white tracking-tight">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-lg text-white/50 font-light leading-relaxed">
              Join thousands of satisfied clients who found their dream properties with PropertySG.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Browse Properties
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

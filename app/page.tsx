import HeroSection from "@/components/landing/HeroSection";
import MechanismVisualizer from "@/components/landing/MechanismVisualizer";
import StabilityMetrics from "@/components/landing/StabilityMetrics";
import EconomicTicker from "@/components/common/EconomicTicker";
import StakeCard from "@/components/features/stake/StakeCard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col text-white overflow-x-hidden">
      <div className="fixed top-20 left-0 w-full z-40">
        <EconomicTicker />
      </div>

      <div className="mt-12">
        <HeroSection />
      </div>

      <section className="py-16 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8 text-center">Protocol Vitals</h3>
          <StabilityMetrics />
        </div>
      </section>

      <section className="py-20 relative">
        <div className="text-center space-y-4 mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold">The Mechanics of Stability</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Powered by Chainlink Runtime Environment. KALA maintains its purchasing power by actively monitoring real-world economic signals.
          </p>
        </div>
        <MechanismVisualizer />
      </section>
    </main>
  );
}

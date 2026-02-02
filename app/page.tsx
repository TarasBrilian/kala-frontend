import FAQSection from "@/components/features/faq/FAQSection";
import StakeCard from "@/components/features/stake/StakeCard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start font-sans py-20 gap-16">
      <StakeCard />
      <FAQSection />
    </div>
  );
}

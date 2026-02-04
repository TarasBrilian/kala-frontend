import StakeCard from "@/components/features/stake/StakeCard";
import FAQSection from "@/components/features/faq/FAQSection";

export default function StakePage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center font-sans py-20 gap-16">
            <StakeCard />
            <FAQSection />
        </div>
    );
}

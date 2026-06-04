"use client";

import { SnapContainer, SnapSlide } from "@/components/scroll-snap-system";
import { ServiceSlide, SERVICE_DATA } from "@/components/services-section";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { IdeaSection } from "@/components/idea-section";
import { TeamSection } from "@/components/team-section";
import { VisionSection } from "@/components/vision-section";
import { HowWeWorkSection } from "@/components/how-we-work-section";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <SnapContainer showDots={true}>

      <SnapSlide id="idea" tall>
        <IdeaSection />
      </SnapSlide>

      <SnapSlide id="hero">
        <HeroSection />
      </SnapSlide>

      <SnapSlide id="about">
        <AboutSection />
      </SnapSlide>

      <SnapSlide id="team">
        <TeamSection />
      </SnapSlide>

      {Array.isArray(SERVICE_DATA) && SERVICE_DATA.map((_, i) => (
        <SnapSlide key={i} id={`service-${i}`}>
          <ServiceSlide svcIndex={i} />
        </SnapSlide>
      ))}

      <SnapSlide id="vision">
        <VisionSection />
      </SnapSlide>

      <SnapSlide id="how-we-work">
        <HowWeWorkSection />
      </SnapSlide>

      {/* contact + footer liền kề, cùng tall để scroll tự nhiên */}
      <SnapSlide id="contact" tall>
        <ContactSection />
        <Footer />
      </SnapSlide>

    </SnapContainer>
  );
}
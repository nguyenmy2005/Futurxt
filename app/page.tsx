"use client";
import { useState } from "react";
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <SnapContainer showDots={true}>
      <SnapSlide id="idea" tall>
        <IdeaSection theme={theme} onToggleTheme={toggleTheme} />
      </SnapSlide>
      <SnapSlide id="hero">
        <HeroSection theme={theme} />
      </SnapSlide>
      <SnapSlide id="about">
        <AboutSection theme={theme} />
      </SnapSlide>
      <SnapSlide id="team">
        <TeamSection theme={theme} />
      </SnapSlide>
      {Array.isArray(SERVICE_DATA) && SERVICE_DATA.map((_, i) => (
        <SnapSlide key={i} id={`service-${i}`}>
          <ServiceSlide svcIndex={i} theme={theme} />
        </SnapSlide>
      ))}
      <SnapSlide id="vision">
        <VisionSection theme={theme} />
      </SnapSlide>
      <SnapSlide id="how-we-work">
  <HowWeWorkSection theme={theme} />
</SnapSlide>
<SnapSlide id="contact" tall>
  <ContactSection theme={theme} />
  <Footer theme={theme} />
</SnapSlide>
    </SnapContainer>
  );
}
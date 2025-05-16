"use client";

import {Header} from "@/app/components/header/Header";
import {Hero} from "@/app/components/hero/Hero";
import {Background, Column} from "@/once-ui/components";
import React from "react";
import {Profile} from "@/app/components/profile/Profile";
import PricingSection from "@/app/components/projectsimulator/ProjectSimulator";

export default function Home() {
    return (
        <Column fillWidth center>
          <Background
            position="absolute"
            mask={{
              x: 0,
              y: 50,
              radius: 200,
            }}
            gradient={{
              display: true,
              x: 150,
              y: 0,
              width: 350,
              height: 300,
              tilt: -90,
              opacity: 100,
              colorStart: "accent-background-strong",
              colorEnd: "page-background",
            }}
            particle={{
              display: true,
              density: 750,
              interactive: true,
              interactionRadius: 12,
              speed: 2,
              opacity: 100,
            }}
          />
          <Header/>
            <Column fill maxWidth={100}>
                <Hero/>
            </Column>
            <Column fitHeight maxWidth={80}>
                <Profile/>
            </Column>
            <Column fitHeight maxWidth={80}>
                <PricingSection/>
            </Column>
        </Column>
    )
}

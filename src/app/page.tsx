"use client";

import {Header} from "@/app/components/header/Header";
import {Hero} from "@/app/components/hero/Hero";
import {Background, Column} from "@/once-ui/components";
import React from "react";
import {Profile} from "@/app/components/profile/Profile";

export default function Home() {
    return (
        <Column fillWidth center>
          <Background
            position="absolute"
            mask={{
              x: 100,
              y: 0,
              radius: 400,
            }}
            gradient={{
              display: true,
              x: 150,
              y: 100,
              width: 150,
              height: 100,
              tilt: -90,
              opacity: 100,
              colorStart: "accent-background-strong",
              colorEnd: "page-background",
            }}
            particle={{
              display: true,
              density: 500,
              interactive: true,
              interactionRadius: 10,
              speed: 3,
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
          {/*<About />*/}
        </Column>
    )
}

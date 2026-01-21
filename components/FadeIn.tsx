"use client";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger)

type FadeInProps = {
    children: React.ReactNode;
    vars?:gsap.TweenVars;
    start?: string;
    className?: string;
    targetChildren?: boolean;
}


export function FadeIn({
    children,
    className,
    start = "top 50%",
    vars = {},
    targetChildren = false
}: FadeInProps){

    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const target = targetChildren ? containerRef.current?.children : containerRef.current;

        if(!target) return;

        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            
        })

        gsap.set(target, {
            opacity: 0,
            y: 60
        })
        gsap.to(target,
            {
                duration: .8,
                opacity: 1,
                ease: "power3.out",
                y: 0,
                stagger: .2,
                ...vars,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start,

                }
            }
        )
    }, [])


    return <div ref={containerRef} className={clsx(className)}>{children}</div>
}
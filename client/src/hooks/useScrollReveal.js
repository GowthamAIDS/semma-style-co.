import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollReveal() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const els = document.querySelectorAll('.gsap-reveal, .gsap-reveal-left, .gsap-reveal-right, .gsap-reveal-scale');

    els.forEach(el => {
      let fromVars = {};
      if (el.classList.contains('gsap-reveal')) fromVars = { y: 40, opacity: 0 };
      else if (el.classList.contains('gsap-reveal-left')) fromVars = { x: -40, opacity: 0 };
      else if (el.classList.contains('gsap-reveal-right')) fromVars = { x: 40, opacity: 0 };
      else if (el.classList.contains('gsap-reveal-scale')) fromVars = { scale: 0.9, opacity: 0 };

      gsap.fromTo(el, fromVars, {
        ...fromVars,
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}

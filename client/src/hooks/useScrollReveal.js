import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function animateElement(el) {
  let fromVars = {};
  if (el.classList.contains('gsap-reveal')) fromVars = { y: 50, opacity: 0 };
  else if (el.classList.contains('gsap-reveal-left')) fromVars = { x: -50, opacity: 0 };
  else if (el.classList.contains('gsap-reveal-right')) fromVars = { x: 50, opacity: 0 };
  else if (el.classList.contains('gsap-reveal-scale')) fromVars = { scale: 0.85, opacity: 0 };
  else return;

  gsap.set(el, fromVars);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, {
          y: 0, x: 0, scale: 1, opacity: 1,
          duration: 0.8, ease: 'power3.out',
          overwrite: 'auto',
        });
        observer.unobserve(el);
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(el);
}

export default function useScrollReveal() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const selector = '.gsap-reveal, .gsap-reveal-left, .gsap-reveal-right, .gsap-reveal-scale';

    document.querySelectorAll(selector).forEach(animateElement);

    const observer = new MutationObserver(() => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.dataset._gsap) { el.dataset._gsap = '1'; animateElement(el); }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
}

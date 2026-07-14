import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('reveal'); observer.unobserve(e.target); }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => { el.classList.remove('reveal'); observer.observe(el); });
    return () => observer.disconnect();
  }, []);
}

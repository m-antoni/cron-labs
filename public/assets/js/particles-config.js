particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.3 },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.2, width: 1 },
    move: { enable: true, speed: 3 },
  },
  interactivity: {
    events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
  },
  retina_detect: true,
});

const svg = document.querySelector('#menu');
const stage = document.querySelector('#scroll-stage');
const NS = 'http://www.w3.org/2000/svg';
const count = 8;
const initial = { x: 493.97, y: 130.23, size: 91.6, gap: 14.65 };
const compact = { x: 466.89 };
const target = { x: 631.46, y: 130.03, size: 835.54 };
const squaresRoot = document.querySelector('#menu-squares');
const squares = Array.from({ length: count }, (_, index) => {
  const square = document.createElementNS(NS, 'rect');
  square.classList.add('menu-square');
  square.dataset.index = index;
  squaresRoot.append(square);
  return square;
});

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from, to, progress) {
  return from + (to - from) * progress;
}

function spring(progress) {
  if (progress <= 0 || progress >= 1) return progress;
  const tension = 1.35;
  const decay = 5.5;
  return 1 - Math.exp(-decay * progress) * Math.cos(tension * Math.PI * progress);
}

function setSquare(square, x, y, size) {
  square.setAttribute('x', x);
  square.setAttribute('y', y);
  square.setAttribute('width', size);
  square.setAttribute('height', size);
}

function getMaxScroll() {
  return Math.max(1, stage.offsetHeight - innerHeight);
}

function render() {
  const maxScroll = getMaxScroll();
  const scrollProgress = clamp(scrollY / maxScroll);
  const sequence = scrollProgress * count;
  const activeIndex = Math.min(count - 1, Math.floor(sequence));
  const itemProgress = sequence - activeIndex;
  const previousIndex = activeIndex > 0 ? activeIndex - 1 : null;
  const slideProgress = spring(clamp(itemProgress / 0.42));
  const scaleProgress = spring(clamp((itemProgress - 0.42) / 0.58));
  const exitProgress = spring(clamp(itemProgress / 0.58));

  squares.forEach((square, index) => {
    const baseY = initial.y + index * (initial.size + initial.gap);
    const baseX = compact.x;

    if (index === activeIndex) {
      const entryX = activeIndex === 0 ? initial.x : compact.x;
      const x = lerp(entryX, target.x, slideProgress);
      const y = lerp(baseY, target.y, scaleProgress);
      const size = lerp(initial.size, target.size, scaleProgress);
      setSquare(square, x, y, size);
      return;
    }

    if (index === previousIndex) {
      const x = lerp(target.x, baseX, exitProgress);
      const y = lerp(target.y, baseY, exitProgress);
      const size = lerp(target.size, initial.size, exitProgress);
      setSquare(square, x, y, size);
      return;
    }

    setSquare(square, scrollProgress === 0 ? initial.x : baseX, baseY, initial.size);
  });
}

let snapTimer;
let snapTarget = null;
let lastScrollY = scrollY;
let scrollDirection = 0;

function snapToCompletedState() {
  const maxScroll = getMaxScroll();
  const sequence = clamp(scrollY / maxScroll) * count;
  const completedStep = scrollDirection >= 0 ? Math.ceil(sequence) : Math.floor(sequence);
  const targetY = completedStep / count * maxScroll;
  if (Math.abs(scrollY - targetY) < 2 || snapTarget === targetY) return;
  snapTarget = targetY;
  scrollTo({
    top: targetY,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

addEventListener('scroll', () => {
  const delta = scrollY - lastScrollY;
  if (Math.abs(delta) > 0.5) scrollDirection = Math.sign(delta);
  lastScrollY = scrollY;
  render();
  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => {
    snapTarget = null;
    snapToCompletedState();
  }, 140);
}, { passive: true });
addEventListener('resize', render);
render();

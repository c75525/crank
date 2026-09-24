const scene = document.querySelector('#scene');
const NS = 'http://www.w3.org/2000/svg';
const centers = {
  outer: { x: 747.58, y: 207.85 }
};
const slider = { startX: 518.04, endX: 977.12 };
let progress = 0;
let dragging = false;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function setTransform(element, value) {
  element.setAttribute('transform', value);
}

function setup() {
  const illustration = scene.querySelector('svg');
  illustration.setAttribute('role', 'img');
  illustration.setAttribute('aria-label', 'Pill mechanism with a draggable yellow slider');
  const assembly = [...illustration.children].find(element => element.localName === 'g');
  const outerPill = [...assembly.children].find(element => element.localName === 'rect');
  const contents = [...assembly.children].find(element => element.localName === 'g');
  const [green, orange, red, pink, purple, teal, track, sliderGroup] = [...contents.children];
  const orbs = [green, orange, red, pink, purple, teal];
  const snakeTrack = document.createElementNS(NS, 'path');
  // This capsule follows the centers of the supplied orb positions around the slider container.
  snakeTrack.setAttribute('d', 'M 537.98 66.42 H 944.65 A 141.55 141.55 0 0 1 944.65 349.52 H 537.98 A 141.55 141.55 0 0 1 537.98 66.42 Z');
  snakeTrack.setAttribute('fill', 'none');
  snakeTrack.setAttribute('stroke', 'none');
  contents.append(snakeTrack);
  const trackLength = snakeTrack.getTotalLength();
  const straight = 944.65 - 537.98;
  const halfArc = Math.PI * 141.55;
  const orbStarts = [
    { center: { x: 537.98, y: 66.42 }, distance: 0 },
    { center: { x: 741.31, y: 66.42 }, distance: straight / 2 },
    { center: { x: 944.65, y: 66.42 }, distance: straight },
    { center: { x: 944.65, y: 349.52 }, distance: straight + halfArc },
    { center: { x: 741.31, y: 349.52 }, distance: straight + halfArc + straight / 2 },
    { center: { x: 537.98, y: 349.52 }, distance: straight + halfArc + straight }
  ];

  sliderGroup.id = 'interactive-slider';
  sliderGroup.setAttribute('tabindex', '0');
  sliderGroup.setAttribute('role', 'slider');
  sliderGroup.setAttribute('aria-label', 'Rotation control');
  sliderGroup.setAttribute('aria-valuemin', '0');
  sliderGroup.setAttribute('aria-valuemax', '100');
  sliderGroup.setAttribute('aria-valuenow', '0');
  track.setAttribute('aria-hidden', 'true');

  function render() {
    setTransform(outerPill, `rotate(${progress * 360} ${centers.outer.x} ${centers.outer.y})`);
    orbs.forEach((orb, index) => {
      const start = orbStarts[index];
      const point = snakeTrack.getPointAtLength((start.distance + progress * trackLength * 3) % trackLength);
      setTransform(orb, `translate(${point.x - start.center.x} ${point.y - start.center.y})`);
    });
    setTransform(sliderGroup, `translate(${progress * (slider.endX - slider.startX)} 0)`);
    sliderGroup.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
  }

  function progressFromEvent(event) {
    const point = illustration.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(illustration.getScreenCTM().inverse());
    return clamp((local.x - slider.startX) / (slider.endX - slider.startX));
  }

  sliderGroup.addEventListener('pointerdown', event => {
    dragging = true;
    sliderGroup.classList.add('is-dragging');
    sliderGroup.setPointerCapture(event.pointerId);
    progress = progressFromEvent(event);
    render();
  });

  sliderGroup.addEventListener('pointermove', event => {
    if (!dragging) return;
    progress = progressFromEvent(event);
    render();
  });

  function stopDragging(event) {
    dragging = false;
    sliderGroup.classList.remove('is-dragging');
    if (sliderGroup.hasPointerCapture(event.pointerId)) sliderGroup.releasePointerCapture(event.pointerId);
  }

  sliderGroup.addEventListener('pointerup', stopDragging);
  sliderGroup.addEventListener('pointercancel', stopDragging);
  sliderGroup.addEventListener('keydown', event => {
    const steps = { ArrowLeft: -0.02, ArrowDown: -0.02, ArrowRight: 0.02, ArrowUp: 0.02 };
    if (event.key in steps) {
      event.preventDefault();
      progress = clamp(progress + steps[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      progress = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      progress = 1;
    } else {
      return;
    }
    render();
  });

  render();
}

setup();

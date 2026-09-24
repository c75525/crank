const scene = document.querySelector('#scene');
const NS = 'http://www.w3.org/2000/svg';
const centers = {
  orbit: { x: 747.58, y: 199.43 },
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

function loadSvg() {
  return fetch('./pill.svg')
    .then(response => {
      if (!response.ok) throw new Error(`SVG request failed (${response.status})`);
      return response.text();
    })
    .then(markup => new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement);
}

function setup(svg) {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Pill mechanism with a draggable yellow slider');
  scene.append(document.importNode(svg, true));

  const illustration = scene.querySelector('svg');
  const assembly = [...illustration.children].find(element => element.localName === 'g');
  const outerPill = [...assembly.children].find(element => element.localName === 'rect');
  const contents = [...assembly.children].find(element => element.localName === 'g');
  const [green, orange, red, pink, purple, teal, track, sliderGroup] = [...contents.children];
  const orbGroup = document.createElementNS(NS, 'g');
  orbGroup.id = 'orbiting-orbs';
  contents.insertBefore(orbGroup, green);
  [green, orange, red, pink, purple, teal].forEach(orb => orbGroup.append(orb));

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
    setTransform(orbGroup, `rotate(${progress * 1080} ${centers.orbit.x} ${centers.orbit.y})`);
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

loadSvg().then(setup).catch(error => {
  scene.textContent = 'The pill graphic could not be loaded.';
  console.error(error);
});

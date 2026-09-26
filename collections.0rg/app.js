import * as easing from './vendor/pmndrs-math-time-easing.js';

const postsRoot = document.querySelector('#posts');
const postTemplate = document.querySelector('#post-template');
const mediaTemplate = document.querySelector('#media-template');
const imageLines = [];
const rowAnimations = new WeakMap();

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    .format(new Date(`${value}T12:00:00`));
}

function getRowWidths(row) {
  return getComputedStyle(row).gridTemplateColumns.split(' ').map(Number.parseFloat);
}

function setRowLayout(row, widths, gap) {
  row.style.gridTemplateColumns = widths.map(width => `${Math.max(width, 0)}px`).join(' ');
  row.style.gap = `${gap}px`;
}

function animateRow(row, targetWidths, targetGap, onComplete) {
  cancelAnimationFrame(rowAnimations.get(row));
  const initialWidths = getRowWidths(row);
  const initialGap = Number.parseFloat(getComputedStyle(row).gap);
  const startedAt = performance.now();
  const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160;

  function tick(now) {
    const progress = duration === 0 ? 1 : Math.min(1, (now - startedAt) / duration);
    const eased = easing.cubicInOut(progress);
    const widths = targetWidths.map((width, index) =>
      initialWidths[index] + (width - initialWidths[index]) * eased
    );
    setRowLayout(row, widths, initialGap + (targetGap - initialGap) * eased);
    if (progress < 1) {
      rowAnimations.set(row, requestAnimationFrame(tick));
    } else {
      rowAnimations.delete(row);
      onComplete?.();
    }
  }

  rowAnimations.set(row, requestAnimationFrame(tick));
}

function resetRow(row) {
  const items = [...row.querySelectorAll('.media-item')];
  if (items.length < 2) {
    row.classList.remove('is-expanded');
    row.style.removeProperty('grid-template-columns');
    row.style.removeProperty('gap');
    return;
  }
  const restingGap = 15;
  const restingWidth = (row.getBoundingClientRect().width - restingGap * (items.length - 1)) / items.length;
  animateRow(row, Array(items.length).fill(restingWidth), restingGap, () => {
    row.classList.remove('is-expanded');
    row.style.removeProperty('grid-template-columns');
    row.style.removeProperty('gap');
  });
}

function expandRow(row, activeItem) {
  const items = [...row.querySelectorAll('.media-item')];
  if (items.length < 2) return;

  const rowWidth = row.getBoundingClientRect().width;
  const restingGap = 15;
  const expandedGap = 30;
  const restingWidth = (rowWidth - restingGap * (items.length - 1)) / items.length;
  const activeWidth = restingWidth * 1.5;
  const otherWidth = (rowWidth - activeWidth - expandedGap * (items.length - 1)) / (items.length - 1);
  const widths = items.map(item => item === activeItem ? activeWidth : otherWidth);

  row.classList.add('is-expanded');
  animateRow(row, widths, expandedGap);
}

function getCaptionAlignment(position, itemCount) {
  if (itemCount === 1) return 'center';
  if (position === 0) return 'left';
  if (position === itemCount - 1) return 'right';
  return 'center';
}

function getImageSizes(itemCount) {
  const desktopWidth = itemCount <= 4 ? 400 : itemCount <= 6 ? 260 : 190;
  const mobileWidth = Math.ceil(150 / itemCount);
  return `(min-width: 1120px) ${desktopWidth}px, ${mobileWidth}vw`;
}

function setDescriptionText(element, text) {
  const emojiRun = /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu;
  element.replaceChildren();
  for (const part of text.split(emojiRun)) {
    if (!part) continue;
    if (emojiRun.test(part)) {
      const emoji = document.createElement('span');
      emoji.className = 'emoji';
      emoji.textContent = part;
      element.append(emoji);
    } else {
      element.append(document.createTextNode(part));
    }
    emojiRun.lastIndex = 0;
  }
}

function queueImage(image, sources) {
  image.dataset.src = sources[0].path;
  image.dataset.srcset = sources.map(source => `${source.path} ${source.width}w`).join(', ');
}

function loadImage(image, highPriority) {
  return new Promise(resolve => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
    image.loading = 'eager';
    image.fetchPriority = highPriority ? 'high' : 'auto';
    image.srcset = image.dataset.srcset;
    image.src = image.dataset.src;
    if (image.complete) queueMicrotask(finish);
    setTimeout(finish, 15000);
  });
}

async function loadImagesTopToBottom() {
  for (const [lineIndex, line] of imageLines.entries()) {
    await Promise.all(line.map(image => loadImage(image, lineIndex === 0)));
  }
}

function makePost(post) {
  const fragment = postTemplate.content.cloneNode(true);
  const article = fragment.querySelector('.post');
  const row = fragment.querySelector('.post-row');
  const caption = fragment.querySelector('.post-caption');
  const date = fragment.querySelector('.post-date');
  const itemsPerLine = 5;
  // Post-level captions remain indexed in data but are intentionally not shown by default.
  caption.hidden = true;
  date.dateTime = post.publishedAt;
  date.textContent = formatDate(post.publishedAt);
  article.dataset.postId = post.id;

  for (let start = 0; start < post.items.length; start += itemsPerLine) {
    const lineItems = post.items.slice(start, start + itemsPerLine);
    const line = document.createElement('div');
    line.className = 'media-line';
    line.style.setProperty('--items', lineItems.length);
    const lineImages = [];

    lineItems.forEach((item, position) => {
      const media = mediaTemplate.content.cloneNode(true);
      const link = media.querySelector('.media-item');
      const image = media.querySelector('img');
      const description = media.querySelector('.media-description');
      link.href = item.sourceUrl || post.sourceUrl || '#';
      link.dataset.itemId = item.id;
      link.dataset.position = start + position + 1;
      link.dataset.captionAlignment = getCaptionAlignment(position, lineItems.length);
      const sources = item.responsiveSources || [{ path: item.processedPath, width: item.intrinsicWidth || 480 }];
      queueImage(image, sources);
      image.sizes = getImageSizes(lineItems.length);
      if (item.intrinsicWidth) image.width = item.intrinsicWidth;
      if (item.intrinsicHeight) image.height = item.intrinsicHeight;
      image.alt = item.altText || item.description || `Post ${post.id}, item ${start + position + 1}`;
      const descriptionText = item.description || item.altText || '';
      setDescriptionText(description, descriptionText);
      description.hidden = !descriptionText;
      link.addEventListener('mouseenter', () => expandRow(line, link));
      link.addEventListener('focus', () => expandRow(line, link));
      link.addEventListener('blur', () => requestAnimationFrame(() => {
        if (!line.contains(document.activeElement) && !line.matches(':hover')) resetRow(line);
      }));
      lineImages.push(image);
      line.append(media);
    });
    imageLines.push(lineImages);
    // Keep the expanded grid stable while the pointer crosses an item edge or gap.
    line.addEventListener('mouseleave', () => {
      if (!line.contains(document.activeElement)) resetRow(line);
    });
    row.append(line);
  }
  return fragment;
}

async function render() {
  try {
    const response = await fetch('./data/posts.json');
    if (!response.ok) throw new Error(`Index request failed (${response.status})`);
    const index = await response.json();
    index.posts.forEach(post => postsRoot.append(makePost(post)));
    loadImagesTopToBottom();
  } catch (error) {
    postsRoot.textContent = 'The post index could not be loaded.';
    console.error(error);
  }
}

render();

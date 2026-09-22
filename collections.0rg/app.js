const postsRoot = document.querySelector('#posts');
const postTemplate = document.querySelector('#post-template');
const mediaTemplate = document.querySelector('#media-template');

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    .format(new Date(`${value}T12:00:00`));
}

function resetRow(row) {
  row.classList.remove('is-expanded');
  row.style.removeProperty('grid-template-columns');
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

  row.style.gridTemplateColumns = widths.map(width => `${Math.max(width, 0)}px`).join(' ');
  row.classList.add('is-expanded');
}

function getCaptionAlignment(position, itemCount) {
  if (itemCount === 1) return 'center';
  if (position === 0) return 'left';
  if (position === itemCount - 1) return 'right';
  return 'center';
}

function makePost(post) {
  const fragment = postTemplate.content.cloneNode(true);
  const article = fragment.querySelector('.post');
  const row = fragment.querySelector('.post-row');
  const caption = fragment.querySelector('.post-caption');
  const date = fragment.querySelector('.post-date');
  row.style.setProperty('--items', post.items.length);
  caption.textContent = post.caption || '';
  caption.hidden = !post.caption;
  date.dateTime = post.publishedAt;
  date.textContent = formatDate(post.publishedAt);
  article.dataset.postId = post.id;

  post.items.forEach((item, position) => {
    const media = mediaTemplate.content.cloneNode(true);
    const link = media.querySelector('.media-item');
    const image = media.querySelector('img');
    const description = media.querySelector('.media-description');
    link.href = item.sourceUrl || post.sourceUrl || '#';
    link.dataset.itemId = item.id;
    link.dataset.position = position + 1;
    link.dataset.captionAlignment = getCaptionAlignment(position, post.items.length);
    image.src = item.processedPath;
    image.alt = item.altText || item.description || `Post ${post.id}, item ${position + 1}`;
    description.textContent = item.description || item.altText || '';
    description.hidden = !description.textContent;
    link.addEventListener('mouseenter', () => expandRow(row, link));
    link.addEventListener('focus', () => expandRow(row, link));
    link.addEventListener('mouseleave', () => {
      if (!row.contains(document.activeElement)) resetRow(row);
    });
    link.addEventListener('blur', () => requestAnimationFrame(() => {
      if (!row.contains(document.activeElement)) resetRow(row);
    }));
    row.append(media);
  });
  return fragment;
}

async function render() {
  try {
    const response = await fetch('./data/posts.json');
    if (!response.ok) throw new Error(`Index request failed (${response.status})`);
    const index = await response.json();
    index.posts.forEach(post => postsRoot.append(makePost(post)));
  } catch (error) {
    postsRoot.textContent = 'The post index could not be loaded.';
    console.error(error);
  }
}

render();

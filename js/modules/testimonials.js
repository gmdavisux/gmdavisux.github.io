function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function renderTestimonialCard(person) {
  const paragraphs = (person.words || []).map((text) => `<p>${escapeHtml(decodeEntities(text))}</p>`).join('');

  return `
    <div class="col-lg-12 mb-4">
      <div class="p-3 border-top border-secondary-subtle">
        <div>
          <img src="${escapeHtml(person.img)}" alt="${escapeHtml(person.name)}" class="border float-start me-3">
          <div style="min-height:100px;">
            <h5>${escapeHtml(person.name)}</h5>
            <p class="small mb-1">${escapeHtml(person.title)}</p>
            <p class="small text-muted">${escapeHtml(person.relation)}</p>
          </div>
        </div>
        <div>${paragraphs}</div>
      </div>
    </div>
  `;
}

export async function renderTestimonials(container) {
  if (!container) return;

  try {
    const response = await fetch('js/testimonials.json');
    if (!response.ok) {
      throw new Error('Failed to load testimonials.json');
    }

    const people = await response.json();
    const midpoint = Math.ceil(people.length / 2);
    const left = people.slice(0, midpoint);
    const right = people.slice(midpoint);

    container.innerHTML = `
      <div class="col-lg-6">
        <div class="row">${left.map(renderTestimonialCard).join('')}</div>
      </div>
      <div class="col-lg-6">
        <div class="row">${right.map(renderTestimonialCard).join('')}</div>
      </div>
    `;
  } catch (error) {
    console.error('Error rendering testimonials:', error);
    container.innerHTML = '<div class="col-12"><p class="text-muted">Unable to load recommendations.</p></div>';
  }
}
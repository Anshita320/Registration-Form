const regForm = document.getElementById('regForm');
const cards = document.getElementById('cards');
const avatarInput = document.getElementById('avatar');
const resetBtn = document.getElementById('resetBtn');

const users = [];

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  }[m]));
}

function readImageFile(input, callback) {
  const file = input.files && input.files[0];
  if (!file) return callback(null);
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function renderUserCard(user) {
  const card = document.createElement('div');
  card.className = 'card';

  let avatarEl;
  if (user.avatar) {
    avatarEl = document.createElement('img');
    avatarEl.src = user.avatar;
    avatarEl.className = 'avatar';
  } else {
    avatarEl = document.createElement('div');
    avatarEl.className = 'avatar';
    avatarEl.textContent =
      (user.firstName[0] || '') + (user.lastName[0] || '');
  }

  const info = document.createElement('div');
  const title = document.createElement('div');
  title.textContent = user.firstName + ' ' + user.lastName;

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `
    <div><strong>Email:</strong> ${escapeHtml(user.email)}</div>
    <div><strong>DOB:</strong> ${escapeHtml(user.dob)} • <strong>Gender:</strong> ${escapeHtml(user.gender)}</div>
    <div><strong>Country:</strong> ${escapeHtml(user.country)}</div>
    <div><strong>Skills:</strong> ${user.skills.join(', ') || '—'}</div>
    <div><em>${escapeHtml(user.bio)}</em></div>
  `;

  info.appendChild(title);
  info.appendChild(meta);

  card.appendChild(avatarEl);
  card.appendChild(info);
  return card;
}

function refreshCards() {
  cards.innerHTML = '';
  users.forEach(u => cards.appendChild(renderUserCard(u)));
  if (users.length === 0) {
    cards.innerHTML = '<p style="color:#666">No submissions yet.</p>';
  }
}

regForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(regForm);

  const user = {
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    email: formData.get('email').trim(),
    password: formData.get('password'),
    dob: formData.get('dob'),
    gender: formData.get('gender'),
    country: formData.get('country'),
    bio: formData.get('bio').trim(),
    skills: formData.getAll('skills'),
    avatar: null
  };

  readImageFile(avatarInput, (avatarDataUrl) => {
    if (avatarDataUrl) user.avatar = avatarDataUrl;
    users.unshift(user);
    refreshCards();
    regForm.reset();
  });
});

resetBtn.addEventListener('click', () => {
  regForm.reset();
  avatarInput.value = '';
});

refreshCards();

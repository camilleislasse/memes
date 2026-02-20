const REPO = 'camilleislasse/memes';
const sidebar = document.querySelector('[data-sidebar]');
const fileInput = sidebar.querySelector('[data-file-input]');
const tokenInfo = sidebar.querySelector('[data-token-info]');
const tokenForm = sidebar.querySelector('[data-token-form]');
const tokenInput = sidebar.querySelector('[data-token-input]');

// --- Token ---

function getToken() {
    return localStorage.getItem('gh-token');
}

function updateTokenUI() {
    tokenForm.classList.toggle('hidden', !!getToken());
}

tokenInfo.addEventListener('click', () => {
    tokenInput.value = getToken() || '';
    tokenForm.classList.toggle('hidden');
});

sidebar.querySelector('[data-save-token]').addEventListener('click', () => {
    if (tokenInput.value) {
        localStorage.setItem('gh-token', tokenInput.value);
        updateTokenUI();
    }
});

updateTokenUI();

// --- Upload ---

sidebar.querySelector('[data-upload]').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) uploadMeme(e.target.files[0]);
});

async function uploadMeme(file) {
    const token = getToken();
    if (!token) return flashError();

    try {
        const content = await readAsBase64(file);
        const ts = Date.now();
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `meme-${ts}.${ext}`;
        const branch = `meme-${ts}`;

        const main = await ghApi('GET', `/repos/${REPO}/git/ref/heads/main`, token);

        await ghApi('POST', `/repos/${REPO}/git/refs`, token, {
            ref: `refs/heads/${branch}`,
            sha: main.object.sha
        });

        await ghApi('PUT', `/repos/${REPO}/contents/memes/${filename}`, token, {
            message: `Add ${filename}`,
            content,
            branch
        });

        await ghApi('POST', `/repos/${REPO}/pulls`, token, {
            title: `Add ${filename}`,
            head: branch,
            base: 'main',
            body: 'Nouveau meme.'
        });

        flashSuccess();
        fileInput.value = '';
    } catch (err) {
        console.error(err);
        flashError();
        fileInput.value = '';
    }
}

// --- Utils ---

async function ghApi(method, endpoint, token, body) {
    const res = await fetch('https://api.github.com' + endpoint, {
        method,
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json'
        },
        body: body ? JSON.stringify(body) : null
    });
    if (!res.ok) throw new Error((await res.json()).message || 'API error');
    return res.json();
}

function readAsBase64(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(',')[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
    });
}

function flashSuccess() {
    sidebar.style.background = '#27ae60';
    setTimeout(() => sidebar.style.background = '', 1500);
}

function flashError() {
    sidebar.style.background = '#e74c3c';
    setTimeout(() => sidebar.style.background = '', 1500);
}
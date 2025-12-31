async function loadCommands(){
  const res = await fetch('commands.json', { cache: 'no-store' });
  return await res.json();
}

function titleize(cat){
  const map = {
    community: "Community",
    dev: "Dev",
    economy: "Economia",
    fun: "Fun",
    giveaways: "Giveaways",
    levels: "Livelli",
    moderation: "Moderazione",
    music: "Musica",
    twitch: "Twitch",
    utility: "Utility",
  };
  return map[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));
}

function iconFor(cat){
  const map = {
    community: "👥",
    dev: "🧪",
    economy: "💰",
    fun: "😂",
    giveaways: "🎁",
    levels: "📈",
    moderation: "🛡️",
    music: "🎵",
    twitch: "📺",
    utility: "🧰",
  };
  return map[cat] || "✨";
}

function render(commands){
  const root = document.getElementById('commandsRoot');
  root.innerHTML = '';

  const byCat = new Map();
  for(const c of commands){
    if(!byCat.has(c.category)) byCat.set(c.category, []);
    byCat.get(c.category).push(c);
  }

  const cats = Array.from(byCat.keys()).sort();
  document.getElementById('cmdCount').textContent = String(commands.length);
  document.getElementById('catCount').textContent = String(cats.length);

  for(const cat of cats){
    const list = byCat.get(cat).sort((a,b)=>a.name.localeCompare(b.name));

    const group = document.createElement('div');
    group.className = 'group';

    const head = document.createElement('div');
    head.className = 'group-head';
    head.innerHTML = `
      <div class="group-title">
        <span>${iconFor(cat)}</span>
        <span>${titleize(cat)}</span>
        <span class="badge">${list.length} comandi</span>
      </div>
      <div class="chev">▾</div>
    `;

    const body = document.createElement('div');
    body.className = 'group-body';

    for(const cmd of list){
      const el = document.createElement('div');
      el.className = 'cmd';

      const opts = (cmd.options || []).map(o => {
        const req = o.required ? ' <span class="req">(obbligatorio)</span>' : '';
        return `<span><b>${o.name}</b> — ${o.description}${req}</span>`;
      }).join('');

      el.innerHTML = `
        <div class="cmd-left">
          <div class="cmd-name">/${cmd.name}</div>
          <div class="opt">${opts ? `<div>Opzioni:</div>${opts}` : ''}</div>
        </div>
        <div class="cmd-right">
          <div class="cmd-desc">${cmd.description || ''}</div>
        </div>
      `;
      body.appendChild(el);
    }

    group.appendChild(head);
    group.appendChild(body);
    root.appendChild(group);

    head.addEventListener('click', () => group.classList.toggle('open'));
  }
}

function wireSearch(all){
  const input = document.getElementById('search');

  const doFilter = () => {
    const q = input.value.trim().toLowerCase();
    if(!q) return render(all);

    const filtered = all.filter(c => {
      const base = `${c.category} ${c.name} ${c.description || ''}`.toLowerCase();
      const optText = (c.options || []).map(o => `${o.name} ${o.description}`).join(' ').toLowerCase();
      return base.includes(q) || optText.includes(q);
    });
    render(filtered);
    // open all groups when filtering
    document.querySelectorAll('.group').forEach(g => g.classList.add('open'));
  };

  input.addEventListener('input', doFilter);

  // CTRL+/
  window.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === '/'){
      e.preventDefault();
      input.focus();
    }
  });
}

function setupPlaceholders(){
  const invite = 'https://discord.com/oauth2/authorize?client_id=1305192295590789130&permissions=8&integration_type=0&scope=bot+applications.commands';   // <-- metti qui il tuo link di invito
  const support = 'https://discord.gg/3s23xJFj2P';  // <-- metti qui il link del tuo server supporto
  const github = 'https://paypal.me/VitrioMorningstar?locale.x=it_IT&country.x=IT';   // <-- metti qui il link al repo

  const inviteBtn = document.getElementById('inviteBtn');
  const inviteBtn2 = document.getElementById('inviteBtn2');
  inviteBtn.href = invite; inviteBtn2.href = invite;

  document.getElementById('supportLink').href = support;
  document.getElementById('githubLink').href = github;
}

(async function init(){
  setupPlaceholders();
  const all = await loadCommands();
  render(all);
  wireSearch(all);
})();

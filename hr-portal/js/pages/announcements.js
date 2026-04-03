Layout.init('announcements','Announcements','Company communications',{label:'+ New Announcement',fn:"openModal('addAnnounce')"});
document.getElementById('main-content').innerHTML = `
  <div class="filter-bar mb16">
    <select class="form-input" style="width:160px" onchange="filterAnn(this.value)">
      <option value="">All Categories</option><option>General</option><option>Policy</option><option>Event</option><option>Holiday</option><option>Urgent</option>
    </select>
  </div>
  <div id="ann-list"></div>
  <div class="modal-overlay" id="modal-addAnnounce">
    <div class="modal"><div class="modal-header"><div class="modal-title">NEW ANNOUNCEMENT</div><button class="modal-close" onclick="closeModal('addAnnounce')">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Category</label><select class="form-input" id="a-cat"><option>General</option><option>Policy</option><option>Event</option><option>Holiday</option><option>Urgent</option></select></div>
      <div class="form-group"><label class="form-label required">Title</label><input class="form-input" id="a-title" placeholder="Announcement title…"></div>
      <div class="form-group"><label class="form-label required">Message</label><textarea class="form-input" id="a-body" rows="5" placeholder="Write your announcement here…"></textarea></div>
      <div class="form-group"><label class="form-label">Priority</label><select class="form-input" id="a-pri"><option>Normal</option><option>High</option><option>Urgent</option></select></div>
      <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="a-pin"> Pin to top</label></div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal('addAnnounce')">Cancel</button><button class="btn btn-primary" onclick="saveAnn()">Publish</button></div>
    </div>
  </div>`;

let annFilter='';
function filterAnn(cat){annFilter=cat;renderAnn();}

const PRIORITY_COLOR={Normal:'',High:'priority-high',Urgent:'priority-urgent'};
const CAT_COLOR={General:'var(--accent)',Policy:'var(--blue)',Event:'var(--teal)',Holiday:'var(--orange)',Urgent:'var(--red)'};

function renderAnn(){
  let data=DB.getAll('announcements');
  if(annFilter)data=data.filter(a=>a.cat===annFilter);
  document.getElementById('ann-list').innerHTML=data.map(a=>`
    <div class="announce-card ${PRIORITY_COLOR[a.priority]||''}" style="--ac:${CAT_COLOR[a.cat]||'var(--accent)'}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
        <div style="flex:1">
          <div class="announce-tag" style="color:${CAT_COLOR[a.cat]||'var(--accent)'}">
            ${a.cat}${a.priority!=='Normal'?' · ⚡ '+a.priority+' Priority':''}${a.pinned?' · 📌 Pinned':''}
          </div>
          <div class="announce-title">${a.title}</div>
          <div class="announce-body">${a.body}</div>
          <div class="announce-footer">
            <span>Posted by ${a.by}</span>
            <span>${UI.formatDate(a.date)}</span>
          </div>
        </div>
        ${Auth.isAdmin()?`<div style="display:flex;gap:4px;flex-shrink:0">
          <button class="btn btn-danger btn-xs" onclick="deleteAnn('${a.id}')">🗑️</button>
        </div>`:''}
      </div>
    </div>`).join('') || `<div class="empty-state"><div class="empty-icon">📢</div><div class="empty-title">No announcements</div></div>`;
}

function deleteAnn(id){
  if(!UI.confirm('Delete this announcement?'))return;
  DB.remove('announcements',id);UI.toast('Deleted.','error');renderAnn();
}
function saveAnn(){
  const g=id=>document.getElementById(id).value;
  if(!g('a-title')||!g('a-body')){UI.toast('Fill required fields','error');return;}
  DB.add('announcements',{
    id:DB.nextId('announcements','AN'),cat:g('a-cat'),title:g('a-title'),body:g('a-body'),
    by:Auth.getSession().name,date:new Date().toISOString().slice(0,10),
    priority:g('a-pri'),pinned:document.getElementById('a-pin').checked
  });
  Auth.logActivity('Announcement published: '+g('a-title'));
  UI.closeModal('addAnnounce');UI.toast('Announcement published!');renderAnn();
}
renderAnn();

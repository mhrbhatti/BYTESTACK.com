Layout.init('training','Training','Learning & development',{label:'+ Add Training',fn:"openModal('addTraining')"});
document.getElementById('main-content').innerHTML = `
  <div class="stats-grid stats-2 mb16" id="tr-stats"></div>
  <div class="card mb16">
    <div class="card-header"><div class="card-title">TRAINING PROGRAMS</div></div>
    <div id="training-list"></div>
  </div>
  <div class="modal-overlay" id="modal-addTraining">
    <div class="modal"><div class="modal-header"><div class="modal-title">ADD TRAINING</div><button class="modal-close" onclick="closeModal('addTraining')">✕</button></div>
    <div class="modal-body"><div class="form-grid-2">
      <div class="form-group span-2"><label class="form-label required">Training Title</label><input class="form-input" id="t-title" placeholder="e.g. Advanced React Patterns"></div>
      <div class="form-group"><label class="form-label">Category</label><select class="form-input" id="t-cat"><option>Technical</option><option>Soft Skills</option><option>Leadership</option><option>Compliance</option></select></div>
      <div class="form-group"><label class="form-label">Trainer</label><input class="form-input" id="t-trainer"></div>
      <div class="form-group"><label class="form-label">Duration</label><input class="form-input" id="t-dur" placeholder="3 days"></div>
      <div class="form-group"><label class="form-label">Start Date</label><input type="date" class="form-input" id="t-start"></div>
      <div class="form-group"><label class="form-label">End Date</label><input type="date" class="form-input" id="t-end"></div>
      <div class="form-group span-2"><label class="form-label">Description</label><textarea class="form-input" id="t-desc" rows="2"></textarea></div>
    </div></div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal('addTraining')">Cancel</button><button class="btn btn-primary" onclick="saveTraining()">Schedule Training</button></div>
    </div>
  </div>`;

const STATUS_COLOR={Upcoming:'var(--blue)','In Progress':'var(--accent)',Completed:'var(--green)'};

function renderTraining(){
  const data=DB.getAll('training');
  const active=data.filter(t=>t.status==='In Progress').length;
  const completed=data.filter(t=>t.status==='Completed').length;
  document.getElementById('tr-stats').innerHTML=[
    {color:'teal',icon:'🎓',num:data.filter(t=>t.status!=='Completed').length,label:'Active Courses'},
    {color:'yellow',icon:'✅',num:completed,label:'Completed This Period'},
  ].map(s=>`<div class="stat-card ${s.color}"><div class="sc-icon">${s.icon}</div><div class="sc-num">${s.num}</div><div class="sc-label">${s.label}</div></div>`).join('');

  document.getElementById('training-list').innerHTML=data.map(t=>`
    <div class="training-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px">
        <div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px">${t.title}</div>
          <div style="display:flex;gap:14px;flex-wrap:wrap">
            <span style="font-family:var(--M);font-size:9px;color:var(--text3)">📚 ${t.cat}</span>
            <span style="font-family:var(--M);font-size:9px;color:var(--text3)">👤 ${t.trainer}</span>
            <span style="font-family:var(--M);font-size:9px;color:var(--text3)">⏱ ${t.duration}</span>
            <span style="font-family:var(--M);font-size:9px;color:var(--text3)">📅 ${UI.formatDate(t.start)} → ${UI.formatDate(t.end)}</span>
            <span style="font-family:var(--M);font-size:9px;color:var(--text3)">👥 ${(t.enrolled||[]).length} enrolled</span>
          </div>
          <div style="font-size:12px;color:var(--text3);margin-top:6px">${t.desc||''}</div>
        </div>
        <div style="flex-shrink:0">${UI.badge(t.status)}</div>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:5px">
          <span style="font-family:var(--M);font-size:9px;color:var(--text3)">Progress</span>
          <span style="font-family:var(--M);font-size:9px;color:${STATUS_COLOR[t.status]||'var(--accent)'}">${t.progress}%</span>
        </div>
        ${UI.progress(t.progress,100,STATUS_COLOR[t.status]||'var(--accent)')}
      </div>
      <div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end">
        ${t.status!=='Completed'?`<button class="btn btn-success btn-xs" onclick="markComplete('${t.id}')">Mark Complete</button>`:''}
        <button class="btn btn-danger btn-xs" onclick="deleteTraining('${t.id}')">Delete</button>
      </div>
    </div>`).join('') || `<div class="empty-state"><div class="empty-icon">🎓</div><div class="empty-title">No training programs yet</div></div>`;
}

function markComplete(id){
  DB.update('training',id,{status:'Completed',progress:100});
  Auth.logActivity('Training completed: '+DB.getById('training',id)?.title);
  UI.toast('Training marked complete!');renderTraining();
}
function deleteTraining(id){
  if(!UI.confirm('Delete this training?'))return;
  DB.remove('training',id);UI.toast('Deleted.','error');renderTraining();
}
function saveTraining(){
  const g=id=>document.getElementById(id).value;
  if(!g('t-title')){UI.toast('Enter title','error');return;}
  DB.add('training',{id:DB.nextId('training','TR'),title:g('t-title'),cat:g('t-cat'),trainer:g('t-trainer'),duration:g('t-dur'),start:g('t-start'),end:g('t-end'),status:'Upcoming',enrolled:[],progress:0,desc:g('t-desc')});
  Auth.logActivity('Training scheduled: '+g('t-title'));
  UI.closeModal('addTraining');UI.toast('Training scheduled!');renderTraining();
}
renderTraining();

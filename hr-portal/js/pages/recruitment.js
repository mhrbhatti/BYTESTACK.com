Layout.init('recruitment','Recruitment','Manage hiring pipeline',{label:'+ Post Job',fn:"openModal('addJob')"});
document.getElementById('main-content').innerHTML = `
  <div class="tabs-bar mb16">
    <button class="tab-btn active" onclick="showRTab('jobs',this)">Open Positions</button>
    <button class="tab-btn" onclick="showRTab('applicants',this)">Applicants</button>
    <button class="tab-btn" onclick="showRTab('pipeline',this)">Pipeline</button>
  </div>
  <div id="rtab-jobs"></div>
  <div id="rtab-applicants" style="display:none"></div>
  <div id="rtab-pipeline" style="display:none"></div>
  <div class="modal-overlay" id="modal-addJob">
    <div class="modal"><div class="modal-header"><div class="modal-title">POST JOB</div><button class="modal-close" onclick="closeModal('addJob')">✕</button></div>
    <div class="modal-body"><div class="form-grid-2">
      <div class="form-group span-2"><label class="form-label required">Job Title</label><input class="form-input" id="j-title"></div>
      <div class="form-group"><label class="form-label">Department</label><select class="form-input" id="j-dept"><option>Development</option><option>Marketing</option><option>Design</option><option>Content</option><option>Leadership</option></select></div>
      <div class="form-group"><label class="form-label">Type</label><select class="form-input" id="j-type"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option></select></div>
      <div class="form-group"><label class="form-label">Salary Range</label><input class="form-input" id="j-salary" placeholder="PKR 60,000 – 90,000"></div>
      <div class="form-group"><label class="form-label">Deadline</label><input type="date" class="form-input" id="j-deadline"></div>
      <div class="form-group span-2"><label class="form-label">Description</label><textarea class="form-input" id="j-desc" rows="3" placeholder="Job requirements and responsibilities…"></textarea></div>
    </div></div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal('addJob')">Cancel</button><button class="btn btn-primary" onclick="saveJob()">Post Job</button></div>
    </div>
  </div>`;

function showRTab(tab,btn){
  document.querySelectorAll('.tab-btn').forEach(t=>t.classList.remove('active'));btn.classList.add('active');
  ['jobs','applicants','pipeline'].forEach(t=>document.getElementById('rtab-'+t).style.display=t===tab?'':'none');
  if(tab==='jobs')renderJobs();if(tab==='applicants')renderApplicants();if(tab==='pipeline')renderPipeline();
}

const ICONS=['⚛️','📈','📱','✍️','💼','🎨','🔷','📊'];
function renderJobs(){
  const jobs=DB.getAll('jobs');
  document.getElementById('rtab-jobs').innerHTML=jobs.map((j,i)=>`
    <div class="job-card"><div class="job-icon">${ICONS[i%ICONS.length]}</div>
    <div style="flex:1"><div style="font-size:15px;font-weight:600;margin-bottom:5px">${j.title}</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <span style="font-family:var(--M);font-size:9px;color:var(--text3)">🏢 ${j.dept}</span>
      <span style="font-family:var(--M);font-size:9px;color:var(--text3)">⏱ ${j.type}</span>
      <span style="font-family:var(--M);font-size:9px;color:var(--text3)">💰 ${j.salary}</span>
      <span style="font-family:var(--M);font-size:9px;color:var(--text3)">📅 ${UI.formatDate(j.deadline)}</span>
    </div></div>
    <div style="text-align:right;flex-shrink:0"><div style="font-family:var(--D);font-size:32px;color:var(--accent)">${j.applicants}</div>
    <div style="font-family:var(--M);font-size:8px;color:var(--text3)">APPLICANTS</div>
    <div style="display:flex;gap:6px;margin-top:6px;justify-content:flex-end">${UI.badge(j.status)}<button class="btn btn-ghost btn-xs" onclick="closeJob('${j.id}')">Close</button></div>
    </div></div>`).join('')||`<div class="empty-state"><div class="empty-icon">🎯</div><div class="empty-title">No open positions</div></div>`;
}

function renderApplicants(){
  const apps=DB.getAll('applicants');
  document.getElementById('rtab-applicants').innerHTML=`<div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Applicant</th><th>Position</th><th>Applied</th><th>Stage</th><th>Score</th><th>Actions</th></tr></thead>
    <tbody>${apps.map(a=>`<tr>
      <td class="td-bold"><div class="avatar-row">${UI.avatar(a.name,'Development')}<div class="avatar-info"><div class="name">${a.name}</div><div class="sub">${a.email}</div></div></div></td>
      <td>${a.job}</td><td>${UI.formatDate(a.applied)}</td><td>${UI.badge(a.stage)}</td>
      <td><span style="font-family:var(--M);font-size:11px;color:var(--accent)">${a.score}%</span></td>
      <td><div class="td-actions">
        <select class="form-input" style="width:120px;padding:4px 8px;font-size:11px" onchange="changeStage('${a.id}',this.value)">
          ${['Applied','Screening','Interview','Offer','Hired','Withdrawn'].map(s=>`<option ${s===a.stage?'selected':''}>${s}</option>`).join('')}
        </select>
      </div></td>
    </tr>`).join('')}</tbody>
  </table></div></div>`;
}

function renderPipeline(){
  const stages=['Applied','Screening','Interview','Offer','Hired'];
  const apps=DB.getAll('applicants');
  document.getElementById('rtab-pipeline').innerHTML=`<div class="pipeline">${stages.map(s=>{
    const items=apps.filter(a=>a.stage===s);
    return`<div class="pipe-col">
      <div class="pipe-col-header"><span>${s}</span><span style="background:var(--surface2);padding:1px 6px;border-radius:8px;font-size:10px">${items.length}</span></div>
      ${items.map(a=>`<div class="pipe-card">${a.name}<div class="pipe-card-sub">${a.job}</div></div>`).join('')}
    </div>`;}).join('')}</div>`;
}

function changeStage(id,stage){DB.update('applicants',id,{stage});UI.toast('Stage updated!');renderApplicants();}
function closeJob(id){DB.update('jobs',id,{status:'Closed'});UI.toast('Job closed.','error');renderJobs();}
function saveJob(){
  const g=id=>document.getElementById(id).value;
  if(!g('j-title')){UI.toast('Enter job title','error');return;}
  DB.add('jobs',{id:DB.nextId('jobs','JOB'),title:g('j-title'),dept:g('j-dept'),type:g('j-type'),salary:g('j-salary'),desc:g('j-desc'),posted:new Date().toISOString().slice(0,10),deadline:g('j-deadline'),status:'Active',applicants:0});
  Auth.logActivity('Posted job: '+g('j-title'));
  UI.closeModal('addJob');UI.toast('Job posted!');renderJobs();
}

renderJobs();

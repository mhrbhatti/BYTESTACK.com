Layout.init('performance','Performance','Reviews & KPIs',{label:'+ Add Review',fn:"openModal('addReview')"});
document.getElementById('main-content').innerHTML = `
  <div class="stats-grid stats-4 mb16" id="perf-stats"></div>
  <div class="grid-main-side">
    <div class="card mb16">
      <div class="card-header"><div class="card-title">PERFORMANCE REVIEWS</div></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Employee</th><th>Dept</th><th>Period</th><th>Score</th><th>Goals Met</th><th>Action</th><th>Status</th><th>Edit</th></tr></thead>
        <tbody id="perf-tbody"></tbody>
      </table></div>
    </div>
    <div class="col-gap">
      <div class="card"><div class="card-header"><div class="card-title">TOP PERFORMERS</div></div><div id="top-perf"></div></div>
      <div class="card"><div class="card-header"><div class="card-title">TEAM KPIs</div></div><div id="kpis"></div></div>
    </div>
  </div>
  <div class="modal-overlay" id="modal-addReview">
    <div class="modal"><div class="modal-header"><div class="modal-title">PERFORMANCE REVIEW</div><button class="modal-close" onclick="closeModal('addReview')">✕</button></div>
    <div class="modal-body"><div class="form-grid-2">
      <div class="form-group span-2"><label class="form-label required">Employee</label><select class="form-input" id="r-emp"></select></div>
      <div class="form-group"><label class="form-label">Review Period</label><select class="form-input" id="r-period"><option>Q1 2024</option><option>Q2 2024</option><option>H1 2024</option><option>Annual 2024</option></select></div>
      <div class="form-group"><label class="form-label required">Score (1-5)</label><input type="number" step="0.1" min="1" max="5" class="form-input" id="r-score" placeholder="4.5"></div>
      <div class="form-group"><label class="form-label">Goals Met (%)</label><input type="number" min="0" max="100" class="form-input" id="r-goals" placeholder="90"></div>
      <div class="form-group"><label class="form-label">Recommended Action</label><select class="form-input" id="r-action"><option>Continue</option><option>Promotion</option><option>Salary Increment</option><option>PIP</option><option>Training Required</option></select></div>
      <div class="form-group span-2"><label class="form-label">Notes</label><textarea class="form-input" id="r-notes" rows="3" placeholder="Review notes…"></textarea></div>
    </div></div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal('addReview')">Cancel</button><button class="btn btn-primary" onclick="saveReview()">Save Review</button></div>
    </div>
  </div>`;

const scoreBadge=s=>s>=4.5?'badge-green':s>=4?'badge-yellow':s>=3?'badge-orange':'badge-red';

function renderPerf(){
  const data=DB.getAll('performance');
  const avg=data.reduce((s,p)=>s+p.score,0)/data.length;
  document.getElementById('perf-stats').innerHTML=[
    {color:'yellow',icon:'⭐',num:avg.toFixed(1),label:'Avg Team Score',change:'↑ 0.3 from Q4 2023'},
    {color:'green', icon:'🏆',num:data.filter(p=>p.score>=4.5).length,label:'Top Performers',change:'Score 4.5+'},
    {color:'orange',icon:'📋',num:data.filter(p=>p.action==='PIP').length,label:'On PIP',change:'Needs improvement'},
    {color:'blue',  icon:'🎯',num:Math.round(data.reduce((s,p)=>s+p.goals,0)/data.length)+'%',label:'Avg Goal Completion'},
  ].map(s=>`<div class="stat-card ${s.color}"><div class="sc-icon">${s.icon}</div><div class="sc-num">${s.num}</div><div class="sc-label">${s.label}</div><div class="sc-change">${s.change||''}</div></div>`).join('');

  document.getElementById('perf-tbody').innerHTML=data.map(p=>`<tr>
    <td class="td-bold"><div class="avatar-row">${UI.avatar(p.emp,p.dept)}<span>${p.emp}</span></div></td>
    <td>${p.dept}</td><td style="font-family:var(--M);font-size:11px">${p.period}</td>
    <td><div style="display:flex;align-items:center;gap:8px"><span class="badge ${scoreBadge(p.score)}">${p.score}</span></div></td>
    <td><div style="display:flex;align-items:center;gap:8px"><span style="font-family:var(--M);font-size:11px">${p.goals}%</span>${UI.progress(p.goals,100,'var(--teal)')}</div></td>
    <td style="font-size:12px">${p.action}</td>
    <td>${UI.badge(p.score>=4.5?'Excellent':p.score>=4?'Good':p.score>=3?'Average':'Needs Improvement')}</td>
    <td><button class="btn btn-ghost btn-icon" onclick="editReview('${p.id}')">✏️</button></td>
  </tr>`).join('');

  document.getElementById('top-perf').innerHTML=[...data].sort((a,b)=>b.score-a.score).slice(0,4).map((p,i)=>`
    <div class="avatar-row" style="padding:9px;background:var(--surface);border-radius:6px;margin-bottom:7px">
      <div style="font-family:var(--D);font-size:20px;color:${i===0?'var(--accent)':'var(--text3)'};min-width:28px">0${i+1}</div>
      ${UI.avatar(p.emp,p.dept)}
      <div class="avatar-info" style="flex:1"><div class="name">${p.emp}</div><div class="sub">${p.dept}</div></div>
      <div style="font-family:var(--D);font-size:22px;color:var(--accent)">${p.score}</div>
    </div>`).join('');

  const kpiList=[['Code Quality',92,'var(--accent)'],['Delivery Speed',88,'var(--teal)'],['Client Satisfaction',96,'var(--green)'],['Team Collaboration',84,'var(--blue)']];
  document.getElementById('kpis').innerHTML=kpiList.map(([n,v,c])=>`<div class="perf-row"><div class="perf-label"><span class="perf-name">${n}</span><span class="perf-val">${v}%</span></div>${UI.progress(v,100,c)}</div>`).join('');
}

function editReview(id){
  const p=DB.getById('performance',id);
  document.getElementById('r-emp').value=p.empId;
  document.getElementById('r-score').value=p.score;
  document.getElementById('r-goals').value=p.goals;
  document.getElementById('r-notes').value=p.notes;
  UI.openModal('addReview');
}

function saveReview(){
  const g=id=>document.getElementById(id).value;
  const emps=DB.getAll('employees');
  const emp=emps.find(e=>e.id===g('r-emp'))||emps[0];
  const existing=DB.getAll('performance').find(p=>p.empId===emp.id);
  const data={score:parseFloat(g('r-score'))||4,goals:parseInt(g('r-goals'))||80,action:g('r-action'),notes:g('r-notes'),period:g('r-period'),reviewed:new Date().toISOString().slice(0,10)};
  if(existing)DB.update('performance',existing.id,data);
  else DB.add('performance',{id:DB.nextId('performance','PR'),empId:emp.id,emp:emp.first+' '+emp.last,dept:emp.dept,next:'',... data});
  Auth.logActivity('Performance review saved for '+emp.first+' '+emp.last);
  UI.closeModal('addReview');UI.toast('Review saved!');renderPerf();
}

// Populate emp select
const emps=DB.getAll('employees');
setTimeout(()=>{const sel=document.getElementById('r-emp');if(sel)sel.innerHTML=emps.map(e=>`<option value="${e.id}">${e.first} ${e.last}</option>`).join('');},100);

renderPerf();

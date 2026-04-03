Layout.init('reports','Reports','Analytics & insights');
document.getElementById('main-content').innerHTML = `
  <div class="stats-grid stats-4 mb16" id="rep-stats"></div>
  <div class="grid-2 mb16">
    <div class="card">
      <div class="card-header"><div class="card-title">DEPARTMENT HEADCOUNT</div></div>
      <div id="dept-chart" style="display:flex;flex-direction:column;gap:10px"></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">PAYROLL TREND</div></div>
      <div style="display:flex;align-items:flex-end;gap:8px;height:120px" id="payroll-chart"></div>
    </div>
  </div>
  <div class="grid-2 mb16">
    <div class="card">
      <div class="card-header"><div class="card-title">LEAVE SUMMARY</div></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Type</th><th>Total Taken</th><th>Approved</th><th>Pending</th><th>Rejected</th></tr></thead>
        <tbody id="leave-report-tbody"></tbody>
      </table></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">ATTENDANCE SUMMARY</div></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Employee</th><th>Present</th><th>Absent</th><th>Leave</th><th>Rate</th></tr></thead>
        <tbody id="att-report-tbody"></tbody>
      </table></div>
    </div>
  </div>
  <div class="card mb16">
    <div class="card-header">
      <div class="card-title">EXPORT REPORTS</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
      ${[
        {icon:'👥',label:'Employee List',fn:'exportEmployees'},
        {icon:'📅',label:'Attendance Report',fn:'exportAttendance'},
        {icon:'🏖️',label:'Leave Report',fn:'exportLeaves'},
        {icon:'💰',label:'Payroll Report',fn:'exportPayroll'},
        {icon:'📈',label:'Performance Report',fn:'exportPerformance'},
        {icon:'🎓',label:'Training Report',fn:'exportTraining'},
      ].map(r=>`<button class="btn btn-ghost" style="flex-direction:column;padding:20px;height:auto;gap:8px" onclick="${r.fn}()">
        <span style="font-size:24px">${r.icon}</span>
        <span>${r.label}</span>
        <span style="font-family:var(--M);font-size:9px;color:var(--text3)">Download CSV</span>
      </button>`).join('')}
    </div>
  </div>`;

function renderReports(){
  const emps=DB.getAll('employees');
  const leaves=DB.getAll('leaves');
  const att=DB.getAll('attendance');
  const payroll=DB.getAll('payroll');

  const totalPayroll=payroll.reduce((s,p)=>s+p.net,0);
  const avgSalary=totalPayroll/emps.length;
  const presentToday=att.filter(r=>r.date===new Date().toISOString().slice(0,10)&&r.status==='Present').length;
  const pendingLeaves=leaves.filter(l=>l.status==='Pending').length;

  document.getElementById('rep-stats').innerHTML=[
    {color:'yellow',icon:'👥',num:emps.length,label:'Total Headcount',change:emps.filter(e=>e.status==='Active').length+' active'},
    {color:'teal',  icon:'✅',num:presentToday,label:'Present Today',change:Math.round(presentToday/emps.length*100)+'% rate'},
    {color:'blue',  icon:'💰',num:'PKR '+Math.round(avgSalary/1000)+'K',label:'Avg Salary',change:'Gross average'},
    {color:'orange',icon:'🏖️',num:pendingLeaves,label:'Pending Leaves',change:'Awaiting approval'},
  ].map(s=>`<div class="stat-card ${s.color}"><div class="sc-icon">${s.icon}</div><div class="sc-num">${s.num}</div><div class="sc-label">${s.label}</div><div class="sc-change">${s.change}</div></div>`).join('');

  // Dept chart
  const depts={};
  emps.forEach(e=>{depts[e.dept]=(depts[e.dept]||0)+1;});
  const maxDept=Math.max(...Object.values(depts));
  document.getElementById('dept-chart').innerHTML=Object.entries(depts).map(([dept,count])=>`
    <div style="display:flex;align-items:center;gap:10px">
      <div style="font-family:var(--M);font-size:9px;color:var(--text3);letter-spacing:.08em;width:90px;text-align:right">${dept}</div>
      <div style="flex:1;background:var(--surface2);border-radius:3px;height:20px;overflow:hidden">
        <div style="height:100%;background:${UI.deptColor(dept)};border-radius:3px;width:${Math.round(count/maxDept*100)}%;transition:width .6s ease;display:flex;align-items:center;padding-left:8px">
          <span style="font-family:var(--M);font-size:9px;color:#000;font-weight:700">${count}</span>
        </div>
      </div>
    </div>`).join('');

  // Payroll trend (mock last 6 months)
  const months=['Jan','Feb','Mar','Apr','May','Jun'];
  const vals=[1080,1100,1140,1180,1210,1240];
  const maxVal=Math.max(...vals);
  document.getElementById('payroll-chart').innerHTML=months.map((m,i)=>`
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="width:100%;background:var(--accent);border-radius:3px 3px 0 0;height:${(vals[i]/maxVal)*100}%" title="PKR ${vals[i]}K"></div>
      <div style="font-family:var(--M);font-size:8px;color:var(--text3)">${m}</div>
    </div>`).join('');

  // Leave summary
  const types=['Annual','Sick','Casual','Unpaid'];
  document.getElementById('leave-report-tbody').innerHTML=types.map(t=>{
    const total=leaves.filter(l=>l.type===t);
    return`<tr><td class="td-bold">${t}</td><td>${total.length}</td><td style="color:var(--green)">${total.filter(l=>l.status==='Approved').length}</td><td style="color:var(--orange)">${total.filter(l=>l.status==='Pending').length}</td><td style="color:var(--red)">${total.filter(l=>l.status==='Rejected').length}</td></tr>`;
  }).join('');

  // Attendance summary (per employee, last 30 days)
  document.getElementById('att-report-tbody').innerHTML=emps.map(e=>{
    const empAtt=att.filter(r=>r.empId===e.id);
    const present=empAtt.filter(r=>r.status==='Present').length;
    const absent=empAtt.filter(r=>r.status==='Absent').length;
    const leave=empAtt.filter(r=>r.status==='Leave').length;
    const total=present+absent+leave;
    const rate=total?Math.round(present/total*100):0;
    return`<tr><td class="td-bold">${e.first} ${e.last}</td><td style="color:var(--green)">${present}</td><td style="color:var(--red)">${absent}</td><td style="color:var(--orange)">${leave}</td><td><span style="font-family:var(--M);font-size:11px;color:${rate>=90?'var(--green)':rate>=75?'var(--orange)':'var(--red)'}">${rate}%</span></td></tr>`;
  }).join('');
}

function csvDownload(filename,rows){
  const csv=rows.join('\n');
  const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download=filename;a.click();UI.toast('Exported: '+filename);
}
function exportEmployees(){
  const rows=['ID,First,Last,Email,Phone,Dept,Role,Type,Salary,Join,Status'];
  DB.getAll('employees').forEach(e=>rows.push(`${e.id},${e.first},${e.last},${e.email},${e.phone},${e.dept},${e.role},${e.type},${e.salary},${e.join},${e.status}`));
  csvDownload('employees.csv',rows);
}
function exportAttendance(){
  const rows=['Employee,Date,CheckIn,CheckOut,Hours,Status'];
  DB.getAll('attendance').slice(0,200).forEach(r=>rows.push(`${r.emp},${r.date},${r.checkIn||''},${r.checkOut||''},${r.hours||''},${r.status}`));
  csvDownload('attendance.csv',rows);
}
function exportLeaves(){
  const rows=['Employee,Type,From,To,Days,Status,Reason'];
  DB.getAll('leaves').forEach(l=>rows.push(`${l.emp},${l.type},${l.from},${l.to},${l.days},${l.status},${l.reason}`));
  csvDownload('leaves.csv',rows);
}
function exportPayroll(){
  const rows=['Employee,Dept,Base,HRA,Transport,Bonus,Tax,EOBI,Net,Status'];
  DB.getAll('payroll').forEach(p=>rows.push(`${p.emp},${p.dept},${p.base},${p.hra},${p.transport},${p.bonus},${p.tax},${p.eobi},${p.net},${p.status}`));
  csvDownload('payroll.csv',rows);
}
function exportPerformance(){
  const rows=['Employee,Dept,Period,Score,Goals,Action'];
  DB.getAll('performance').forEach(p=>rows.push(`${p.emp},${p.dept},${p.period},${p.score},${p.goals},${p.action}`));
  csvDownload('performance.csv',rows);
}
function exportTraining(){
  const rows=['Title,Category,Trainer,Duration,Start,End,Status,Progress'];
  DB.getAll('training').forEach(t=>rows.push(`${t.title},${t.cat},${t.trainer},${t.duration},${t.start},${t.end},${t.status},${t.progress}%`));
  csvDownload('training.csv',rows);
}
renderReports();

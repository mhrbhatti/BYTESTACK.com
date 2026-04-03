Layout.init('settings','Settings','Portal configuration');
const s=DB.getSettings();
document.getElementById('main-content').innerHTML = `
  <div class="grid-2">
    <div class="col-gap">
      <div class="card">
        <div class="card-header"><div class="card-title">COMPANY INFO</div></div>
        <div class="form-grid-2">
          <div class="form-group span-2"><label class="form-label">Company Name</label><input class="form-input" id="s-name" value="${s.companyName}"></div>
          <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="s-email" value="${s.email}"></div>
          <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="s-phone" value="${s.phone}"></div>
          <div class="form-group"><label class="form-label">Website</label><input class="form-input" id="s-web" value="${s.website}"></div>
          <div class="form-group"><label class="form-label">Currency</label><select class="form-input" id="s-cur"><option>PKR</option><option>USD</option><option>AED</option></select></div>
          <div class="form-group span-2"><label class="form-label">Address</label><input class="form-input" id="s-addr" value="${s.address}"></div>
          <div class="form-group span-2"><button class="btn btn-primary" onclick="saveCompany()">Save Company Info</button></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">WORKING HOURS</div></div>
        <div class="form-grid-2">
          <div class="form-group"><label class="form-label">Work Start</label><input type="time" class="form-input" id="s-start" value="${s.workStart}"></div>
          <div class="form-group"><label class="form-label">Work End</label><input type="time" class="form-input" id="s-end" value="${s.workEnd}"></div>
          <div class="form-group"><label class="form-label">Working Days</label><select class="form-input" id="s-wdays"><option>Mon-Fri</option><option>Mon-Sat</option></select></div>
          <div class="form-group"><label class="form-label">Late Grace (mins)</label><input type="number" class="form-input" id="s-grace" value="${s.lateGrace}"></div>
          <div class="form-group span-2"><button class="btn btn-primary" onclick="saveHours()">Save Hours</button></div>
        </div>
      </div>
    </div>
    <div class="col-gap">
      <div class="card">
        <div class="card-header"><div class="card-title">LEAVE POLICY</div></div>
        <div class="form-grid-2">
          <div class="form-group"><label class="form-label">Annual Leave (days)</label><input type="number" class="form-input" id="s-annual" value="${s.annualLeave}"></div>
          <div class="form-group"><label class="form-label">Sick Leave (days)</label><input type="number" class="form-input" id="s-sick" value="${s.sickLeave}"></div>
          <div class="form-group"><label class="form-label">Casual Leave (days)</label><input type="number" class="form-input" id="s-casual" value="${s.casualLeave}"></div>
          <div class="form-group"><label class="form-label">Carry Forward</label><select class="form-input" id="s-carry"><option>Yes (max 10)</option><option>No</option></select></div>
          <div class="form-group span-2"><button class="btn btn-primary" onclick="saveLeavePolicy()">Update Policy</button></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">ACCOUNT & SECURITY</div></div>
        <div class="form-group"><label class="form-label">Current Password</label><input type="password" class="form-input" placeholder="Enter current password"></div>
        <div class="form-group"><label class="form-label">New Password</label><input type="password" class="form-input" id="s-newpwd" placeholder="New password"></div>
        <div class="form-group"><label class="form-label">Confirm Password</label><input type="password" class="form-input" id="s-confpwd" placeholder="Confirm new password"></div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" onclick="changePassword()">Update Password</button>
          <button class="btn btn-danger" onclick="if(confirm('Reset all HR data to defaults?'))DB.resetAll();UI.toast('Data reset!','error')">Reset Data</button>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">SYSTEM INFO</div></div>
        <div id="sys-info"></div>
      </div>
    </div>
  </div>`;

function saveCompany(){
  const g=id=>document.getElementById(id).value;
  const cfg=DB.getSettings();
  DB.saveSettings({...cfg,companyName:g('s-name'),email:g('s-email'),phone:g('s-phone'),website:g('s-web'),address:g('s-addr'),currency:g('s-cur')});
  Auth.logActivity('Company settings updated');UI.toast('Company info saved!');
}
function saveHours(){
  const g=id=>document.getElementById(id).value;
  const cfg=DB.getSettings();
  DB.saveSettings({...cfg,workStart:g('s-start'),workEnd:g('s-end'),workDays:g('s-wdays'),lateGrace:+g('s-grace')});
  Auth.logActivity('Working hours updated');UI.toast('Working hours saved!');
}
function saveLeavePolicy(){
  const g=id=>document.getElementById(id).value;
  const cfg=DB.getSettings();
  DB.saveSettings({...cfg,annualLeave:+g('s-annual'),sickLeave:+g('s-sick'),casualLeave:+g('s-casual')});
  Auth.logActivity('Leave policy updated');UI.toast('Leave policy saved!');
}
function changePassword(){
  const np=document.getElementById('s-newpwd').value;
  const cp=document.getElementById('s-confpwd').value;
  if(!np||np!==cp){UI.toast('Passwords do not match','error');return;}
  UI.toast('Password updated! (Demo: changes not persisted)');
  document.getElementById('s-newpwd').value='';document.getElementById('s-confpwd').value='';
}

// System info
const session=Auth.getSession();
const empCount=DB.getAll('employees').length;
const logCount=Auth.getActivityLog().length;
document.getElementById('sys-info').innerHTML=[
  ['Logged in as',session.name+' ('+session.role+')'],
  ['Session expires',new Date(session.expires).toLocaleString()],
  ['Total employees',empCount],
  ['Activity logs',logCount+' entries'],
  ['Storage used',Math.round(JSON.stringify(localStorage).length/1024)+' KB'],
  ['Portal version','1.0.0 · ByteStack HR'],
].map(([l,v])=>`<div class="info-row"><div class="info-label">${l}</div><div style="font-family:var(--M);font-size:11px">${v}</div></div>`).join('');

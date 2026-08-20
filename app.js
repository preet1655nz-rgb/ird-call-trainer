(function() {
  'use strict';

  var MENTOR_LESSONS = [
    {title:'Power Pause', body:'When you feel an um coming, close your mouth 1-2 seconds. Silence feels longer to you than the customer. They hear confidence.'},
    {title:'Empathy First', body:'Acknowledge the feeling before the solution. "I understand this can feel overwhelming" lowers resistance.'},
    {title:'Call Structure', body:'Purpose → Information → Options → Next Step + Deadline. Master this until automatic.'},
    {title:'What-So What-Now What', body:'Matt Abrahams frame for pressure: What (fact), So What (why it matters), Now What (action).'},
    {title:'LATTE', body:'Listen → Acknowledge → Take action → Thank → Explain. Turns defensive customers cooperative.'},
    {title:'Firm Close', body:'Never leave a debt call without clear next step and date. Summarise, confirm, thank.'}
  ];

  var MODEL_SCRIPTS = {
    accountant: 'OPENING\n"Good afternoon, this is [Name] from Inland Revenue. I\'m calling about your client regarding outstanding returns. Do you have a moment?"\n\nPURPOSE\n"We\'ve been unable to reach the customer. Returns appear outstanding. Do you have updated contact details?"\n\nNEXT STEP\n"If you can review and get back by Friday that would help."',
    d1: 'OPENING\n"Good afternoon, this is [Name] from Inland Revenue. I\'m calling about an overdue income tax bill of approximately $15,000. Do you have a few minutes?"\n\nPURPOSE\n"Late payment interest has started. Payable within 10 working days."\n\nEMPATHY + OPTIONS\n"I know this can feel stressful. We have options including an instalment arrangement."\n\nCLOSE\n"I\'ll send a summary to myIR. Thank you."',
    d2: 'CUSTOMER: "I can\'t pay this."\n\nYOU (LATTE)\nListen: "I hear you – the full amount isn\'t possible right now."\nAcknowledge: "I understand this can feel overwhelming."\nTake action: "Let\'s look at what is realistic."\nThank: "I appreciate you being upfront."\nExplain: "We can set up an instalment. What amount per week feels manageable?"',
    d3: '"Let\'s get the instalment set up.\n• Total under arrangement\n• Regular payment amount\n• Frequency\n• First payment date\n\nI\'ll send confirmation to myIR."',
    d4: '"I understand you\'re in a difficult position. IRD has a serious hardship process.\nWe usually need recent income/expense info and returns filed.\nWould you like me to explain the information needed?"',
    d7: '"I understand the interest feels high.\nLate payment interest is charged when tax isn\'t paid by the due date.\nOnce an instalment is in place the debt is under control."',
    d8: '"To summarise today:\n• Outstanding amount is $X\n• We agreed [instalment / payment by date]\n• First payment due [date]\nI\'ll send confirmation to myIR. Thank you."',
    residency: '"I\'m calling about your tax residency.\nI need: date you left NZ, current country, any NZ-sourced income.\nOnce confirmed I can update residency."'
  };

  var SCENARIOS = {
    accountant: {title:'Accountant Follow-up', prompt:'Call accountant about client who moved overseas. Collect departure date, country, NZ income. Set deadline.'},
    return: {title:'Return Status', prompt:'Explain processed vs final allocation calmly.'},
    residency: {title:'Tax Residency', prompt:'Determine filing requirement and update residency.'},
    free: {title:'Free Practice', prompt:'Speak 60-90s on any IRD topic. Zero fillers.'}
  };

  var DEBT = [
    {id:'d1', title:'First Contact – Overdue Bill', prompt:'$15k overdue. Explain, offer instalment.'},
    {id:'d2', title:"Can't Pay", prompt:'Explore reasons, move to instalment/hardship.'},
    {id:'d3', title:'Instalment Setup', prompt:'Confirm amount, frequency, start date.'},
    {id:'d4', title:'Hardship', prompt:'Explain process and required info.'},
    {id:'d7', title:'Explaining Interest', prompt:'Calm explanation + arrangement offer.'},
    {id:'d8', title:'Closing Difficult Call', prompt:'Summarise, confirm, thank.'}
  ];

  var DRILLS = [
    {id:'filler', icon:'🎯', title:'Filler Killer', desc:'45s zero fillers', color:'bg-orange-500'},
    {id:'pause', icon:'⏸️', title:'Power Pause', desc:'Deliberate silence', color:'bg-teal-600'},
    {id:'jam', icon:'🔄', title:'Just a Minute', desc:'60s continuous', color:'bg-slate-800'},
    {id:'empathy', icon:'💙', title:'Empathy Bank', desc:'Warm language', color:'bg-pink-500'},
    {id:'shadow', icon:'📜', title:'Script Shadow', desc:'Copy model', color:'bg-slate-700'},
    {id:'visual', icon:'🧘', title:'Visualisation', desc:'Mental rehearsal', color:'bg-indigo-600'}
  ];

  var DAILY = [
    'Record 60s explaining returns before instalment. Zero fillers.',
    'Power Pause: "The amount has been overdue. [PAUSE] We have options."',
    'Empathy formula for $12k GST bill.',
    'Just-a-Minute on late payment interest.',
    'Shadow a clean debt opening.',
    'Visualise successful debt call 3 min.',
    'Gather hardship info under 90s, stay warm.'
  ];

  var EXAM_QS = [
    {q:'Main purpose of Power Pause?', options:['Fill silence with um','Give thinking time and sound confident','Rush customer','Avoid questions'], correct:1, explain:'Silence replaces fillers and is heard as confidence.'},
    {q:'Recommended call structure?', options:['Chat→Sell→Close','Purpose→Info→Options→Next Step','Apologise→Hang up','Questions only'], correct:1, explain:'Clear structure keeps control.'},
    {q:'Best first response to "I can\'t pay"?', options:['You must pay','I understand this can feel overwhelming. Let\'s look at options.','Why didn\'t you pay?','Ignore interest'], correct:1, explain:'Empathy first lowers resistance.'},
    {q:'Strong empathy phrase?', options:['Not my problem','I know situations like this can feel stressful','You should have planned','Everyone has same issue'], correct:1, explain:'Acknowledging feeling builds trust.'},
    {q:'Why avoid fillers?', options:['Sound friendly','Reduce clarity and confidence','Customers like them','IRD requires'], correct:1, explain:'Fillers signal uncertainty.'},
    {q:'Angry about interest – first step?', options:['Argue','Raise voice','Stay calm, acknowledge, explain','Hang up'], correct:2, explain:'Calm + acknowledge + explain.'},
    {q:'Matt Abrahams key recommendation?', options:['Memorise every word','Use structure and Power Pauses','Speak fast','Avoid silence'], correct:1, explain:'Structure + pauses = clarity under pressure.'},
    {q:'Before offering instalment usually need?', options:['Customer angry','Returns filed or being filed','Debt under $100','Legal threat'], correct:1, explain:'IRD generally requires returns current.'},
    {q:'Best way to end difficult call?', options:['Hang up','Summarise next steps, confirm deadline, thank','Blame customer','Promise cancel'], correct:1, explain:'Clear close is professional.'},
    {q:'Goal of Just a Minute?', options:['60s continuous no fillers','Talk as fast as possible','Long words only','Argue'], correct:0, explain:'Builds fluency.'}
  ];

  var EMPATHY_MATCH = [
    {statement:'This bill is huge.', correct:'I understand this amount can feel overwhelming. Let\'s look at options.'},
    {statement:'I\'ve paid everything I can.', correct:'I appreciate you letting me know. Can we look at a realistic plan?'},
    {statement:'Why so much interest?', correct:'I know the interest can be frustrating. Let me explain and what we can do.'},
    {statement:'You\'re just taking my money.', correct:'I understand it can feel that way. My role is to find a fair way forward.'}
  ];

  var OBJECTION_QS = [
    {q:'"I can\'t pay the full amount."', options:['We take action.','I understand. Discuss instalment?','Pay today or else.','Not acceptable.'], correct:1},
    {q:'"Interest is unfair."', options:['It\'s the law.','I know it feels high. Arrangement stops it growing as fast.','Cancel all interest.','Pay earlier.'], correct:1},
    {q:'"I spoke to someone last week."', options:['Don\'t care.','Thank you. Let me check notes and continue.','Why still owing?','Call them.'], correct:1},
    {q:'"I\'ll complain."', options:['Go ahead.','Sorry you feel that way. I\'m here to help. What should we focus on?','Your problem.','Hang up.'], correct:1}
  ];

  var STRUCTURE_STEPS = ['Purpose of the call','Key information / situation','Options available','Next steps & deadline'];
  var FILLERS = ['uh','um','okay','ok','like','you know','sort of','kind of','basically','actually'];

  var state = {score:0, streak:0, bestStreak:0, lastDate:null, total:0, sessions:[], skills:{clarity:50, confidence:50, structure:50, empathy:50}, dailyDone:null};
  var recognition = null, listening = false, transcript = '', timerId = null, secs = 0, lastAnalysis = null, radarChart = null;
  var examIdx = 0, examScore = 0, examAnswered = false;

  function $(id) { return document.getElementById(id); }

  function toast(m) {
    var t = $('toast');
    t.textContent = m;
    t.style.opacity = '1';
    setTimeout(function() { t.style.opacity = '0'; }, 2800);
  }

  function load() {
    try {
      var s = localStorage.getItem('ird_trainer_pwa_v1');
      if (s) Object.assign(state, JSON.parse(s));
    } catch (e) {}
    updateUI();
    updateMentor();
  }

  function save() {
    try { localStorage.setItem('ird_trainer_pwa_v1', JSON.stringify(state)); } catch (e) {}
    updateUI();
    updateMentor();
  }

  function updateUI() {
    $('navStreak').textContent = state.streak;
    $('navScore').textContent = Math.round(state.score);
    $('dashScore').textContent = Math.round(state.score);
    $('dashStreak').textContent = state.streak;
    $('dashPractices').textContent = state.total;
    $('dashLevel').textContent = Math.floor(state.total / 5) + 1;
    var list = $('recentList');
    if (!state.sessions.length) list.innerHTML = 'No sessions yet.';
    else list.innerHTML = state.sessions.slice(0, 5).map(function(s) {
      return '<div class="flex justify-between py-1 border-b"><span class="text-sm">' + s.scenario + '</span><span class="font-bold">' + s.score + '</span></div>';
    }).join('');
    try { updateCharts(); } catch (e) {}
  }

  function updateMentor() {
    var c = $('mentorReviewContent');
    if (!c) return;
    var s = state.skills;
    var w = 'clarity';
    if (s.confidence < s[w]) w = 'confidence';
    if (s.structure < s[w]) w = 'structure';
    if (s.empathy < s[w]) w = 'empathy';
    if (state.total === 0) c.innerHTML = '<p>Welcome. Start with a Debt scenario or Empathy Match so I can review your work.</p>';
    else c.innerHTML = '<p>You have completed <strong>' + state.total + '</strong> practices. Average score <strong>' + Math.round(state.score) + '</strong>.</p><p>Weakest signal: <strong>' + w + '</strong>.</p>';
    var lesson = MENTOR_LESSONS[state.total % MENTOR_LESSONS.length];
    $('mentorLesson').innerHTML = '<div class="font-medium mb-1">' + lesson.title + '</div><p>' + lesson.body + '</p>';
    var sug = '';
    if (state.total < 3) sug = 'Go to Debt → First Contact and practise the opening using the model script.';
    else if (s.empathy < 60) sug = 'Play Empathy Match twice, then try the Can\'t Pay scenario.';
    else if (s.structure < 60) sug = 'Master Structure Sorter, then do a full debt call.';
    else if (state.score < 70) sug = 'Take the Exam, then do one clean Script Shadow.';
    else sug = 'Stretch with Hardship. Keep Power Pauses clean.';
    $('mentorSuggest').innerHTML = '<div class="bg-teal-50 text-teal-800 rounded-xl p-3">' + sug + '</div>';
  }

  function switchTab(n) {
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('tab-active'); });
    var v = $(n);
    if (v) v.classList.add('active');
    var b = document.querySelector('.tab-btn[data-tab="' + n + '"]');
    if (b) b.classList.add('tab-active');
    if (n === 'practice') updatePrompt();
    if (n === 'mentor') updateMentor();
    if (n === 'scripts') showScript();
  }

  function showScript() {
    var k = $('scriptSelect').value;
    $('scriptBox').textContent = MODEL_SCRIPTS[k] || 'Coming soon.';
  }

  function initSpeech() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { $('micStatus').textContent = 'Needs Safari/Chrome'; return; }
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-NZ';
    recognition.onresult = function(e) {
      var i = '', f = '';
      for (var x = e.resultIndex; x < e.results.length; x++) {
        var t = e.results[x][0].transcript;
        if (e.results[x].isFinal) f += t + ' ';
        else i += t;
      }
      if (f) transcript += f;
      $('transcript').textContent = (transcript + i).trim() || 'Listening…';
    };
    recognition.onend = function() { if (listening) try { recognition.start(); } catch (e) {} };
    recognition.onerror = function(e) { if (e.error === 'not-allowed') toast('Allow microphone'); };
  }

  function startListen() {
    if (!recognition) initSpeech();
    if (!recognition) { toast('Speech unavailable'); return; }
    transcript = '';
    $('transcript').textContent = 'Listening…';
    $('feedback').classList.add('hidden');
    listening = true;
    secs = 0;
    $('timer').textContent = '00:00';
    timerId = setInterval(function() {
      secs++;
      $('timer').textContent = String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0');
    }, 1000);
    $('micBtn').classList.add('listening');
    $('micStatus').textContent = 'Listening… tap to stop';
    try { recognition.start(); } catch (e) { toast('Mic error'); stopListen(); }
  }

  function stopListen() {
    listening = false;
    clearInterval(timerId);
    try { recognition.stop(); } catch (e) {}
    $('micBtn').classList.remove('listening');
    $('micStatus').textContent = 'Tap to speak';
    if (transcript.trim().length > 8) analyse(transcript.trim());
    else toast('Too short');
  }

  function toggleMic() {
    if (listening) stopListen();
    else startListen();
  }

  function analyse(text) {
    var lower = text.toLowerCase();
    var words = lower.split(/\s+/).filter(Boolean);
    var wc = words.length;
    var fc = 0, found = [];
    FILLERS.forEach(function(f) {
      var m = lower.match(new RegExp('\\b' + f + '\\b', 'gi'));
      if (m) { fc += m.length; found.push(f + '×' + m.length); }
    });
    var corr = (lower.match(/\b(sorry|i mean|wait|actually)\b/g) || []).length;
    var clarity = Math.max(20, Math.min(100, Math.round(100 - (fc / Math.max(wc, 1) * 100) * 8 - corr * 5)));
    var conf = Math.max(15, Math.min(100, Math.round(100 - fc * 6 - corr * 4 + (wc > 40 && wc < 180 ? 5 : 0))));
    var struct = 55;
    if (/confirm|regarding|calling about|purpose/.test(lower)) struct += 12;
    if (/thank you|next step|deadline/.test(lower)) struct += 10;
    if (wc < 25) struct -= 15;
    struct = Math.max(20, Math.min(100, struct));
    var emp = 40;
    if (/understand|overwhelming|appreciate|help|options/.test(lower)) emp += 30;
    emp = Math.max(20, Math.min(100, emp));
    var overall = Math.round(clarity * 0.3 + conf * 0.35 + struct * 0.2 + emp * 0.15);
    var sug = [];
    if (fc >= 3) sug.push('Used ' + fc + ' fillers. Use Power Pause.');
    if (emp < 55 && /overdue|bill|debt|interest/.test(lower)) sug.push('Add empathy first.');
    if (struct < 60) sug.push('Use Purpose→Info→Options→Next Step.');
    if (overall >= 80) sug.push('Strong delivery.');
    if (!sug.length) sug.push('Solid. Keep pauses clean.');
    $('scClarity').textContent = clarity;
    $('scConf').textContent = conf;
    $('scStruct').textContent = struct;
    $('scOverall').textContent = overall;
    $('fillerList').textContent = found.length ? found.join(', ') : 'None – excellent!';
    $('suggestions').innerHTML = sug.map(function(s) { return '<li>→ ' + s + '</li>'; }).join('');
    $('feedback').classList.remove('hidden');
    lastAnalysis = {clarity: clarity, confidence: conf, structure: struct, empathy: emp, overall: overall, fillerCount: fc};
  }

  function saveSession() {
    if (!lastAnalysis) return;
    var a = lastAnalysis;
    var sel = $('scenarioSelect');
    var sc = sel.options[sel.selectedIndex].text;
    state.sessions.unshift({scenario: sc, date: new Date().toLocaleString('en-NZ', {dateStyle: 'medium', timeStyle: 'short'}), score: a.overall, fillers: a.fillerCount});
    if (state.sessions.length > 20) state.sessions.pop();
    state.score = state.score === 0 ? a.overall : Math.round(state.score * 0.7 + a.overall * 0.3);
    state.skills.clarity = Math.round(state.skills.clarity * 0.7 + a.clarity * 0.3);
    state.skills.confidence = Math.round(state.skills.confidence * 0.7 + a.confidence * 0.3);
    state.skills.structure = Math.round(state.skills.structure * 0.7 + a.structure * 0.3);
    state.skills.empathy = Math.round(state.skills.empathy * 0.7 + a.empathy * 0.3);
    state.total++;
    var today = new Date().toDateString();
    if (state.lastDate !== today) {
      var y = new Date(); y.setDate(y.getDate() - 1);
      state.streak = (state.lastDate === y.toDateString()) ? state.streak + 1 : 1;
      state.lastDate = today;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    }
    save();
    toast('Saved! Score ' + a.overall);
    $('feedback').classList.add('hidden');
    lastAnalysis = null;
  }

  function updatePrompt() {
    var s = SCENARIOS[$('scenarioSelect').value];
    $('promptBox').innerHTML = '<div class="font-medium mb-1">' + s.title + '</div><div class="text-slate-600">' + s.prompt + '</div>';
  }

  function renderDebt() {
    $('debtList').innerHTML = DEBT.map(function(d) {
      return '<button type="button" class="debt-btn text-left p-3 rounded-xl border w-full" data-id="' + d.id + '"><div class="font-medium text-sm">' + d.title + '</div><div class="text-[11px] text-slate-500">' + d.prompt.slice(0, 70) + '…</div></button>';
    }).join('');
  }

  function openDebt(id) {
    var d = DEBT.find(function(x) { return x.id === id; });
    if (!d) return;
    $('debtTitle').textContent = d.title;
    $('debtPrompt').textContent = d.prompt;
    $('debtActive').classList.remove('hidden');
  }

  function renderDrills() {
    $('drillCards').innerHTML = DRILLS.map(function(d) {
      return '<div class="bg-white rounded-2xl p-3 border"><div class="text-lg">' + d.icon + '</div><div class="font-semibold text-sm">' + d.title + '</div><div class="text-[11px] text-slate-500 mb-2">' + d.desc + '</div><button type="button" class="drill-btn w-full py-2 ' + d.color + ' text-white rounded-xl text-xs" data-id="' + d.id + '">Start</button></div>';
    }).join('');
  }

  function startDrill(id) {
    $('drillArea').classList.remove('hidden');
    var t = $('drillTitle'), c = $('drillContent');
    if (id === 'filler') {
      t.textContent = '🎯 Filler Killer';
      c.innerHTML = '<p class="text-sm mb-3">Speak 45s about instalment. Zero fillers.</p><button type="button" class="timed-btn w-full py-2.5 bg-orange-500 text-white rounded-xl text-sm" data-secs="45">Start 45s</button>';
    } else if (id === 'pause') {
      t.textContent = '⏸️ Power Pause';
      c.innerHTML = '<p class="text-sm mb-2">Wait 2 full seconds at [PAUSE].</p><div class="bg-slate-50 rounded-xl p-3 text-sm">"The amount has been overdue. <strong class="text-teal-600">[PAUSE]</strong> We have options."</div>';
    } else if (id === 'jam') {
      t.textContent = '🔄 Just a Minute';
      c.innerHTML = '<p class="text-sm mb-3">60s on why late payment interest exists.</p><button type="button" class="timed-btn w-full py-2.5 bg-slate-800 text-white rounded-xl text-sm" data-secs="60">Start</button>';
    } else if (id === 'empathy') {
      t.textContent = '💙 Empathy Bank';
      c.innerHTML = '<div class="space-y-2 text-sm"><div class="bg-pink-50 rounded-xl p-3">"I know this can feel overwhelming. The next step is…"</div><div class="bg-pink-50 rounded-xl p-3">"I understand these amounts create stress. Let\'s look at options."</div></div>';
    } else if (id === 'shadow') {
      t.textContent = '📜 Script Shadow';
      c.innerHTML = '<div class="bg-slate-50 rounded-xl p-3 text-sm mb-3">"Good afternoon, this is Gary from Inland Revenue. I\'m calling about an overdue income tax bill of $15,000. Late payment interest has applied. Payable within 10 working days. Would you like to discuss an instalment arrangement?"</div><button type="button" id="shadowBtn" class="w-full py-2.5 bg-slate-700 text-white rounded-xl text-sm">Record Your Version</button>';
    } else if (id === 'visual') {
      t.textContent = '🧘 Visualisation';
      c.innerHTML = '<p class="text-sm">Close eyes 3 min. Imagine successful debt call: calm voice, clear structure, customer agrees.</p>';
    }
  }

  function setDaily() {
    var d = new Date().getDay();
    $('dailyDate').textContent = new Date().toLocaleDateString('en-NZ', {weekday: 'long', day: 'numeric', month: 'long'});
    $('dailyBox').textContent = DAILY[d % DAILY.length];
  }

  function completeDaily() {
    var today = new Date().toDateString();
    if (state.dailyDone === today) { toast('Already done'); return; }
    state.dailyDone = today;
    if (state.lastDate !== today) {
      var y = new Date(); y.setDate(y.getDate() - 1);
      state.streak = (state.lastDate === y.toDateString()) ? state.streak + 1 : 1;
      state.lastDate = today;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    }
    state.total++;
    save();
    toast('Done! Streak ' + state.streak);
  }

  function startExam() {
    examIdx = 0; examScore = 0; examAnswered = false;
    $('startExamBtn').parentElement.classList.add('hidden');
    $('examResult').classList.add('hidden');
    $('examArea').classList.remove('hidden');
    showExamQ();
  }

  function showExamQ() {
    examAnswered = false;
    var q = EXAM_QS[examIdx];
    $('examProgress').textContent = (examIdx + 1) + '/10';
    $('examScoreLive').textContent = 'Score: ' + examScore;
    $('examQ').textContent = q.q;
    $('examOptions').innerHTML = q.options.map(function(o, i) {
      return '<button type="button" class="option-btn w-full text-left p-3 rounded-xl border text-sm" data-idx="' + i + '">' + o + '</button>';
    }).join('');
    $('examFeedback').classList.add('hidden');
    $('examNext').classList.add('hidden');
  }

  function answerExam(idx) {
    if (examAnswered) return;
    examAnswered = true;
    var q = EXAM_QS[examIdx];
    var btns = $('examOptions').querySelectorAll('.option-btn');
    btns.forEach(function(b, i) {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
      else if (i === idx) b.classList.add('wrong');
    });
    if (idx === q.correct) {
      examScore++;
      $('examFeedback').innerHTML = '<span class="text-teal-600 font-medium">Correct.</span> ' + q.explain;
    } else {
      $('examFeedback').innerHTML = '<span class="text-red-600 font-medium">Not quite.</span> ' + q.explain;
    }
    $('examFeedback').classList.remove('hidden');
    $('examScoreLive').textContent = 'Score: ' + examScore;
    $('examNext').classList.remove('hidden');
    $('examNext').textContent = examIdx === 9 ? 'See Results' : 'Next';
  }

  function nextExam() {
    if (examIdx < 9) { examIdx++; showExamQ(); }
    else finishExam();
  }

  function finishExam() {
    $('examArea').classList.add('hidden');
    $('examResult').classList.remove('hidden');
    var pct = Math.round(examScore / 10 * 100);
    if (pct >= 70) {
      $('examResultIcon').textContent = '🎉';
      $('examResultText').textContent = 'Passed! ' + pct + '%';
      $('examResultDetail').textContent = examScore + '/10';
      state.total++;
      state.score = Math.round(state.score * 0.7 + pct * 0.3);
      save();
    } else {
      $('examResultIcon').textContent = '📚';
      $('examResultText').textContent = 'Score: ' + pct + '%';
      $('examResultDetail').textContent = examScore + '/10. Pass mark 70%.';
    }
  }

  function startGame(type) {
    $('gameArea').classList.remove('hidden');
    var title = $('gameTitle'), content = $('gameContent');
    if (type === 'empathy') {
      title.textContent = '💙 Empathy Match';
      var idx = 0;
      function show() {
        if (idx >= EMPATHY_MATCH.length) {
          content.innerHTML = '<div class="text-center py-4"><div class="text-2xl">✅</div><div class="font-medium">Great work!</div></div>';
          return;
        }
        var item = EMPATHY_MATCH[idx];
        content.innerHTML = '<div class="text-sm mb-3 bg-slate-50 rounded-xl p-3"><strong>Customer:</strong> "' + item.statement + '"</div><div class="space-y-2" id="matchOpts"></div>';
        var opts = [item.correct, 'Just pay or we escalate.', 'Not my concern.', 'You should have budgeted.'].sort(function() { return Math.random() - 0.5; });
        $('matchOpts').innerHTML = opts.map(function(o) {
          return '<button type="button" class="match-opt w-full text-left p-3 rounded-xl border text-sm">' + o + '</button>';
        }).join('');
        $('matchOpts').querySelectorAll('.match-opt').forEach(function(btn) {
          btn.addEventListener('click', function() {
            if (btn.textContent === item.correct) {
              btn.classList.add('correct');
              toast('Correct!');
              setTimeout(function() { idx++; show(); }, 700);
            } else {
              btn.classList.add('wrong');
              toast('Warmer response needed');
            }
          });
        });
      }
      show();
    } else if (type === 'objection') {
      title.textContent = '⚡ Objection Rapid Fire';
      var idx = 0, corr = 0;
      function show() {
        if (idx >= OBJECTION_QS.length) {
          content.innerHTML = '<div class="text-center py-4"><div class="text-2xl">' + (corr === 4 ? '🏆' : '👍') + '</div><div class="font-medium">' + corr + '/4</div></div>';
          return;
        }
        var item = OBJECTION_QS[idx];
        content.innerHTML = '<div class="text-sm mb-3 bg-slate-50 rounded-xl p-3">' + item.q + '</div><div class="space-y-2" id="objOpts"></div>';
        $('objOpts').innerHTML = item.options.map(function(o, i) {
          return '<button type="button" class="obj-opt w-full text-left p-3 rounded-xl border text-sm" data-i="' + i + '">' + o + '</button>';
        }).join('');
        $('objOpts').querySelectorAll('.obj-opt').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var i = +btn.getAttribute('data-i');
            if (i === item.correct) { btn.classList.add('correct'); corr++; toast('Strong!'); }
            else { btn.classList.add('wrong'); toast('Better option'); }
            setTimeout(function() { idx++; show(); }, 800);
          });
        });
      }
      show();
    } else if (type === 'structure') {
      title.textContent = '🧩 Structure Sorter';
      var order = STRUCTURE_STEPS.slice().sort(function() { return Math.random() - 0.5; });
      var selected = [];
      content.innerHTML = '<p class="text-sm mb-3">Tap in correct order:</p><div id="structOpts" class="space-y-2"></div><div id="structSelected" class="mt-3 text-sm text-slate-500"></div>';
      function render() {
        $('structOpts').innerHTML = order.filter(function(s) { return selected.indexOf(s) === -1; }).map(function(s) {
          return '<button type="button" class="struct-btn w-full text-left p-3 rounded-xl border text-sm">' + s + '</button>';
        }).join('');
        $('structSelected').innerHTML = selected.length ? selected.map(function(s, i) { return (i + 1) + '. ' + s; }).join('<br>') : 'Order appears here';
        $('structOpts').querySelectorAll('.struct-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            selected.push(btn.textContent);
            if (selected.length === 4) {
              if (selected.join() === STRUCTURE_STEPS.join()) {
                toast('Perfect!');
                content.innerHTML = '<div class="text-center py-4"><div class="text-2xl">✅</div><div class="font-medium">Correct!</div></div>';
              } else {
                toast('Try again');
                selected = [];
                order = STRUCTURE_STEPS.slice().sort(function() { return Math.random() - 0.5; });
                render();
              }
            } else render();
          });
        });
      }
      render();
    }
  }

  function initCharts() {
    try {
      if (typeof Chart === 'undefined') return;
      var canvas = $('radarChart');
      if (!canvas) return;
      radarChart = new Chart(canvas.getContext('2d'), {
        type: 'radar',
        data: {
          labels: ['Clarity', 'Confidence', 'Structure', 'Empathy'],
          datasets: [{ data: [50, 50, 50, 50], backgroundColor: 'rgba(15,118,110,0.2)', borderColor: '#0f766e' }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { r: { min: 0, max: 100, ticks: { display: false } } }
        }
      });
    } catch (e) {}
  }

  function updateCharts() {
    if (!radarChart) return;
    radarChart.data.datasets[0].data = [state.skills.clarity, state.skills.confidence, state.skills.structure, state.skills.empathy];
    radarChart.update();
  }

  function init() {
    load();
    initSpeech();
    initCharts();
    renderDebt();
    renderDrills();
    setDaily();
    updatePrompt();
    showScript();

    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        switchTab(this.getAttribute('data-tab'));
      });
    });

    $('scenarioSelect').addEventListener('change', updatePrompt);
    $('scriptSelect').addEventListener('change', showScript);
    $('micBtn').addEventListener('click', toggleMic);
    $('saveBtn').addEventListener('click', saveSession);

    $('debtList').addEventListener('click', function(e) {
      var b = e.target.closest('.debt-btn');
      if (b) openDebt(b.getAttribute('data-id'));
    });
    $('debtClose').addEventListener('click', function() { $('debtActive').classList.add('hidden'); });
    $('debtStart').addEventListener('click', function() {
      switchTab('practice');
      $('scenarioSelect').value = 'free';
      $('promptBox').innerHTML = '<div class="font-medium">' + $('debtTitle').textContent + '</div><div class="text-slate-600">' + $('debtPrompt').textContent + '</div>';
      startListen();
    });

    $('drillCards').addEventListener('click', function(e) {
      var b = e.target.closest('.drill-btn');
      if (b) startDrill(b.getAttribute('data-id'));
    });
    $('drillClose').addEventListener('click', function() { $('drillArea').classList.add('hidden'); });

    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('timed-btn')) {
        var s = parseInt(e.target.getAttribute('data-secs'), 10);
        toast('Speak ' + s + 's');
        startListen();
        setTimeout(function() { if (listening) stopListen(); }, s * 1000);
      }
      if (e.target.id === 'shadowBtn') toggleMic();
    });

    $('dailyBtn').addEventListener('click', completeDaily);
    $('startExamBtn').addEventListener('click', startExam);
    $('examNext').addEventListener('click', nextExam);
    $('examRetry').addEventListener('click', function() {
      $('examResult').classList.add('hidden');
      $('startExamBtn').parentElement.classList.remove('hidden');
    });
    $('examOptions').addEventListener('click', function(e) {
      var b = e.target.closest('.option-btn');
      if (b) answerExam(+b.getAttribute('data-idx'));
    });

    document.querySelectorAll('.game-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        startGame(this.getAttribute('data-game'));
      });
    });
    $('gameClose').addEventListener('click', function() { $('gameArea').classList.add('hidden'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

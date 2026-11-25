/* ============================================================
   app.js — Palestinian Graduate Research Hub
   Copyright © 2026 — Mostafa Nidal Shafie
   ============================================================ */
'use strict';

/* ---------- 1) STATE ---------- */
const AppState = {
  tab: 'studio', lang: 'ar', dark: false, previewMode: 'cover-ar',
  kitView: 'cert', slideIdx: 0, slides: [], studies: [], thesis: {},
  gpaCourses: [], teamTasks: [], statRows: [], certMode: 'official'
};
const LS_KEY = 'pgh:state:v2';

/* ---------- 2) UTILS ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const saveState = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(AppState)); } catch (e) {} };
const loadState = () => { try { const raw = localStorage.getItem(LS_KEY); if (raw) Object.assign(AppState, JSON.parse(raw)); } catch (e) {} };
const toast = (msg, ms = 2500) => { const t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(t._to); t._to = setTimeout(() => t.classList.remove('show'), ms); };

/* ---------- 3) DATA: UNIVERSITIES ---------- */
const UNIVERSITIES = [
  { id: 'iug', ar: 'الجامعة الإسلامية بغزة', en: 'Islamic University of Gaza', region: 'gaza', badge: 'IUG', color: '#0f4c3a' },
  { id: 'azhar', ar: 'جامعة الأزهر بغزة', en: 'Al-Azhar University - Gaza', region: 'gaza', badge: 'AUG', color: '#1e40af' },
  { id: 'aqsa', ar: 'جامعة الأقصى', en: 'Al-Aqsa University', region: 'gaza', badge: 'AQU', color: '#7c2d12' },
  { id: 'palestine', ar: 'جامعة فلسطين', en: 'Palestine University', region: 'gaza', badge: 'PU', color: '#166534' },
  { id: 'gaza', ar: 'جامعة غزة', en: 'University of Gaza', region: 'gaza', badge: 'UG', color: '#065f46' },
  { id: 'quds', ar: 'جامعة القدس', en: 'Al-Quds University', region: 'westbank', badge: 'QU', color: '#0e7490' },
  { id: 'birzeit', ar: 'جامعة بيرزيت', en: 'Birzeit University', region: 'westbank', badge: 'BZU', color: '#7e22ce' },
  { id: 'najah', ar: 'جامعة النجاح الوطنية', en: 'An-Najah National University', region: 'westbank', badge: 'NNU', color: '#15803d' },
  { id: 'hebron', ar: 'جامعة الخليل', en: 'Hebron University', region: 'westbank', badge: 'HU', color: '#b45309' },
  { id: 'bethlehem', ar: 'جامعة بيت لحم', en: 'Bethlehem University', region: 'westbank', badge: 'BU', color: '#be123c' },
  { id: 'ppu', ar: 'جامعة بوليتكنك فلسطين', en: 'Palestine Polytechnic University', region: 'westbank', badge: 'PPU', color: '#1d4ed8' },
  { id: 'istiqlal', ar: 'جامعة الاستقلال', en: 'Al-Istiqlal University', region: 'westbank', badge: 'IU', color: '#991b1b' },
  { id: 'aaup', ar: 'الجامعة العربية الأمريكية', en: 'Arab American University', region: 'westbank', badge: 'AAUP', color: '#1e3a8a' },
  { id: 'daralkalima', ar: 'جامعة دار الكلمة', en: 'Dar al-Kalima University', region: 'westbank', badge: 'DU', color: '#0c4a6e' },
  { id: 'qou', ar: 'جامعة القدس المفتوحة', en: 'Al-Quds Open University', region: 'open', badge: 'QOU', color: '#0f4c3a' }
];

/* ---------- 4) DATA: FACULTIES ---------- */
const FACULTIES = [
  { id: 'eng', ar: 'كلية الهندسة', en: 'Faculty of Engineering', majors: ['هندسة الحاسوب','الهندسة المدنية','الهندسة الكهربائية','الهندسة المعمارية','هندسة الاتصالات'] },
  { id: 'it', ar: 'كلية تكنولوجيا المعلومات', en: 'Faculty of IT', majors: ['علوم الحاسوب','هندسة البرمجيات','الذكاء الاصطناعي','أمن المعلومات','علم البيانات'] },
  { id: 'bus', ar: 'كلية إدارة الأعمال والاقتصاد', en: 'Faculty of Business & Economics', majors: ['إدارة الأعمال','المحاسبة','التمويل والمصارف','التسويق','الاقتصاد'] },
  { id: 'edu', ar: 'كلية التربية', en: 'Faculty of Education', majors: ['أصول التربية','المناهج وطرق التدريس','علم النفس التربوي','الإدارة التربوية','الطفولة المبكرة'] },
  { id: 'arts', ar: 'كلية الآداب والعلوم الإنسانية', en: 'Faculty of Arts & Humanities', majors: ['اللغة العربية','اللغة الإنجليزية','التاريخ','الجغرافيا','علم الاجتماع'] },
  { id: 'sharia', ar: 'كلية الشريعة والقانون', en: 'Faculty of Sharia & Law', majors: ['الفقه والتشريع','القانون العام','القانون الخاص','أصول الدين'] },
  { id: 'med', ar: 'كلية الطب والعلوم الصحية', en: 'Faculty of Medicine & Health Sciences', majors: ['الطب البشري','التمريض','المختبرات الطبية','الصيدلة','العلاج الطبيعي'] },
  { id: 'sci', ar: 'كلية العلوم', en: 'Faculty of Science', majors: ['الرياضيات','الفيزياء','الكيمياء','الأحياء','علوم الأرض'] },
  { id: 'agr', ar: 'كلية الزراعة والبيئة', en: 'Faculty of Agriculture', majors: ['الإنتاج النباتي','الإنتاج الحيواني','التغذية','البيئة والاستدامة'] },
  { id: 'media', ar: 'كلية الإعلام', en: 'Faculty of Media', majors: ['الصحافة','الإذاعة والتلفزيون','العلاقات العامة','الإعلام الرقمي'] }
];

/* ---------- 5) DATA: TITLE BANK ---------- */
const TITLE_BANK = [
  { id:1, ar:'أثر استخدام أدوات الذكاء الاصطناعي على جودة البحث العلمي لدى طلبة الدراسات العليا في الجامعات الفلسطينية', en:'The Impact of AI Tools on Scientific Research Quality among Graduate Students in Palestinian Universities', problem:'ضعف الوعي بضوابط استخدام أدوات الذكاء الاصطناعي، وتفاوت جودة المخرجات البحثية، وغياب دليل استرشادي موحد.', major:'it', degree:'ماجستير' },
  { id:2, ar:'دور الإدارة الإلكترونية في تحسين الأداء المؤسسي في البلديات الفلسطينية', en:'The Role of E-Government in Improving Institutional Performance in Palestinian Municipalities', problem:'تفاوت مستوى التحول الرقمي، وضعف البنية التحتية التقنية، ومحدودية الكوادر المؤهلة.', major:'bus', degree:'ماجستير' },
  { id:3, ar:'فاعلية برنامج إرشادي قائم على العلاج المعرفي السلوكي في خفض قلق الاختبار', en:'Effectiveness of a CBT-Based Counseling Program in Reducing Test Anxiety', problem:'ارتفاع معدلات قلق الاختبار، وقلة البرامج الإرشادية المتخصصة.', major:'edu', degree:'ماجستير' },
  { id:4, ar:'الاتجاهات الحديثة في هندسة البرمجيات وتطبيقاتها في الشركات الناشئة الفلسطينية', en:'Modern Software Engineering Trends in Palestinian Startups', problem:'الفجوة بين مخرجات التعليم ومتطلبات سوق العمل التقني.', major:'it', degree:'بكالوريوس' },
  { id:5, ar:'أثر التسويق الرقمي على سلوك المستهلك الفلسطيني في قطاع التجارة الإلكترونية', en:'Impact of Digital Marketing on Palestinian Consumer Behavior in E-Commerce', problem:'ضعف ثقة المستهلك بالتجارة الإلكترونية، وقلة الدراسات المحلية.', major:'bus', degree:'ماجستير' },
  { id:6, ar:'الحماية القانونية للبيانات الشخصية في التشريع الفلسطيني: دراسة مقارنة', en:'Legal Protection of Personal Data in Palestinian Legislation', problem:'غياب قانون شامل لحماية البيانات، وتأخر التشريع عن التطور التقني.', major:'sharia', degree:'دكتوراه' },
  { id:7, ar:'كفاءة الطاقة الشمسية في المباني السكنية بقطاع غزة', en:'Solar Energy Efficiency in Residential Buildings in Gaza', problem:'انقطاع التيار المتكرر، وارتفاع تكلفة الأنظمة، وضعف الوعي بالصيانة.', major:'eng', degree:'ماجستير' },
  { id:8, ar:'دور الإعلام الرقمي في تشكيل الوعي السياسي لدى الشباب الفلسطيني', en:'The Role of Digital Media in Shaping Palestinian Youth Political Awareness', problem:'انتشار الأخبار المزيفة، وتأثير الخوارزميات، وقلة الدراسات الميدانية.', major:'media', degree:'ماجستير' },
  { id:9, ar:'أثر التغذية الراجعة الفورية على تحصيل طلبة الصفوف الأساسية في الرياضيات', en:'Impact of Immediate Feedback on Elementary Students Math Achievement', problem:'تدنّي مستويات التحصيل، وقلة استخدام أدوات التقييم التكويني.', major:'edu', degree:'بكالوريوس' },
  { id:10, ar:'استراتيجيات مواجهة الاحتراق الوظيفي لدى العاملين في المؤسسات الصحية بغزة', en:'Strategies for Coping with Burnout among Healthcare Workers in Gaza', problem:'ارتفاع الاحتراق الوظيفي، ونقص الدعم النفسي، وضغوط العمل.', major:'med', degree:'ماجستير' },
  { id:11, ar:'تطوير نظام توصية ذكي لاختيار التخصص الجامعي باستخدام التعلم الآلي', en:'Intelligent Recommendation System for University Major Selection Using ML', problem:'اختيار التخصص العشوائي، وقلة الإرشاد الأكاديمي المبني على البيانات.', major:'it', degree:'بكالوريوس' },
  { id:12, ar:'أثر الحوكمة الرشيدة على جودة الخدمات في المؤسسات الحكومية الفلسطينية', en:'Impact of Good Governance on Service Quality in Palestinian Government Institutions', problem:'ضعف الشفافية والمساءلة، وتداخل الصلاحيات.', major:'bus', degree:'دكتوراه' },
  { id:13, ar:'تقنيات الزراعة المائية كحل لأزمة الأمن الغذائي في قطاع غزة', en:'Hydroponic Technologies for Food Security in Gaza', problem:'محدودية الأراضي والمياه، وتأثير الحصار على الإنتاج المحلي.', major:'agr', degree:'دبلوم' },
  { id:14, ar:'دور الإرشاد النفسي المدرسي في الحد من ظاهرة التنمر بين طلبة المدارس', en:'The Role of School Counseling in Reducing Bullying', problem:'انتشار التنمر، وقلة المرشدين المؤهلين، وضعف برامج الوقاية.', major:'edu', degree:'ماجستير' }
];

/* ---------- 6) DATA: SLIDES ---------- */
const SLIDE_TEMPLATE = [
  { title:'عنوان الرسالة والبيانات الأولية', points:['اسم الباحث','اسم المشرف','الجامعة والكلية','سنة المناقشة'], notes:'قدّم نفسك بثقة واذكر العنوان بوضوح.' },
  { title:'مشكلة البحث', points:['صياغة المشكلة','الأدلة على وجودها','الفجوة البحثية'], notes:'ركّز على أهمية المشكلة وحدّتها.' },
  { title:'أسئلة البحث', points:['السؤال الرئيس','الأسئلة الفرعية'], notes:'اربط كل سؤال بهدف واضح.' },
  { title:'أهداف الدراسة', points:['الهدف العام','الأهداف الفرعية'], notes:'الأهداف يجب أن تكون قابلة للقياس.' },
  { title:'أهمية الدراسة', points:['الأهمية النظرية','الأهمية التطبيقية'], notes:'من المستفيد؟ وكيف؟' },
  { title:'الدراسات السابقة', points:['الدراسات المحلية','الدراسات العربية','الدراسات الأجنبية'], notes:'أبرز الفجوة التي تسدّها دراستك.' },
  { title:'منهجية الدراسة', points:['المنهج','العينة','الأداة','المعالجة الإحصائية'], notes:'كن دقيقاً في وصف الإجراءات.' },
  { title:'أهم النتائج', points:['النتيجة الأولى','النتيجة الثانية','النتيجة الثالثة'], notes:'اربط كل نتيجة بسؤالها.' },
  { title:'التوصيات', points:['توصيات للجهات المعنية','توصيات لبحوث مستقبلية'], notes:'توصيات عملية قابلة للتنفيذ.' },
  { title:'شكر وتقدير', points:['شكر للجنة','شكر للمشرف','شكر للجامعة'], notes:'أنهِ العرض بابتسامة.' }
];

/* ---------- 7) DATA: AI TOOLS ---------- */
const AI_TOOLS = [
  { ar:'ChatGPT', url:'https://chat.openai.com', use:'صياغة أكاديمية، تلخيص، توليد أفكار.' },
  { ar:'Google Gemini', url:'https://gemini.google.com', use:'تحليل نصوص، مراجعة منطق الفصول.' },
  { ar:'Claude', url:'https://claude.ai', use:'تحرير طويل، تحليل PDF، صياغة رصينة.' },
  { ar:'NotebookLM', url:'https://notebooklm.google.com', use:'تلخيص صوتي، خرائط معرفية، أسئلة.' },
  { ar:'Perplexity', url:'https://perplexity.ai', use:'بحث أكاديمي مع مصادر موثقة.' },
  { ar:'Elicit', url:'https://elicit.com', use:'مراجعة أدبيات منهجية.' },
  { ar:'Consensus', url:'https://consensus.app', use:'إجابات من أوراق محكّمة فقط.' },
  { ar:'SciSpace', url:'https://typeset.io', use:'شرح الأوراق بلغتك، مقارنة منهجيات.' },
  { ar:'Semantic Scholar', url:'https://semanticscholar.org', use:'محرك بحث أكاديمي مجاني.' },
  { ar:'Zotero', url:'https://zotero.org', use:'إدارة المراجع وتوليد APA 7.' }
];

/* ---------- 8) INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyTheme();
  initTabs();
  initTopToolbar();
  initThesisStudio();
  initUniversities();
  initPrograms();
  initSlides();
  initCertificates();
  initKitViews();
  initStudies();
  initTitleBank();
  initProofread();
  initAI();
  initSolutions();
  initModals();
  updateThesisProgress();
  const fy = $('#footer-year'); if (fy) fy.textContent = new Date().getFullYear();
});

/* ---------- 9) THEME ---------- */
function applyTheme() {
  document.body.classList.toggle('dark-mode', !!AppState.dark);
}

/* ---------- 10) TABS ---------- */
function initTabs() {
  $$('.nav-pill').forEach(btn => btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    AppState.tab = tab;
    $$('.nav-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.tab-section').forEach(s => s.classList.remove('active'));
    const target = $('#tab-' + tab);
    if (target) target.classList.add('active');
    saveState();
  }));
  $$('.stat-jump').forEach(btn => btn.addEventListener('click', () => {
    const navBtn = $(`.nav-pill[data-tab="${btn.dataset.statTab}"]`);
    if (navBtn) navBtn.click();
  }));
}

/* ---------- 11) TOP TOOLBAR ---------- */
function initTopToolbar() {
  $('#btn-dark-toggle')?.addEventListener('click', () => {
    AppState.dark = !AppState.dark; applyTheme(); saveState();
    toast(AppState.dark ? '🌙 الوضع الليلي' : '☀️ الوضع النهاري');
  });
  $('#btn-lang-toggle')?.addEventListener('click', () => {
    AppState.lang = AppState.lang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = AppState.lang;
    document.documentElement.dir = AppState.lang === 'ar' ? 'rtl' : 'ltr';
    const btn = $('#btn-lang-toggle'); if (btn) btn.textContent = AppState.lang === 'ar' ? 'EN' : 'ع';
    saveState();
    toast(AppState.lang === 'ar' ? 'العربية' : 'English');
  });
  $('#btn-open-contact')?.addEventListener('click', () => openModal('modal-contact'));
  $('#btn-open-guide-top')?.addEventListener('click', () => openModal('modal-guide'));
  $('#btn-open-feedback-top')?.addEventListener('click', () => openModal('modal-feedback'));
  $('#btn-open-clear')?.addEventListener('click', () => openModal('modal-clear'));
  $('#btn-save-json')?.addEventListener('click', exportJSON);
  $('#input-import-global')?.addEventListener('change', importJSON);
  $('#btn-open-refs-top')?.addEventListener('click', () => $(`.nav-pill[data-tab="studies"]`)?.click());
  $('#btn-quick-ai-top')?.addEventListener('click', () => $(`.nav-pill[data-tab="ai"]`)?.click());
  $('#btn-export-word')?.addEventListener('click', exportWord);
  $('#btn-export-pdf')?.addEventListener('click', () => window.print());
}

/* ---------- 12) MODALS ---------- */
function openModal(id) { const m = $('#' + id); if (!m) return; m.classList.remove('hidden'); m.classList.add('flex'); }
function closeModal(id) { const m = $('#' + id); if (!m) return; m.classList.add('hidden'); m.classList.remove('flex'); }
function initModals() {
  $$('[data-close-modal]').forEach(b => b.addEventListener('click', () => closeModal(b.dataset.closeModal)));
  $$('.fixed.inset-0.z-50').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); }));
  const ta = $('#feedback-text'), wa = $('#btn-feedback-wa'), mail = $('#btn-feedback-mail');
  if (ta) {
    const upd = () => {
      const v = encodeURIComponent(ta.value || 'ملاحظة عبر منصة الباحث الفلسطيني');
      if (wa) wa.href = `https://wa.me/970599179811?text=${v}`;
      if (mail) mail.href = `mailto:mostafa.n.shafie@gmail.com?subject=ملاحظة%20من%20المنصة&body=${v}`;
    };
    ta.addEventListener('input', upd); upd();
  }
  $('#btn-confirm-clear')?.addEventListener('click', () => {
    localStorage.removeItem(LS_KEY); toast('تم الحذف...'); setTimeout(() => location.reload(), 800);
  });
  $('#modal-avatar-input')?.addEventListener('change', e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const p = $('#modal-avatar-preview'), h = $('#header-avatar-slot');
      if (p) p.innerHTML = `<img src="${ev.target.result}" class="w-full h-full object-cover" />`;
      if (h) h.innerHTML = `<img src="${ev.target.result}" class="w-full h-full object-cover" />`;
      toast('تم تحديث الصورة');
    };
    r.readAsDataURL(f);
  });
  $('#btn-reset-avatar')?.addEventListener('click', () => {
    const p = $('#modal-avatar-preview'), h = $('#header-avatar-slot');
    if (p) p.textContent = 'م ش'; if (h) h.textContent = 'م ش';
  });
  $('#header-avatar-slot')?.addEventListener('click', () => openModal('modal-contact'));
}

/* ---------- 13) UNIVERSITIES ---------- */
function initUniversities() {
  renderUniversities(UNIVERSITIES);
  const selUni = $('#f-uniId');
  if (selUni) {
    selUni.innerHTML = UNIVERSITIES.map(u => `<option value="${u.id}">${u.ar}</option>`).join('');
    selUni.addEventListener('change', () => {
      const u = UNIVERSITIES.find(x => x.id === selUni.value); if (!u) return;
      AppState.thesis.uniAr = u.ar; AppState.thesis.uniEn = u.en;
      const badge = $('#studio-uni-badge'); if (badge) badge.textContent = u.ar;
      syncThesisFields(); renderPreview(); updateThesisProgress(); saveState();
    });
  }
  $('#uni-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderUniversities(UNIVERSITIES.filter(u => u.ar.includes(q) || u.en.toLowerCase().includes(q)));
  });
  $('#uni-region-filter')?.addEventListener('change', e => {
    const v = e.target.value;
    renderUniversities(v === 'all' ? UNIVERSITIES : UNIVERSITIES.filter(u => u.region === v));
  });
}
function renderUniversities(list) {
  const grid = $('#universities-grid'); if (!grid) return;
  grid.innerHTML = list.map(u => `
    <div class="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-400 transition shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-white text-xs" style="background:${u.color}">${u.badge}</div>
        <div class="min-w-0 flex-1">
          <h3 class="font-extrabold text-slate-900 text-sm truncate">${u.ar}</h3>
          <p class="text-[11px] text-slate-500 truncate">${u.en}</p>
        </div>
      </div>
      <button type="button" onclick="selectUniversity('${u.id}')" class="w-full mt-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold py-2 rounded-lg border border-emerald-200">اعتماد في الغلاف</button>
    </div>`).join('');
}
window.selectUniversity = (id) => {
  const u = UNIVERSITIES.find(x => x.id === id); if (!u) return;
  AppState.thesis.uniAr = u.ar; AppState.thesis.uniEn = u.en; AppState.thesis.uniId = id;
  const s = $('#f-uniId'); if (s) s.value = id;
  const b = $('#studio-uni-badge'); if (b) b.textContent = u.ar;
  syncThesisFields(); renderPreview(); updateThesisProgress(); saveState();
  toast('✅ تم اعتماد ' + u.ar);
};

/* ---------- 14) PROGRAMS ---------- */
function initPrograms() {
  const facSel = $('#f-facultySelect'), majSel = $('#f-majorSelect');
  if (facSel && majSel) {
    facSel.innerHTML = FACULTIES.map(f => `<option value="${f.id}">${f.ar}</option>`).join('');
    const fillMaj = () => {
      const f = FACULTIES.find(x => x.id === facSel.value); if (!f) return;
      majSel.innerHTML = f.majors.map(m => `<option value="${m}">${m}</option>`).join('');
    };
    fillMaj();
    facSel.addEventListener('change', fillMaj);
    majSel.addEventListener('change', () => {
      const f = FACULTIES.find(x => x.id === facSel.value); if (!f) return;
      const fa = $('#f-facultyAr'), fe = $('#f-facultyEn');
      if (fa) fa.value = f.ar; if (fe) fe.value = f.en;
      saveState(); renderPreview();
      toast('✅ ' + f.ar + ' — ' + majSel.value);
    });
  }
  renderPrograms(FACULTIES);
  $('#prog-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderPrograms(FACULTIES.filter(f => f.ar.includes(q) || f.en.toLowerCase().includes(q) || f.majors.some(m => m.includes(q))));
  });
}
function renderPrograms(list) {
  const grid = $('#faculties-programs-grid'); if (!grid) return;
  grid.innerHTML = list.map(f => `
    <div class="bg-white rounded-2xl p-4 border border-slate-200">
      <h3 class="font-extrabold text-slate-900 text-sm mb-2">${f.ar}</h3>
      <p class="text-[11px] text-slate-500 mb-2">${f.en}</p>
      <div class="flex flex-wrap gap-1.5">
        ${f.majors.map(m => `<button type="button" onclick="selectFaculty('${f.id}','${m}')" class="text-[11px] bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 px-2 py-1 rounded border border-slate-200">${m}</button>`).join('')}
      </div>
    </div>`).join('');
}
window.selectFaculty = (fid, m) => {
  const f = FACULTIES.find(x => x.id === fid); if (!f) return;
  const fa = $('#f-facultyAr'), fe = $('#f-facultyEn'), fsel = $('#f-facultySelect'), msel = $('#f-majorSelect');
  if (fa) fa.value = f.ar; if (fe) fe.value = f.en;
  if (fsel) fsel.value = fid;
  if (msel) { msel.innerHTML = f.majors.map(x => `<option value="${x}">${x}</option>`).join(''); msel.value = m; }
  saveState(); renderPreview();
  toast('✅ ' + f.ar + ' — ' + m);
};

/* ---------- 15) THESIS STUDIO ---------- */
function initThesisStudio() {
  const FIELDS = ['docType','uniId','facultyAr','facultyEn','titleAr','titleEn','studentAr','studentEn','supervisorAr','supervisorEn','yearAr','yearEn','dedication','ack','problem','abstractAr','abstractEn','fontAr','fontSize','lineHeight'];
  FIELDS.forEach(id => {
    const el = $('#f-' + id); if (!el) return;
    el.addEventListener('input', () => {
      AppState.thesis[id] = el.value;
      renderPreview(); updateThesisProgress(); saveState();
    });
  });
  $$('.btn-ded-preset').forEach(b => b.addEventListener('click', () => {
    const presets = {
      classic:'إلى من أحمل اسمهم بكل فخر، إلى والديّ الكريمين... إلى من كانوا سندي في كل خطوة، إلى أرواح الشهداء الذين رسموا لنا طريق العلم... أهدي هذا الجهد المتواضع.',
      academic:'أهدي هذا الجهد العلمي المتواضع إلى كل من آمن بأن العلم هو الطريق الوحيد لتحرير الإنسان وبناء وطنه، وإلى أساتذتي الذين علّموني أن البحث رسالة قبل أن يكون وظيفة.',
      palestine:'إلى فلسطين... إلى أرواح الشهداء والأسرى والجرحى... إلى كل طالب علم يحمل حلمه رغم الحصار والوجع... أهدي هذا العمل المتواضع، عساه يكون نوراً في طريق طويل.'
    };
    const v = presets[b.dataset.ded];
    if (v) { const el = $('#f-dedication'); if (el) { el.value = v; el.dispatchEvent(new Event('input')); } }
  }));
  $$('.btn-ack-preset').forEach(b => b.addEventListener('click', () => {
    const presets = {
      supervisor:'أتقدم بجزيل الشكر وعظيم الامتنان إلى أستاذي المشرف على رسالتي، لما قدّمه لي من علم غزير وتوجيه رشيد وصبر طويل... كما أشكر أعضاء لجنة المناقشة الكرام على ملاحظاتهم القيّمة.',
      comprehensive:'الحمد لله أولاً وآخراً... أشكر جامعتي الموقرة، وعمادة الدراسات العليا، وأعضاء هيئة التدريس... وأخص بالشكر أستاذي المشرف على توجيهاته السديدة. كما أشكر المحكّمين الكرام على تحكيمهم العلمي.',
      short:'أتقدم بالشكر الجزيل إلى أستاذي المشرف على متابعته الدائمة، وإلى أعضاء لجنة المناقشة على تفضّلهم بالتحكيم.'
    };
    const v = presets[b.dataset.ack];
    if (v) { const el = $('#f-ack'); if (el) { el.value = v; el.dispatchEvent(new Event('input')); } }
  }));
  $$('.preview-btn').forEach(b => b.addEventListener('click', () => {
    $$('.preview-btn').forEach(x => { x.classList.remove('bg-emerald-800','text-white'); x.classList.add('bg-slate-100','text-slate-700'); });
    b.classList.remove('bg-slate-100','text-slate-700'); b.classList.add('bg-emerald-800','text-white');
    AppState.previewMode = b.dataset.preview;
    renderPreview();
  }));
  $('#input-custom-uni-logo')?.addEventListener('change', e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { AppState.thesis.customLogo = ev.target.result; renderPreview(); saveState(); };
    r.readAsDataURL(f);
  });
  $('#btn-reset-uni-logo')?.addEventListener('click', () => { delete AppState.thesis.customLogo; renderPreview(); saveState(); toast('تم استعادة الشعار'); });
  if (!AppState.thesis.titleAr) {
    AppState.thesis = Object.assign({
      docType:'master', uniAr:'جامعة القدس المفتوحة', uniEn:'Al-Quds Open University',
      facultyAr:'كلية الدراسات العليا', facultyEn:'Faculty of Graduate Studies',
      titleAr:'أثر استخدام أدوات الذكاء الاصطناعي على جودة البحث العلمي لدى طلبة الدراسات العليا في الجامعات الفلسطينية',
      titleEn:'The Impact of AI Tools on Scientific Research Quality among Graduate Students in Palestinian Universities',
      studentAr:'مصطفى نضال مصطفى الشافعي', studentEn:'Mostafa Nidal Mostafa Shafie',
      supervisorAr:'أ.د. اسم المشرف الأكاديمي', supervisorEn:'Prof. Supervisor Name',
      yearAr:'2026 م', yearEn:'2026'
    }, AppState.thesis);
    syncThesisFields();
  }
  renderPreview();
}
function syncThesisFields() {
  Object.keys(AppState.thesis).forEach(k => {
    const el = $('#f-' + k);
    if (el && typeof AppState.thesis[k] === 'string') el.value = AppState.thesis[k];
  });
}
function renderPreview() {
  const host = $('#a4-preview-host'); if (!host) return;
  const t = AppState.thesis, m = AppState.previewMode;
  const uniBadge = (t.uniAr || 'جامعة').slice(0, 3);
  const logoHTML = t.customLogo ? `<img src="${t.customLogo}" class="w-24 h-24 object-contain mx-auto" />` : `<div class="w-24 h-24 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-extrabold text-2xl mx-auto">${uniBadge}</div>`;
  const coverAr = `<div class="thesis-frame font-amiri" dir="rtl" style="min-height:960px;">
    <div class="text-center space-y-2"><p class="text-base font-bold">${t.uniAr||''}</p><p class="text-sm">${t.facultyAr||''}</p>${logoHTML}</div>
    <div class="text-center space-y-4 py-6"><h1 class="text-2xl font-bold leading-loose px-4">${t.titleAr||'عنوان الرسالة'}</h1><p class="text-sm italic text-slate-600">${t.titleEn||''}</p></div>
    <div class="text-center space-y-2 text-base"><p>رسالة مقدمة لنيل درجة <strong>${degreeLabel(t.docType)}</strong></p><p class="mt-4">إعداد الباحث/ة</p><p class="text-lg font-bold">${t.studentAr||'—'}</p><p class="text-sm italic text-slate-600">${t.studentEn||''}</p><p class="mt-4">إشراف</p><p class="text-lg font-bold">${t.supervisorAr||'—'}</p><p class="text-sm italic text-slate-600">${t.supervisorEn||''}</p></div>
    <div class="text-center text-sm pt-6 border-t border-slate-300"><p>${t.yearAr||''}</p><p class="italic">${t.yearEn||''}</p></div>
  </div>`;
  const coverEn = `<div class="thesis-frame font-times" dir="ltr" style="min-height:960px;">
    <div class="text-center space-y-2"><p class="text-base font-bold">${t.uniEn||''}</p><p class="text-sm">${t.facultyEn||''}</p>${logoHTML}</div>
    <div class="text-center space-y-4 py-6"><h1 class="text-2xl font-bold leading-loose px-4">${t.titleEn||''}</h1><p class="text-sm italic text-slate-600" dir="rtl">${t.titleAr||''}</p></div>
    <div class="text-center space-y-2 text-base"><p>A Thesis Submitted for the Degree of <strong>${degreeLabelEn(t.docType)}</strong></p><p class="mt-4">Prepared by</p><p class="text-lg font-bold">${t.studentEn||''}</p><p class="mt-4">Supervised by</p><p class="text-lg font-bold">${t.supervisorEn||''}</p></div>
    <div class="text-center text-sm pt-6 border-t border-slate-300"><p>${t.yearEn||''}</p></div>
  </div>`;
  const dedication = `<div class="thesis-frame font-amiri" dir="rtl" style="min-height:960px;">
    <h2 class="text-2xl font-bold text-center border-b-2 border-emerald-900 pb-2">الإهداء</h2>
    <div class="text-lg leading-loose whitespace-pre-wrap py-8 text-center">${t.dedication||'اكتب إهداءك هنا...'}</div>
    <div class="text-center text-sm">${t.yearAr||''}</div>
  </div>`;
  const ack = `<div class="thesis-frame font-amiri" dir="rtl" style="min-height:960px;">
    <h2 class="text-2xl font-bold text-center border-b-2 border-emerald-900 pb-2">شكر وتقدير</h2>
    <div class="text-lg leading-loose whitespace-pre-wrap py-8">${t.ack||'اكتب كلمة الشكر...'}</div>
    <div class="text-center text-sm pt-6">${t.yearAr||''}</div>
  </div>`;
  const abstract = `<div class="thesis-frame font-amiri" dir="rtl" style="min-height:960px;">
    <h2 class="text-2xl font-bold text-center border-b-2 border-emerald-900 pb-2">الملخص (المستخلص)</h2>
    <div class="text-base leading-loose whitespace-pre-wrap py-4">${t.abstractAr||'اكتب مستخلص البحث...'}</div>
    <h3 class="text-xl font-bold border-b border-slate-300 pb-1 mt-6">Abstract</h3>
    <div class="text-base leading-loose whitespace-pre-wrap py-4 italic" dir="ltr">${t.abstractEn||'Write your abstract in English...'}</div>
  </div>`;
  const approval = `<div class="thesis-frame font-amiri" dir="rtl" style="min-height:960px;">
    <h2 class="text-2xl font-bold text-center border-b-2 border-emerald-900 pb-2">إقرار لجنة المناقشة</h2>
    <p class="text-base leading-loose mt-4">تشهد لجنة المناقشة بأن الباحث/ة <strong>${t.studentAr||'...'}</strong> قد قدّم/ت رسالته/ا الموسومة بـ: <strong>${t.titleAr||'...'}</strong>، وقد أوصت اللجنة بقبولها بعد استيفاء شروط المناقشة والحكم.</p>
    <p class="text-base leading-loose mt-4">التاريخ: ${t.yearAr||'...'}</p>
    <div class="mt-8 space-y-4">
      <div class="flex justify-between border-b border-dotted border-slate-400 pb-2"><span>رئيس اللجنة:</span><span class="text-sm">.......................</span></div>
      <div class="flex justify-between border-b border-dotted border-slate-400 pb-2"><span>المشرف:</span><span class="text-sm">.......................</span></div>
      <div class="flex justify-between border-b border-dotted border-slate-400 pb-2"><span>المناقش الداخلي:</span><span class="text-sm">.......................</span></div>
      <div class="flex justify-between border-b border-dotted border-slate-400 pb-2"><span>المناقش الخارجي:</span><span class="text-sm">.......................</span></div>
    </div>
    <hr class="my-8" />
    <h2 class="text-2xl font-bold text-center border-b-2 border-emerald-900 pb-2">إقرار الأمانة العلمية</h2>
    <p class="text-base leading-loose mt-4">أُقر أنا الباحث/ة <strong>${t.studentAr||'...'}</strong> بأن جميع ما ورد في هذه الرسالة هو نتاج جهدي الشخصي، وأن كل ما استعنت به من مصادر ومراجع قد تم توثيقه وفق الأصول العلمية.</p>
    <p class="mt-8">التوقيع: .................... التاريخ: ${t.yearAr||''}</p>
  </div>`;
  const proposal = `<div class="thesis-frame font-amiri" dir="rtl" style="min-height:960px;">
    <h2 class="text-2xl font-bold text-center border-b-2 border-emerald-900 pb-2">خطة البحث (Proposal)</h2>
    <div class="text-base leading-loose space-y-3 py-4">
      <h3 class="text-lg font-bold mt-2">1. عنوان الدراسة</h3><p>${t.titleAr||'...'}</p>
      <h3 class="text-lg font-bold mt-2">2. مشكلة الدراسة</h3><p class="whitespace-pre-wrap">${t.problem||'صغ مشكلة الدراسة في فقرة واضحة تتضمن: واقع المشكلة، أدلتها، والفجوة البحثية.'}</p>
      <h3 class="text-lg font-bold mt-2">3. أسئلة الدراسة</h3><ul class="list-decimal list-inside"><li>السؤال الرئيس ...</li><li>الأسئلة الفرعية ...</li></ul>
      <h3 class="text-lg font-bold mt-2">4. أهداف الدراسة</h3><ul class="list-decimal list-inside"><li>...</li></ul>
      <h3 class="text-lg font-bold mt-2">5. أهمية الدراسة</h3><p>...</p>
      <h3 class="text-lg font-bold mt-2">6. المنهجية والإجراءات</h3><p>...</p>
    </div>
  </div>`;
  const map = { 'cover-ar':coverAr, 'cover-en':coverEn, 'dedication':dedication, 'ack':ack, 'abstract':abstract, 'approval':approval, 'proposal':proposal };
  host.innerHTML = map[m] || coverAr;
  const fs = ($('#f-fontSize')?.value || '16') + 'px';
  host.style.fontSize = fs;
  host.style.lineHeight = $('#f-lineHeight')?.value || '1.5';
}
function degreeLabel(t) { return ({ master:'الماجستير', phd:'الدكتوراه', grad:'البكالوريوس', diploma:'الدبلوم المتوسط', vocational_diploma:'الدبلوم المهني', higher_diploma:'الدبلوم العالي', paper:'البحث العلمي' })[t] || 'الماجستير'; }
function degreeLabelEn(t) { return ({ master:"Master's", phd:'Doctor of Philosophy', grad:"Bachelor's", diploma:'Intermediate Diploma', vocational_diploma:'Vocational Diploma', higher_diploma:'Higher Diploma', paper:'Scientific Paper' })[t] || "Master's"; }
function updateThesisProgress() {
  const t = AppState.thesis;
  const checks = ['titleAr','titleEn','studentAr','supervisorAr','abstractAr','dedication','ack','problem'];
  const done = checks.filter(k => t[k] && t[k].trim().length > 5).length;
  const pct = Math.round((done / checks.length) * 100);
  const p1 = $('#thesis-progress-pct'); if (p1) p1.textContent = pct + '%';
  const p2 = $('#thesis-progress-fill'); if (p2) p2.style.width = pct + '%';
  const p3 = $('#thesis-progress-hint');
  if (p3) p3.textContent = pct < 50 ? 'أكمل بياناتك لرفع نسبة الجاهزية' : pct < 100 ? 'على الطريق الصحيح!' : '✅ رسالتك جاهزة للمناقشة';
}

/* ---------- 16) SLIDES ---------- */
function initSlides() {
  if (!AppState.slides || !AppState.slides.length) AppState.slides = JSON.parse(JSON.stringify(SLIDE_TEMPLATE));
  renderSlidesNav(); renderActiveSlide();
  $('#btn-prev-slide')?.addEventListener('click', () => changeSlide(-1));
  $('#btn-next-slide')?.addEventListener('click', () => changeSlide(1));
  $('#btn-sync-slides')?.addEventListener('click', () => {
    const t = AppState.thesis;
    AppState.slides[0].points = [t.studentAr||'الباحث', t.supervisorAr||'المشرف', t.uniAr||'الجامعة', t.yearAr||'2026'];
    AppState.slides[0].title = t.titleAr || 'عنوان الرسالة';
    AppState.slides[1].points = (t.problem||'').split('.').filter(Boolean).slice(0,4);
    renderSlidesNav(); renderActiveSlide(); saveState(); toast('✅ تمت المزامنة');
  });
  $('#sl-title')?.addEventListener('input', e => { AppState.slides[AppState.slideIdx].title = e.target.value; renderSlidesNav(); renderActiveSlide(); saveState(); });
  $('#sl-points')?.addEventListener('input', e => { AppState.slides[AppState.slideIdx].points = e.target.value.split('\n').filter(Boolean); renderActiveSlide(); saveState(); });
  $('#sl-notes')?.addEventListener('input', e => { AppState.slides[AppState.slideIdx].notes = e.target.value; saveState(); });
  initDefenseTimer();
}
function renderSlidesNav() {
  const nav = $('#slides-nav-list'); if (!nav) return;
  nav.innerHTML = AppState.slides.map((s, i) => `
    <button type="button" data-slide="${i}" class="slide-nav-btn w-full text-right p-3 rounded-lg border ${i === AppState.slideIdx ? 'bg-emerald-800 text-white border-emerald-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
      <span class="text-xs font-extrabold">${i + 1}. ${s.title.slice(0, 40)}</span>
    </button>`).join('');
  $$('.slide-nav-btn').forEach(b => b.addEventListener('click', () => {
    AppState.slideIdx = +b.dataset.slide; renderSlidesNav(); renderActiveSlide(); saveState();
  }));
}
function renderActiveSlide() {
  const canvas = $('#active-slide-canvas'); if (!canvas) return;
  const s = AppState.slides[AppState.slideIdx];
  canvas.innerHTML = `
    <div class="flex items-center gap-2 text-amber-300 text-xs font-bold"><span class="w-2 h-2 rounded-full bg-amber-400"></span><span>شريحة ${AppState.slideIdx+1} من ${AppState.slides.length}</span></div>
    <div class="flex-1 flex flex-col justify-center text-center space-y-3">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-white">${s.title}</h2>
      <ul class="text-sm sm:text-base text-emerald-100 space-y-1.5 max-w-2xl mx-auto">${s.points.map(p => `<li>• ${p}</li>`).join('')}</ul>
    </div>
    <div class="text-[10px] text-emerald-200/70 text-center">${AppState.thesis.studentAr||''} — ${AppState.thesis.uniAr||''}</div>`;
  const slT = $('#sl-title'); if (slT) slT.value = s.title;
  const slP = $('#sl-points'); if (slP) slP.value = s.points.join('\n');
  const slN = $('#sl-notes'); if (slN) slN.value = s.notes || '';
  const cnt = $('#slide-counter-badge'); if (cnt) cnt.textContent = `شريحة ${AppState.slideIdx+1} من ${AppState.slides.length}`;
}
function changeSlide(d) {
  AppState.slideIdx = Math.max(0, Math.min(AppState.slides.length - 1, AppState.slideIdx + d));
  renderSlidesNav(); renderActiveSlide(); saveState();
}
function initDefenseTimer() {
  let t = 15 * 60, iv = null;
  const upd = () => {
    const m = String(Math.floor(t/60)).padStart(2,'0'), s = String(t%60).padStart(2,'0');
    const el = $('#def-timer-display'); if (el) el.textContent = `${m}:${s}`;
  };
  upd();
  $('#btn-def-t-start')?.addEventListener('click', () => { if (iv) return; iv = setInterval(() => { if (t > 0) { t--; upd(); } }, 1000); });
  $('#btn-def-t-pause')?.addEventListener('click', () => { clearInterval(iv); iv = null; });
  $('#btn-def-t-reset')?.addEventListener('click', () => { clearInterval(iv); iv = null; t = 15*60; upd(); });
}

/* ---------- 17) CERTIFICATES ---------- */
function initCertificates() {
  renderCert();
  ['cert-role','cert-member','cert-body','cert-date','cert-dean'].forEach(id => {
    $('#'+id)?.addEventListener('input', () => { renderCert(); saveState(); });
  });
  $$('.cert-mode-btn').forEach(b => b.addEventListener('click', () => {
    $$('.cert-mode-btn').forEach(x => { x.classList.remove('bg-emerald-800','text-white'); x.classList.add('bg-slate-100','text-slate-700'); });
    b.classList.remove('bg-slate-100','text-slate-700'); b.classList.add('bg-emerald-800','text-white');
    AppState.certMode = b.dataset.certMode; renderCert(); saveState();
  }));
  $('#btn-print-cert')?.addEventListener('click', () => window.print());
  $('#btn-word-cert')?.addEventListener('click', exportCertWord);
}
function renderCert() {
  const host = $('#cert-preview-host'); if (!host) return;
  const t = AppState.thesis;
  const role = $('#cert-role')?.value || 'عضو لجنة';
  const member = $('#cert-member')?.value || '—';
  const body = $('#cert-body')?.value || '';
  const date = $('#cert-date')?.value || '';
  const dean = $('#cert-dean')?.value || '';
  host.innerHTML = `
    <div class="space-y-4">
      <div class="text-center space-y-1"><p class="text-2xl font-amiri font-bold text-emerald-900">${t.uniAr||''}</p><p class="text-sm text-slate-600">${t.facultyAr||''}</p></div>
      <div class="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-3xl">🏆</div>
      <h2 class="text-3xl font-amiri font-bold text-emerald-900 text-center">شهادة شكر وتقدير</h2>
      <div class="text-center space-y-2 font-amiri">
        <p class="text-lg">تتشرف <strong>عمادة الدراسات العليا</strong> والباحث</p>
        <p class="text-xl font-bold text-emerald-900">${member}</p>
        <p class="text-sm text-slate-600">${role}</p>
        <p class="text-base leading-loose max-w-lg mx-auto mt-4 whitespace-pre-wrap">${body}</p>
      </div>
      <div class="flex justify-between items-center pt-6 border-t border-slate-300 text-sm">
        <div class="text-center"><p class="font-bold">${dean}</p><p class="text-xs text-slate-500">التوقيع: ..............</p></div>
        <div class="text-center"><p class="font-bold">${t.studentAr||''}</p><p class="text-xs text-slate-500">الباحث</p></div>
      </div>
      <p class="text-center text-sm text-slate-600">${date}</p>
    </div>`;
}

/* ---------- 18) KIT VIEWS ---------- */
function initKitViews() {
  $$('.kit-btn').forEach(b => b.addEventListener('click', () => {
    $$('.kit-btn').forEach(x => { x.classList.remove('bg-emerald-800','text-white'); x.classList.add('bg-slate-100','text-slate-700'); });
    b.classList.remove('bg-slate-100','text-slate-700'); b.classList.add('bg-emerald-800','text-white');
    const v = b.dataset.kit;
    const cert = $('#kit-view-cert'), ev = $('#kit-view-event');
    if (cert) cert.classList.toggle('hidden', v !== 'cert');
    if (ev) { ev.classList.toggle('hidden', v === 'cert'); ev.classList.toggle('grid', v !== 'cert'); }
    AppState.kitView = v; renderKitPreview(); saveState();
  }));
  ['dk-sup','dk-int','dk-ext','dk-date','dk-time','dk-hall','dk-qr-url','dk-invite-msg'].forEach(id => {
    $('#'+id)?.addEventListener('input', renderKitPreview);
  });
  $('#input-researcher-photo')?.addEventListener('change', e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { AppState.researcherPhoto = ev.target.result; renderKitPreview(); saveState(); };
    r.readAsDataURL(f);
  });
  $('#btn-clear-rphoto')?.addEventListener('click', () => { delete AppState.researcherPhoto; renderKitPreview(); saveState(); });
  $('#btn-copy-social-invite')?.addEventListener('click', () => {
    const t = AppState.thesis;
    const msg = `🎓 بكل فخر واعتزاز، يسعدني دعوتكم لحضور مناقشة رسالتي للماجستير بعنوان:\n"${t.titleAr||''}"\n📅 ${$('#dk-date')?.value||''}\n🕐 ${$('#dk-time')?.value||''}\n📍 ${$('#dk-hall')?.value||''}\nحضوركم شرف لي 🤍`;
    navigator.clipboard.writeText(msg).then(() => toast('✅ تم نسخ نص الدعوة'));
  });
  $('#btn-print-kit')?.addEventListener('click', () => window.print());
  $('#btn-word-kit')?.addEventListener('click', exportKitWord);
  renderKitPreview();
}
function renderKitPreview() {
  const host = $('#kit-event-preview'); if (!host) return;
  const t = AppState.thesis, v = AppState.kitView;
  const sup = $('#dk-sup')?.value||'', int = $('#dk-int')?.value||'', ext = $('#dk-ext')?.value||'';
  const date = $('#dk-date')?.value||'', time = $('#dk-time')?.value||'', hall = $('#dk-hall')?.value||'';
  const inviteMsg = $('#dk-invite-msg')?.value||'';
  const photo = AppState.researcherPhoto ? `<img src="${AppState.researcherPhoto}" class="w-32 h-32 rounded-full object-cover border-4 border-amber-400 mx-auto" />` : `<div class="w-32 h-32 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-extrabold text-2xl mx-auto">${(t.studentAr||'ب').slice(0,2)}</div>`;
  if (v === 'banner') {
    host.innerHTML = `<div class="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 space-y-4 text-center">
      <p class="text-xs font-bold text-amber-300">${t.uniAr||''} — ${t.facultyAr||''}</p>
      <h2 class="text-2xl font-extrabold">دعوة لحضور مناقشة رسالة ${degreeLabel(t.docType)}</h2>
      <p class="text-lg font-amiri leading-relaxed">${t.titleAr||''}</p>
      <div class="grid grid-cols-3 gap-2 text-xs bg-white/10 p-3 rounded-xl">
        <div><p class="text-amber-300 font-bold">المشرف</p><p>${sup}</p></div>
        <div><p class="text-amber-300 font-bold">المناقش الداخلي</p><p>${int}</p></div>
        <div><p class="text-amber-300 font-bold">المناقش الخارجي</p><p>${ext}</p></div>
      </div>
      <div class="flex items-center justify-between text-xs">
        <div class="text-right"><p class="text-amber-300 font-bold">الباحث</p><p>${t.studentAr||''}</p></div>
        ${photo}
        <div class="text-left"><p class="text-amber-300 font-bold">الموعد</p><p>${date}</p><p>${time}</p></div>
      </div>
      <p class="text-xs bg-amber-500 text-slate-950 font-bold inline-block px-3 py-1 rounded-full">${hall}</p>
    </div>`;
  } else if (v === 'tents') {
    host.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      ${[['رئيس اللجنة والمشرف',sup],['المناقش الداخلي',int],['المناقش الخارجي',ext],['الباحث',t.studentAr||'']].map(([r,n])=>`
        <div class="rounded-xl border-4 border-double border-emerald-800 p-6 text-center bg-white">
          <p class="text-xs font-bold text-amber-700">${r}</p>
          <p class="text-lg font-extrabold text-emerald-900 mt-2">${n}</p>
          <p class="text-[10px] text-slate-500 mt-1">${t.uniAr||''}</p>
        </div>`).join('')}
    </div>`;
  } else if (v === 'invite') {
    host.innerHTML = `<div class="rounded-2xl border-4 border-double border-amber-500 p-6 bg-gradient-to-br from-amber-50 to-white text-center space-y-3">
      <p class="text-xs font-bold text-emerald-900">${t.uniAr||''}</p>
      ${photo}
      <h2 class="text-lg font-extrabold text-emerald-900">${t.studentAr||''}</h2>
      <p class="text-xs text-slate-600">يسرّني دعوتكم لحضور مناقشة رسالتي</p>
      <p class="font-amiri text-base leading-relaxed">${t.titleAr||''}</p>
      <p class="text-xs bg-emerald-50 p-2 rounded-lg">${inviteMsg}</p>
      <div class="text-xs space-y-1"><p>📅 ${date} — 🕐 ${time}</p><p>📍 ${hall}</p></div>
    </div>`;
  }
}

/* ---------- 19) STUDIES ---------- */
function initStudies() {
  if (!AppState.studies.length) AppState.studies = [
    { author:'الشافعي، مصطفى', year:'2024', title:'أثر استخدام أدوات الذكاء الاصطناعي على جودة البحث العلمي', source:'الجامعة الإسلامية بغزة', category:'محلية فلسطينية', summary:'المنهج الوصفي التحليلي، عينة 200 باحث، أظهرت النتائج أثراً إيجابياً دالاً إحصائياً.' },
    { author:'Smith, J.', year:'2023', title:'AI in Academic Research: A Systematic Review', source:'Journal of Higher Education', category:'أجنبية', summary:'مراجعة منهجية لـ 45 دراسة، أبرزت التحسين في جودة الصياغة مع تحذير من الاعتماد الكامل.' }
  ];
  renderStudies();
  $('#btn-add-study')?.addEventListener('click', () => {
    const s = {
      author: $('#st-author')?.value?.trim(), year: $('#st-year')?.value?.trim(),
      title: $('#st-title')?.value?.trim(), source: $('#st-source')?.value?.trim(),
      category: $('#st-category')?.value, summary: $('#st-summary')?.value?.trim()
    };
    if (!s.title) { toast('❗ أدخل عنوان الدراسة'); return; }
    AppState.studies.push(s); renderStudies(); saveState();
    ['st-author','st-year','st-title','st-source','st-summary'].forEach(id => { const el = $('#'+id); if (el) el.value = ''; });
    toast('✅ أُضيفت الدراسة');
  });
  $('#st-filter')?.addEventListener('change', renderStudies);
  $('#btn-copy-apa')?.addEventListener('click', () => {
    const refs = AppState.studies.map(apaFormat).join('\n\n');
    navigator.clipboard.writeText(refs).then(() => toast('✅ نُسخت المراجع'));
  });
}
function apaFormat(s) { return `${s.author} (${s.year}). ${s.title}. ${s.source}.`; }
function renderStudies() {
  const host = $('#studies-list'); if (!host) return;
  const f = $('#st-filter')?.value || 'all';
  const list = f === 'all' ? AppState.studies : AppState.studies.filter(s => s.category === f);
  const cnt = $('#studies-count'); if (cnt) cnt.textContent = list.length;
  if (!list.length) { host.innerHTML = '<p class="text-center text-sm text-slate-500 py-6">لا توجد دراسات</p>'; return; }
  host.innerHTML = list.map(s => `
    <div class="p-3 rounded-xl border border-slate-200 bg-slate-50">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <p class="font-extrabold text-slate-900 text-sm">${s.title}</p>
          <p class="text-xs text-slate-600 mt-1">${s.author} — ${s.year} — ${s.source}</p>
          <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">${s.summary||''}</p>
          <p class="text-[11px] text-emerald-800 mt-1 font-mono" dir="ltr">${apaFormat(s)}</p>
        </div>
        <button type="button" onclick="removeStudy(${AppState.studies.indexOf(s)})" class="text-rose-600 hover:text-rose-800 text-lg">×</button>
      </div>
      <span class="inline-block text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded mt-1">${s.category}</span>
    </div>`).join('');
}
window.removeStudy = (i) => { AppState.studies.splice(i, 1); renderStudies(); saveState(); };

/* ---------- 20) TITLE BANK ---------- */
function initTitleBank() {
  const majorSel = $('#bank-major-filter');
  if (majorSel) majorSel.innerHTML = '<option value="all">جميع التخصصات</option>' + FACULTIES.map(f => `<option value="${f.id}">${f.ar}</option>`).join('');
  renderTitleBank();
  $('#bank-search')?.addEventListener('input', renderTitleBank);
  $('#bank-degree-filter')?.addEventListener('change', renderTitleBank);
  $('#bank-major-filter')?.addEventListener('change', renderTitleBank);
  $('#btn-check-title')?.addEventListener('click', () => {
    const v = $('#title-check-input')?.value || '';
    const w = v.trim().split(/\s+/).filter(Boolean).length;
    const el = $('#title-check-result'); if (!el) return;
    let score = 0, notes = [];
    if (w >= 10 && w <= 18) { score += 40; notes.push('✅ الطول مثالي (' + w + ' كلمة)'); } else notes.push('⚠️ الطول غير مثالي (' + w + ' كلمة)');
    if (/فلسطين|غزة|الضفة|القدس/.test(v)) { score += 20; notes.push('✅ يذكر بيئة الدراسة'); } else notes.push('⚠️ لا يذكر البيئة الفلسطينية');
    if (/أثر|دور|فاعلية|تأثير|علاقة/.test(v)) { score += 20; notes.push('✅ يتضمن كلمة بحثية'); }
    if (/في|على|لدى/.test(v)) { score += 20; notes.push('✅ يحتوي رابطاً بين المتغيرات'); }
    el.innerHTML = `<p class="font-extrabold ${score>=80?'text-emerald-800':score>=50?'text-amber-800':'text-rose-700'}">النتيجة: ${score}/100</p>${notes.map(n => `<p>${n}</p>`).join('')}`;
  });
  $('#btn-load-current-title')?.addEventListener('click', () => {
    const inp = $('#title-check-input'); if (inp) inp.value = AppState.thesis.titleAr || '';
    $('#btn-check-title')?.click();
  });
}
function renderTitleBank() {
  const host = $('#bank-grid'); if (!host) return;
  const q = ($('#bank-search')?.value || '').toLowerCase();
  const deg = $('#bank-degree-filter')?.value || 'all';
  const maj = $('#bank-major-filter')?.value || 'all';
  const list = TITLE_BANK.filter(t =>
    (!q || t.ar.includes(q) || t.en.toLowerCase().includes(q)) &&
    (deg === 'all' || t.degree === deg) &&
    (maj === 'all' || t.major === maj)
  );
  host.innerHTML = list.map(t => `
    <div class="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <span class="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">${t.degree}</span>
        <span class="text-[10px] text-slate-500">${t.major}</span>
      </div>
      <h3 class="font-extrabold text-slate-900 text-sm leading-relaxed">${t.ar}</h3>
      <p class="text-xs text-slate-500 italic" dir="ltr">${t.en}</p>
      <p class="text-[11px] text-rose-800 bg-rose-50 p-2 rounded border border-rose-100"><strong>المشكلة:</strong> ${t.problem}</p>
      <button type="button" onclick="adoptTitle(${t.id})" class="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 rounded-lg text-xs">اعتماد في الرسالة</button>
    </div>`).join('') || '<p class="text-center text-sm text-slate-500 py-6 col-span-2">لا نتائج</p>';
}
window.adoptTitle = (id) => {
  const t = TITLE_BANK.find(x => x.id === id); if (!t) return;
  AppState.thesis.titleAr = t.ar; AppState.thesis.titleEn = t.en; AppState.thesis.problem = t.problem;
  syncThesisFields(); renderPreview(); updateThesisProgress(); saveState();
  toast('✅ تم اعتماد العنوان');
  $(`.nav-pill[data-tab="studio"]`)?.click();
};

/* ---------- 21) PROOFREAD ---------- */
function initProofread() {
  const ta = $('#proof-textarea');
  const upd = () => {
    const v = ta?.value || '';
    const w = $('#stat-words'); if (w) w.textContent = v.trim().split(/\s+/).filter(Boolean).length;
    const p = $('#stat-paras'); if (p) p.textContent = v.split(/\n\s*\n/).filter(Boolean).length;
    const c = $('#stat-chars'); if (c) c.textContent = v.length;
    const pg = $('#stat-pages'); if (pg) pg.textContent = Math.ceil(v.length / 1800);
  };
  ta?.addEventListener('input', upd); upd();
  $('#btn-clean-spaces')?.addEventListener('click', () => { if (!ta) return; ta.value = ta.value.replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim(); upd(); toast('✅ تم تنظيف المسافات'); });
  $('#btn-fix-punct')?.addEventListener('click', () => { if (!ta) return; ta.value = ta.value.replace(/,/g,'،').replace(/;/g,'؛').replace(/\?/g,'؟').replace(/ +([،؛؟.!])/g,'$1'); upd(); toast('✅ تم ضبط الترقيم'); });
  $('#btn-fix-quotes')?.addEventListener('click', () => { if (!ta) return; ta.value = ta.value.replace(/"/g,'«»').replace(/''/g,'""').replace(/\.{3,}/g,'…'); upd(); toast('✅ تم توحيد الأقواس'); });
  $('#btn-clean-all')?.addEventListener('click', () => { $('#btn-clean-spaces')?.click(); $('#btn-fix-punct')?.click(); $('#btn-fix-quotes')?.click(); toast('⚡ تم التنقيح الشامل'); });
  $('#btn-copy-proof')?.addEventListener('click', () => { if (ta) navigator.clipboard.writeText(ta.value).then(() => toast('✅ نُسخ النص')); });
  $('#proof-import-file')?.addEventListener('change', async (e) => {
    const f = e.target.files?.[0]; if (!f || !ta) return;
    if (f.name.endsWith('.txt')) { ta.value = await f.text(); upd(); }
    else if (f.name.endsWith('.docx') && window.JSZip) {
      try {
        const zip = await JSZip.loadAsync(f);
        const xml = await zip.file('word/document.xml').async('string');
        ta.value = xml.replace(/<w:p[^>]*>/g,'\n').replace(/<[^>]+>/g,'');
        upd(); toast('✅ تم استيراد الملف');
      } catch (err) { toast('❗ تعذّر قراءة docx'); }
    }
  });
  const items = ['العنوان مطابق للموافقة النهائية','المستخلص بالعربية والإنجليزية','الإهداء والشكر','فهرس المحتويات','قائمة المراجع APA 7','هوامش 3 سم للتجليد','ترقيم الصفحات','فحص الاستلال','مراجعة المشرف','نسخة PDF جاهزة'];
  const host = $('#proof-checklist');
  if (host) {
    host.innerHTML = items.map((it, i) => `<label class="flex items-start gap-2 cursor-pointer"><input type="checkbox" data-chk="${i}" class="mt-0.5 accent-emerald-700" /><span>${it}</span></label>`).join('');
    $$('[data-chk]').forEach(c => c.addEventListener('change', saveState));
  }
}

/* ---------- 22) AI ---------- */
function initAI() {
  const topic = $('#ai-topic-input'), task = $('#ai-task-select');
  if (topic && !topic.value) topic.value = AppState.thesis.titleAr || '';
  const tasks = {
    problem:'صِغ مشكلة بحث علمية دقيقة لموضوع "{topic}"، مضمّنة: (1) واقع المشكلة، (2) أدلتها من دراسات سابقة، (3) الفجوة البحثية، (4) الأسئلة الفرعية. راعِ الأسلوب الأكاديمي الفلسطيني.',
    lit:'قدّم مراجعة أدبيات منهجية لموضوع "{topic}"، تشمل: (1) 5–7 دراسات سابقة حديثة (2020–2025)، (2) مقارنة المنهجيات والعينات، (3) أبرز النتائج، (4) الفجوة البحثية.',
    hypotheses:'اقترح 3–5 فرضيات بحثية لموضوع "{topic}"، مع تحديد: (1) المتغير المستقل، (2) المتغير التابع، (3) المتغيرات الوسيطة/المعدّلة، (4) الأساليب الإحصائية المناسبة.',
    proof:'راجع النص التالي لغوياً وأكاديمياً، وحسّن الصياغة دون تغيير المعنى:\n\n{text}',
    translate:'ترجم النص التالي إلى الإنجليزية الأكاديمية الرصينة المناسبة للنشر في مجلات Scopus:\n\n{text}',
    survey:'صمّم استبانة (مقياس ليكرت الخماسي) لموضوع "{topic}" تشمل: (1) البيانات الديموغرافية، (2) 4–5 محاور رئيسية، (3) 5 فقرات لكل محور.'
  };
  const render = () => {
    const t = topic?.value || 'موضوع البحث';
    const tmpl = tasks[task?.value] || tasks.problem;
    const out = tmpl.replace(/{topic}/g, t).replace(/{text}/g, '[الصق النص هنا]');
    const el = $('#ai-prompt-output'); if (el) el.textContent = out;
  };
  topic?.addEventListener('input', render);
  task?.addEventListener('change', render);
  render();
  $('#btn-copy-prompt')?.addEventListener('click', () => {
    const out = $('#ai-prompt-output');
    if (out) navigator.clipboard.writeText(out.textContent).then(() => toast('✅ نُسخ الأمر'));
  });
  $('#btn-sync-title-ai')?.addEventListener('click', () => {
    if (topic) topic.value = AppState.thesis.titleAr || '';
    render(); toast('✅ تم جلب العنوان');
  });
  const grid = $('#ai-tools-grid');
  if (grid) grid.innerHTML = AI_TOOLS.map(t => `
    <div class="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-400 transition">
      <h3 class="font-extrabold text-slate-900">${t.ar}</h3>
      <p class="text-xs text-slate-600 mt-1 leading-relaxed">${t.use}</p>
      <a href="${t.url}" target="_blank" rel="noopener" class="inline-block mt-2 text-emerald-700 text-xs font-bold hover:underline">فتح الموقع ↗</a>
    </div>`).join('');
}

/* ---------- 23) SOLUTIONS ---------- */
function initSolutions() {
  $$('.stage-btn').forEach(b => b.addEventListener('click', () => {
    $$('.stage-btn').forEach(x => { x.classList.remove('bg-amber-400','text-slate-950'); x.classList.add('bg-white/15','text-white'); });
    b.classList.remove('bg-white/15','text-white'); b.classList.add('bg-amber-400','text-slate-950');
    const st = b.dataset.stage;
    $$('.stage-panel').forEach(p => p.style.display = (st === 'all' || p.dataset.stagePanel === st) ? '' : 'none');
  }));
  initPomodoro();
  $('#btn-gen-schedule')?.addEventListener('click', genSchedule);
  initGPA();
  const calcSample = () => {
    const N = +($('#calc-pop')?.value || 1000);
    const e = +($('#calc-margin')?.value || 0.05);
    const n = Math.ceil(N / (1 + N * e * e));
    const out = $('#calc-sample-out'); if (out) out.textContent = Math.min(n, N) + ' فرداً';
  };
  $('#calc-pop')?.addEventListener('input', calcSample);
  $('#calc-margin')?.addEventListener('change', calcSample);
  calcSample();
  const spss = {
    reliability:'استخدم <strong>ألفا كرونباخ (Cronbach\'s Alpha)</strong> — Analyze > Scale > Reliability Analysis. القيمة المقبولة: ≥ 0.70.',
    diff2:'استخدم <strong>Independent Samples T-Test</strong> — Analyze > Compare Means > Independent-Samples T Test.',
    diff3:'استخدم <strong>One-Way ANOVA</strong> — Analyze > Compare Means > One-Way ANOVA. عند الرفض: Post-Hoc (LSD / Tukey).',
    corr:'استخدم <strong>Pearson Correlation</strong> للبيانات الطبيعية، و<strong>Spearman</strong> للرتبية — Analyze > Correlate > Bivariate.',
    reg:'استخدم <strong>Simple/Multiple Linear Regression</strong> — Analyze > Regression > Linear.',
    nonparam:'استخدم <strong>Mann-Whitney U</strong> بدل T-Test، و<strong>Kruskal-Wallis</strong> بدل ANOVA.'
  };
  $('#spss-goal')?.addEventListener('change', e => {
    const box = $('#spss-advice-box'); if (box) box.innerHTML = spss[e.target.value] || '';
  });
  $('#spss-goal')?.dispatchEvent(new Event('change'));
  $('#btn-school-research')?.addEventListener('click', () => toast('📝 استخدم تبويب "الاستوديو" لإعداد بحث مدرسي منسق'));
  $('#btn-school-summary-prompt')?.addEventListener('click', () => {
    navigator.clipboard.writeText('لخّص الفصل التالي في 10 نقاط + اقترح خريطة ذهنية للفصل:\n\n[الصق النص هنا]');
    toast('✅ نُسخ الأمر');
  });
  $('#btn-copy-term-prompt')?.addEventListener('click', () => {
    const t = $('#uni-term-input')?.value || '';
    navigator.clipboard.writeText(`اشرح المصطلح التالي بمستوى أكاديمي مبسّط، مع مثال تطبيقي، وأصل الكلمة:\n"${t || '[اكتب المصطلح]'}"`);
    toast('✅ نُسخ الأمر');
  });
  initTeamTasks();
  initStatsTable();
}
function initPomodoro() {
  let t = 25 * 60, iv = null, mode = 'study';
  const upd = () => {
    const m = String(Math.floor(t/60)).padStart(2,'0'), s = String(t%60).padStart(2,'0');
    const d = $('#pomo-display'); if (d) d.textContent = `${m}:${s}`;
    const l = $('#pomo-mode-label'); if (l) l.textContent = mode === 'study' ? 'جلسة مذاكرة مركّزة' : 'استراحة قصيرة';
  };
  const setMode = (m) => { mode = m; t = m === 'study' ? 25*60 : 5*60; upd(); };
  $('#btn-pomo-25')?.addEventListener('click', () => setMode('study'));
  $('#btn-pomo-5')?.addEventListener('click', () => setMode('break'));
  $('#btn-pomo-start')?.addEventListener('click', () => {
    if (iv) return;
    iv = setInterval(() => { if (t > 0) { t--; upd(); } else { clearInterval(iv); iv = null; toast('⏰ انتهى الوقت'); } }, 1000);
  });
  $('#btn-pomo-pause')?.addEventListener('click', () => { clearInterval(iv); iv = null; });
  $('#btn-pomo-reset')?.addEventListener('click', () => { clearInterval(iv); iv = null; setMode('study'); });
  upd();
}
function genSchedule() {
  const subs = ($('#sch-subjects')?.value || '').split(/[،,]/).map(s => s.trim()).filter(Boolean);
  const hours = +($('#sch-hours')?.value || 3);
  const days = ['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
  const out = $('#school-schedule-output'); if (!out) return;
  if (!subs.length) { out.innerHTML = '<p class="text-xs text-slate-500">أدخل المواد</p>'; return; }
  out.innerHTML = days.map((d, i) => {
    const sub = subs[i % subs.length], second = subs[(i+1) % subs.length];
    const isFriday = d === 'الجمعة';
    return `<div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
      <p class="font-extrabold text-emerald-900">${d}</p>
      ${isFriday
        ? `<p class="mt-1 text-rose-800 font-bold">راحة كاملة 🌿</p>`
        : `<p class="mt-1"><strong>${sub}</strong> — ${Math.ceil(hours*0.6*60)} د تأسيس</p><p class="text-slate-600">${second} — ${Math.ceil(hours*0.4*60)} د مراجعة</p>`}
    </div>`;
  }).join('');
}
function initGPA() {
  if (!AppState.gpaCourses) AppState.gpaCourses = [];
  const render = () => {
    const list = $('#gpa-courses-list'); if (!list) return;
    list.innerHTML = AppState.gpaCourses.map((c, i) => `
      <div class="flex items-center justify-between gap-2 p-1.5 bg-slate-50 rounded border border-slate-200">
        <span class="flex-1 truncate">${c.name}</span>
        <span class="text-[10px] text-slate-500">${c.credits}س</span>
        <span class="font-bold text-emerald-800">${c.grade}%</span>
        <button type="button" onclick="removeGpaCourse(${i})" class="text-rose-600">×</button>
      </div>`).join('');
    const totalC = AppState.gpaCourses.reduce((s, c) => s + c.credits, 0);
    const totalP = AppState.gpaCourses.reduce((s, c) => s + c.credits * c.grade, 0);
    const avg = totalC ? totalP / totalC : 0;
    const gpa4 = Math.min(4, Math.max(0, (avg - 50) / 12.5));
    const badge = $('#gpa-result-badge'); if (badge) badge.textContent = `${avg.toFixed(1)}% | ${gpa4.toFixed(2)}`;
    const standing = avg >= 90 ? '🌟 ممتاز' : avg >= 80 ? '✅ جيد جداً' : avg >= 70 ? '👍 جيد' : avg >= 60 ? '⚠️ مقبول' : avg > 0 ? '❗ ضعيف' : '';
    const st = $('#gpa-standing'); if (st) st.textContent = standing;
  };
  $('#btn-add-gpa')?.addEventListener('click', () => {
    const name = $('#gpa-course')?.value?.trim();
    const cr = +($('#gpa-credits')?.value || 3);
    const gr = +($('#gpa-grade')?.value || 0);
    if (!name || !gr) { toast('❗ أدخل اسم المساق والعلامة'); return; }
    AppState.gpaCourses.push({ name, credits: cr, grade: gr });
    const el = $('#gpa-course'); if (el) el.value = '';
    render(); saveState();
  });
  window.removeGpaCourse = (i) => { AppState.gpaCourses.splice(i, 1); render(); saveState(); };
  render();
}
function initTeamTasks() {
  if (!AppState.teamTasks) AppState.teamTasks = [];
  const render = () => {
    const list = $('#team-tasks-list'); if (!list) return;
    list.innerHTML = AppState.teamTasks.map((t, i) => `
      <div class="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 text-xs">
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTeamTask(${i})" class="accent-emerald-700" />
        <span class="flex-1 ${t.done ? 'line-through text-slate-400' : ''}"><strong>${t.member}:</strong> ${t.task}</span>
        <button type="button" onclick="removeTeamTask(${i})" class="text-rose-600">×</button>
      </div>`).join('');
    const done = AppState.teamTasks.filter(t => t.done).length;
    const pct = AppState.teamTasks.length ? Math.round(done / AppState.teamTasks.length * 100) : 0;
    const badge = $('#team-progress-badge'); if (badge) badge.textContent = pct + '% مكتمل';
    const bar = $('#team-progress-bar'); if (bar) bar.style.width = pct + '%';
  };
  $('#btn-add-team-task')?.addEventListener('click', () => {
    const m = $('#team-member-in')?.value?.trim(), t = $('#team-task-in')?.value?.trim();
    if (!m || !t) return;
    AppState.teamTasks.push({ member: m, task: t, done: false });
    const el = $('#team-task-in'); if (el) el.value = '';
    render(); saveState();
  });
  window.toggleTeamTask = (i) => { AppState.teamTasks[i].done = !AppState.teamTasks[i].done; render(); saveState(); };
  window.removeTeamTask = (i) => { AppState.teamTasks.splice(i, 1); render(); saveState(); };
  render();
}
function initStatsTable() {
  if (!AppState.statRows || !AppState.statRows.length) AppState.statRows = [
    { label:'المحور الأول: واقع استخدام أدوات الذكاء الاصطناعي', mean:3.82, sd:0.74 },
    { label:'المحور الثاني: جودة المخرجات البحثية', mean:3.65, sd:0.81 },
    { label:'المحور الثالث: التحديات والمعوقات', mean:3.42, sd:0.88 }
  ];
  const render = () => {
    const host = $('#stats-report-preview'); if (!host) return;
    const N = $('#strep-n')?.value || '185', alpha = $('#strep-alpha')?.value || '0.892', r = $('#strep-r')?.value || '0.742';
    const means = AppState.statRows.map(x => x.mean);
    host.innerHTML = `
      <h2 class="text-xl font-extrabold text-emerald-900 border-b-2 border-emerald-900 pb-2 text-center">الفصل الرابع: نتائج الدراسة</h2>
      <div class="space-y-4 text-sm leading-relaxed text-slate-800 mt-4">
        <p><strong>4.1 منهجية التحليل:</strong> تم استخدام برنامج <strong>SPSS v26</strong>، على عينة قوامها <strong>${N}</strong> مفردة. بلغ معامل الثبات <strong>ألفا كرونباخ (${alpha})</strong>، وهو معامل مقبول إحصائياً.</p>
        <p><strong>4.2 نتائج السؤال الرئيس:</strong> أظهرت نتائج التحليل أن المتوسطات الحسابية للمحاور تراوحت بين (${Math.min(...means).toFixed(2)}) و(${Math.max(...means).toFixed(2)}).</p>
        <p><strong>4.3 معامل الارتباط:</strong> بلغ معامل ارتباط بيرسون بين المتغيرين <strong>r = ${r}</strong>، وهو دال إحصائياً عند مستوى (α ≤ 0.05).</p>
        <h3 class="font-extrabold text-emerald-900 mt-4">جدول (1): المتوسطات الحسابية والانحرافات المعيارية</h3>
        <table class="w-full border-collapse text-xs">
          <thead class="bg-emerald-800 text-white"><tr><th class="border border-emerald-900 p-2 text-right">الفقرة / المحور</th><th class="border border-emerald-900 p-2">المتوسط</th><th class="border border-emerald-900 p-2">الانحراف</th><th class="border border-emerald-900 p-2">الدرجة</th></tr></thead>
          <tbody>${AppState.statRows.map(row => `<tr class="hover:bg-emerald-50"><td class="border border-slate-300 p-2 text-right">${row.label}</td><td class="border border-slate-300 p-2 text-center">${row.mean.toFixed(2)}</td><td class="border border-slate-300 p-2 text-center">${row.sd.toFixed(2)}</td><td class="border border-slate-300 p-2 text-center">${row.mean >= 3.5 ? 'مرتفعة' : row.mean >= 2.5 ? 'متوسطة' : 'منخفضة'}</td></tr>`).join('')}</tbody>
        </table>
        <p><strong>4.4 التوصيات:</strong> بناءً على النتائج، توصي الدراسة بـ: (1) تعزيز الوعي بأدوات الذكاء الاصطناعي، (2) إصدار دليل استرشادي من عمادة الدراسات العليا، (3) إجراء دراسات مستقبلية على متغيرات إضافية.</p>
      </div>`;
  };
  $('#btn-add-stat-row')?.addEventListener('click', () => {
    const label = $('#strow-label')?.value?.trim();
    const mean = +($('#strow-mean')?.value || 0);
    const sd = +($('#strow-sd')?.value || 0);
    if (!label || !mean) return;
    AppState.statRows.push({ label, mean, sd });
    ['strow-label','strow-mean','strow-sd'].forEach(id => { const el = $('#'+id); if (el) el.value = ''; });
    render(); saveState(); toast('✅ أُضيف الصف');
  });
  $('#btn-calc-raw')?.addEventListener('click', () => {
    const raw = ($('#stat-raw-input')?.value || '').split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (!raw.length) return;
    const mean = raw.reduce((a, b) => a + b, 0) / raw.length;
    const sd = Math.sqrt(raw.reduce((a, b) => a + (b - mean) ** 2, 0) / raw.length);
    const out = $('#stat-raw-result');
    if (out) out.innerHTML = `المتوسط = <strong>${mean.toFixed(2)}</strong> — الانحراف = <strong>${sd.toFixed(2)}</strong> — n = <strong>${raw.length}</strong>`;
  });
  ['strep-n','strep-alpha','strep-r'].forEach(id => $('#'+id)?.addEventListener('input', render));
  render();
}

/* ---------- 24) EXPORT ---------- */
function exportJSON() {
  const blob = new Blob([JSON.stringify(AppState, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `pgh-backup-${Date.now()}.json`; a.click();
  URL.revokeObjectURL(url); toast('💾 تم حفظ المشروع');
}
function importJSON(e) {
  const f = e.target.files?.[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try { Object.assign(AppState, JSON.parse(ev.target.result)); location.reload(); }
    catch (err) { toast('❗ ملف غير صالح'); }
  };
  r.readAsText(f);
}
function exportWord() {
  const t = AppState.thesis;
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>body{font-family:'Amiri','Traditional Arabic',serif;direction:rtl;font-size:16pt;line-height:1.5;padding:2.5cm;}h1,h2{color:#0f4c3a;text-align:center;}h1{font-size:22pt;}h2{font-size:18pt;margin-top:30px;}.cover{text-align:center;page-break-after:always;}.page{page-break-after:always;}</style></head><body>
    <div class="cover"><p>${t.uniAr||''}</p><p>${t.facultyAr||''}</p><h1>${t.titleAr||''}</h1><p><em>${t.titleEn||''}</em></p><p>رسالة مقدمة لنيل درجة ${degreeLabel(t.docType)}</p><p>إعداد: <strong>${t.studentAr||''}</strong></p><p>إشراف: <strong>${t.supervisorAr||''}</strong></p><p>${t.yearAr||''}</p></div>
    <div class="page"><h2>الإهداء</h2><p>${(t.dedication||'').replace(/\n/g,'<br>')}</p></div>
    <div class="page"><h2>شكر وتقدير</h2><p>${(t.ack||'').replace(/\n/g,'<br>')}</p></div>
    <div class="page"><h2>الملخص</h2><p>${(t.abstractAr||'').replace(/\n/g,'<br>')}</p></div>
    <div class="page" dir="ltr"><h2>Abstract</h2><p>${(t.abstractEn||'').replace(/\n/g,'<br>')}</p></div>
    <div class="page"><h2>مشكلة البحث</h2><p>${(t.problem||'').replace(/\n/g,'<br>')}</p></div>
    <div class="page"><h2>الدراسات السابقة</h2>${AppState.studies.map((s, i) => `<p>${i+1}. ${apaFormat(s)}</p>`).join('')}</div>
    <div class="page"><h2>المراجع</h2>${AppState.studies.map(s => `<p>${apaFormat(s)}</p>`).join('')}</div>
    </body></html>`;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `thesis-${Date.now()}.doc`; a.click();
  URL.revokeObjectURL(url); toast('📄 تم تصدير Word');
}
function exportCertWord() {
  const host = $('#cert-preview-host'); if (!host) return;
  const html = `<html dir="rtl"><head><meta charset="utf-8"><style>body{font-family:'Amiri',serif;text-align:center;padding:3cm;font-size:18pt;}h1{color:#0f4c3a;}</style></head><body>${host.innerHTML}</body></html>`;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `certificate-${Date.now()}.doc`; a.click();
  URL.revokeObjectURL(url); toast('📄 تم تصدير الشهادة');
}
function exportKitWord() {
  const host = $('#kit-event-preview'); if (!host) return;
  const html = `<html dir="rtl"><head><meta charset="utf-8"><style>body{font-family:'Amiri',serif;padding:2cm;font-size:14pt;}</style></head><body>${host.innerHTML}</body></html>`;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `kit-${Date.now()}.doc`; a.click();
  URL.revokeObjectURL(url); toast('📄 تم تصدير الحقيبة');
}

/* ---------- 25) SW REGISTRATION ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}
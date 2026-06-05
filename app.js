// ================= GLOBAL APP STATE =================
let state = {
    currentUser: null,
    users: [],
    notices: [],
    questions: [],
    submissions: [],
    studyMaterials: []
};

// Subject Config & Theme Colors
const SUBJECT_COLORS = {
    'Mathematics': '#6366f1', // Indigo
    'Physics': '#06b6d4',     // Cyan
    'Chemistry': '#10b981',   // Emerald
    'English': '#f59e0b',     // Amber
    'Biology': '#f43f5e'      // Rose
};

// Default Admin/Teacher Credential
const DEFAULT_TEACHER = {
    name: 'Fahim',
    password: '2230099@iub',
    role: 'teacher',
    status: 'approved'
};

// ================= UTILITIES: TOASTS =================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    let icon = '';
    if (type === 'success') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else if (type === 'error') {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Remove toast after 4s
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3700);
}

// Convert string to base64 for preloaded mocks
function strToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// Convert base64 to string
function base64ToStr(str) {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch(e) {
        return 'Binary file format preview not supported. Use the Download option to save.';
    }
}

// ================= INITIAL DATA & MOCKS =================
function initializeData() {
    const saved = localStorage.getItem('edugrade_portal_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
            // Remove old default teacher account if it exists
            state.users = state.users.filter(u => u.name !== 'teacher');
            // Ensure the updated teacher user is present
            if (!state.users.find(u => u.name === DEFAULT_TEACHER.name)) {
                state.users.push(DEFAULT_TEACHER);
            }
            saveState();
            return;
        } catch(e) {
            console.error('Error parsing stored state, resetting mocks.', e);
        }
    }

    // Prepopulate system with beautiful mock data
    const mockUsers = [
        DEFAULT_TEACHER,
        {
            name: 'student1',
            password: 'pass123',
            phone: '+8801711112233',
            college: 'Dhaka College',
            address: 'Dhanmondi, Dhaka',
            role: 'student',
            status: 'approved'
        },
        {
            name: 'student2',
            password: 'pass123',
            phone: '+8801822233444',
            college: 'Rajshahi College',
            address: 'Shorok Para, Rajshahi',
            role: 'student',
            status: 'approved'
        },
        {
            name: 'student3',
            password: 'pass123',
            phone: '+8801933344555',
            college: 'Chittagong College',
            address: 'Halishahar, Chittagong',
            role: 'student',
            status: 'pending'
        }
    ];

    const mockQuestions = [
        {
            id: 'q_1',
            title: 'Calculus and Limits Midterm Exam',
            subject: 'Mathematics',
            desc: 'Answer all 4 questions on paper. Upload completed script inside PDF format.',
            fileName: 'Math_Midterm_Questions.txt',
            fileData: strToBase64('EDUGRADE MATH EVALUATION\n\n1. Find the limit of (x^2 - 4) / (x - 2) as x approaches 2.\n2. Evaluate the integral of (3x^2 + 2x + 1) dx from 0 to 3.\n3. Solve the first-order differential equation dy/dx - 2y = e^(3x).\n4. Prove that the derivative of sin(x) is cos(x) using first principles.'),
            date: '2026-06-01'
        },
        {
            id: 'q_2',
            title: 'Classical Mechanics & Motion Paper',
            subject: 'Physics',
            desc: 'Detailed examination on Newton\'s laws, kinematics, and torque vectors.',
            fileName: 'Physics_Mechanics_Final.txt',
            fileData: strToBase64('EDUGRADE PHYSICS DEPARTMENT\n\n1. A projectile is launched from ground level with an initial velocity of 30 m/s at an angle of 45 degrees. Calculate range and max height.\n2. State Newton\'s three laws of motion and describe a dynamic experiment to verify the second law.\n3. Derive the rotational kinetic energy of a solid sphere rotating about its diameter.'),
            date: '2026-06-02'
        }
    ];

    const mockSubmissions = [
        {
            id: 'sub_1',
            questionId: 'q_1',
            studentName: 'student1',
            fileName: 'student1_math_solved.txt',
            fileData: strToBase64('STUDENT1 ANSWER SHEET - MATHEMATICS\n\nQ1 Solution:\n(x^2 - 4)/(x - 2) = (x-2)(x+2)/(x-2) = x + 2.\nLimit as x -> 2 is 2 + 2 = 4.\n\nQ2 Solution:\nIntegral of (3x^2 + 2x + 1) dx from 0 to 3 = [x^3 + x^2 + x] from 0 to 3\n= (27 + 9 + 3) - 0 = 39.\n\nQ3 Solution:\nIntegrating factor = e^Integral(-2dx) = e^(-2x).\nHence d/dx [ y*e^(-2x) ] = e^(3x)*e^(-2x) = e^x.\ny*e^(-2x) = e^x + C => y = e^(3x) + C*e^(2x).'),
            date: '2026-06-01 10:14 AM',
            status: 'graded',
            marks: 92,
            comment: 'Outstanding calculations. Step-by-step logic was clear, showing great command over Calculus limits and differential solutions.'
        },
        {
            id: 'sub_2',
            questionId: 'q_1',
            studentName: 'student2',
            fileName: 'student2_math_midterm.txt',
            fileData: strToBase64('STUDENT2 ANSWERS - MATHEMATICS\n\nQ1: Limit is 4 (factored numerator correctly).\nQ2: [x^3 + x^2] from 0 to 3 = 27 + 9 = 36 (forgot the x term integration)...\nQ3: Could not integrate the differential eq.\nQ4: Used standard rule but did not explain first principles.'),
            date: '2026-06-01 11:45 AM',
            status: 'graded',
            marks: 68,
            comment: 'Incomplete integration for Question 2 and missed Q3 entirely. Please review integrating factor rules and limits definition.'
        },
        {
            id: 'sub_3',
            questionId: 'q_2',
            studentName: 'student1',
            fileName: 'student1_physics_mech.txt',
            fileData: strToBase64('STUDENT1 PHYSICS PAPER\n\nQ1 kinematic trajectory equations:\nRange = (v^2 * sin(2*theta)) / g = (900 * sin(90)) / 9.8 = 91.8 meters.\nMax Height = (v^2 * sin^2(theta)) / (2g) = (900 * 0.5) / 19.6 = 22.95 meters.'),
            date: '2026-06-02 03:22 PM',
            status: 'submitted',
            marks: '',
            comment: ''
        }
    ];

    const mockNotices = [
        {
            id: 'not_1',
            title: 'Syllabus and Grading Criteria Guidelines',
            category: 'General',
            date: '2026-05-30',
            content: 'Welcome to the EduGrade portal. Exams will be graded on a 0-100 scale. Answer scripts must be uploaded as clear PDFs or TXT files. Delayed submissions will receive automatic deductions.'
        },
        {
            id: 'not_2',
            title: 'Upcoming Physics Kinematics Review Class',
            category: 'Exam',
            date: '2026-06-02',
            content: 'Ahead of the Physics Mechanics papers evaluation, an optional review lecture on Kinematics and torque vectors will take place online on Thursday at 2:00 PM.'
        }
    ];

    const mockMaterials = [
        {
            id: 'mat_1',
            title: 'Calculus Theorems & Formulas Cheat Sheet',
            subject: 'Mathematics',
            desc: 'Quick reference reference for Derivatives, Integrations, and L\'Hopital\'s rules.',
            fileName: 'Math_Calculus_Formulas.pdf',
            fileData: strToBase64('EDUGRADE REFERENCE SHEETS\n\nCalculus formulas:\nd/dx (sin x) = cos x\nd/dx (cos x) = -sin x\nIntegral x^n dx = (x^(n+1))/(n+1) + C\nLimit definition: f\'(x) = lim h->0 (f(x+h) - f(x))/h')
        },
        {
            id: 'mat_2',
            title: 'Kinematics Vector Components Guide',
            subject: 'Physics',
            desc: 'Detailed vectors calculations for two-dimensional trajectories.',
            fileName: 'Physics_Vectors_Notes.txt',
            fileData: strToBase64('PHYSICS STUDY NOTES: Trajectory analysis\n\nHorizontal velocity component: Vx = V0 * cos(theta)\nVertical velocity component: Vy = V0 * sin(theta) - g*t\nHorizontal position: x = V0 * cos(theta) * t\nVertical position: y = V0 * sin(theta) * t - 0.5 * g * t^2')
        }
    ];

    state = {
        currentUser: null,
        users: mockUsers,
        questions: mockQuestions,
        submissions: mockSubmissions,
        notices: mockNotices,
        studyMaterials: mockMaterials
    };

    saveState();
}

function saveState() {
    localStorage.setItem('edugrade_portal_state', JSON.stringify(state));
}

// ================= SYSTEM INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setupEventListeners();
    checkActiveSession();
    updateDateDisplay();
});

function updateDateDisplay() {
    const d = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const text = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    const elem = document.getElementById('top-bar-date');
    if (elem) elem.textContent = text;
}

function checkActiveSession() {
    const savedSession = sessionStorage.getItem('edugrade_active_user');
    if (savedSession) {
        const u = JSON.parse(savedSession);
        loginUser(u);
    } else {
        showAuthSection();
    }
}

// ================= AUTH LOGIC =================
let loginRole = 'student';

function setLoginRole(role) {
    loginRole = role;
    document.getElementById('login-role').value = role;
    
    // Toggle active classes
    const studentBtn = document.getElementById('tab-login-student');
    const teacherBtn = document.getElementById('tab-login-teacher');
    
    if (role === 'student') {
        studentBtn.classList.add('active');
        teacherBtn.classList.remove('active');
        document.getElementById('login-name').placeholder = "Enter your registered name";
    } else {
        studentBtn.classList.remove('active');
        teacherBtn.classList.add('active');
        document.getElementById('login-name').placeholder = "Enter admin username";
    }
}

function showAuthCard(cardType) {
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');
    
    if (cardType === 'login') {
        loginCard.classList.remove('hidden');
        registerCard.classList.add('hidden');
    } else {
        loginCard.classList.add('hidden');
        registerCard.classList.remove('hidden');
    }
}

function showAuthSection() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    state.currentUser = null;
    sessionStorage.removeItem('edugrade_active_user');
}

function loginUser(user) {
    state.currentUser = user;
    sessionStorage.setItem('edugrade_active_user', JSON.stringify(user));
    
    // UI Update
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
    
    document.getElementById('sidebar-name').textContent = user.name;
    document.getElementById('sidebar-role').textContent = user.role === 'teacher' ? 'Admin / Teacher' : 'Student';
    
    // Menu visibility
    const teacherMenu = document.getElementById('teacher-menu');
    const studentMenu = document.getElementById('student-menu');
    
    if (user.role === 'teacher') {
        teacherMenu.classList.remove('hidden');
        studentMenu.classList.add('hidden');
        setupMenuNavigation('teacher-menu');
        switchPane('pane-teacher-overview');
    } else {
        teacherMenu.classList.add('hidden');
        studentMenu.classList.remove('hidden');
        setupMenuNavigation('student-menu');
        switchPane('pane-student-overview');
    }
}

let paneHistory = [];

function logout() {
    showToast('Logged out successfully.', 'info');
    paneHistory = [];
    document.getElementById('back-btn').classList.add('hidden');
    showAuthSection();
}

// ================= ROUTING: TABS AND PANES =================
function setupMenuNavigation(menuId) {
    const menu = document.getElementById(menuId);
    const items = menu.querySelectorAll('.sidebar-menu-item');
    
    items.forEach(item => {
        item.onclick = function() {
            // Remove active classes
            items.forEach(i => i.classList.remove('active'));
            
            // Add active class
            item.classList.add('active');
            
            // Switch pane
            const targetPane = item.getAttribute('data-pane');
            switchPane(targetPane);
        };
    });
}

function switchPane(paneId, saveToHistory = true) {
    const currentPane = getCurrentPaneId();

    if (paneId === 'pane-teacher-overview' || paneId === 'pane-student-overview') {
        paneHistory = [];
        document.getElementById('back-btn').classList.add('hidden');
    } else if (saveToHistory && currentPane && currentPane !== paneId) {
        if (paneHistory[paneHistory.length - 1] !== currentPane) {
            paneHistory.push(currentPane);
        }
        document.getElementById('back-btn').classList.remove('hidden');
    }

    // Hide all views
    document.querySelectorAll('.content-pane-view').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show active pane
    const target = document.getElementById(paneId);
    if (target) {
        target.classList.remove('hidden');
    }
    
    // Update Header title
    const headerTitle = document.getElementById('current-pane-title');
    if (headerTitle) {
        headerTitle.textContent = getPaneTitle(paneId);
    }
    
    // Sync active class highlight in the sidebar
    syncSidebarActiveState(paneId);
    
    // Render corresponding pane data
    renderPaneData(paneId);
}

function syncSidebarActiveState(paneId) {
    const activeMenu = state.currentUser && state.currentUser.role === 'teacher' ? 'teacher-menu' : 'student-menu';
    const menu = document.getElementById(activeMenu);
    if (!menu) return;
    
    const items = menu.querySelectorAll('.sidebar-menu-item');
    items.forEach(item => {
        if (item.getAttribute('data-pane') === paneId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function goBack() {
    if (paneHistory.length > 0) {
        const prevPane = paneHistory.pop();
        switchPane(prevPane, false);
        
        if (paneHistory.length === 0) {
            document.getElementById('back-btn').classList.add('hidden');
        }
    } else {
        document.getElementById('back-btn').classList.add('hidden');
    }
}

function getPaneTitle(paneId) {
    switch (paneId) {
        case 'pane-teacher-overview': return 'Teacher Dashboard';
        case 'pane-teacher-requests': return 'Student Requests';
        case 'pane-teacher-students': return 'Registered Students';
        case 'pane-teacher-notices': return 'Announcements Board';
        case 'pane-teacher-questions': return 'Upload Exam Questions';
        case 'pane-teacher-grader': return 'Student Answer Scripts';
        case 'pane-teacher-materials': return 'Upload Lecture Guides';
        case 'pane-teacher-analytics': return 'Class Performance Graphs';
        
        case 'pane-student-overview': return 'Student Dashboard';
        case 'pane-student-list': return 'Peers Directory';
        case 'pane-student-questions': return 'Exams & Question Papers';
        case 'pane-student-submissions': return 'My Grades & Submissions';
        case 'pane-student-materials': return 'Study Guides Library';
        case 'pane-student-notices': return 'Class Announcements';
        case 'pane-student-analytics': return 'My Progress Graphs';
        default: return 'Portal';
    }
}

// Render data based on current active tab
function renderPaneData(paneId) {
    // Refresh global counters/badges
    updateBadges();

    switch (paneId) {
        case 'pane-teacher-overview':
            renderTeacherOverview();
            break;
        case 'pane-teacher-requests':
            renderTeacherRequests();
            break;
        case 'pane-teacher-students':
            renderTeacherStudents();
            break;
        case 'pane-teacher-notices':
            renderTeacherNotices();
            break;
        case 'pane-teacher-questions':
            renderTeacherQuestions();
            break;
        case 'pane-teacher-grader':
            renderTeacherGrader();
            break;
        case 'pane-teacher-materials':
            renderTeacherMaterials();
            break;
        case 'pane-teacher-analytics':
            renderTeacherAnalytics();
            break;
            
        case 'pane-student-overview':
            renderStudentOverview();
            break;
        case 'pane-student-list':
            renderStudentList();
            break;
        case 'pane-student-questions':
            renderStudentQuestions();
            break;
        case 'pane-student-submissions':
            renderStudentSubmissions();
            break;
        case 'pane-student-materials':
            renderStudentMaterials();
            break;
        case 'pane-student-notices':
            renderStudentNotices();
            break;
        case 'pane-student-analytics':
            renderStudentAnalytics();
            break;
    }
}

function updateBadges() {
    const pendingCount = state.users.filter(u => u.role === 'student' && u.status === 'pending').length;
    const badge = document.getElementById('badge-requests-count');
    if (badge) {
        if (pendingCount > 0) {
            badge.textContent = pendingCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

// ================= EVEN LISTENER BINDINGS =================
let uploadedQuestionFile = null;
let uploadedMaterialFile = null;
let uploadedScriptFile = null;

function setupEventListeners() {
    // Auth Forms
    document.getElementById('login-form').onsubmit = handleLogin;
    document.getElementById('register-form').onsubmit = handleRegister;

    // File Drag & Drop logic
    setupFilePicker('question-file-input', 'question-upload-zone', 'question-file-success', 'question-file-name', (file) => {
        uploadedQuestionFile = file;
    });
    
    setupFilePicker('material-file-input', 'material-upload-zone', 'material-file-success', 'material-file-name', (file) => {
        uploadedMaterialFile = file;
    });

    setupFilePicker('script-file-input', 'script-upload-zone', 'script-file-success', 'script-file-name', (file) => {
        uploadedScriptFile = file;
    });

    // Form Submissions
    document.getElementById('publish-notice-form').onsubmit = handlePublishNotice;
    document.getElementById('upload-question-form').onsubmit = handleUploadQuestion;
    document.getElementById('upload-material-form').onsubmit = handleUploadMaterial;
    document.getElementById('grader-submit-form').onsubmit = handleGraderSubmit;
    document.getElementById('student-submit-script-form').onsubmit = handleStudentScriptSubmit;
}

function setupFilePicker(inputId, zoneId, successId, nameId, callback) {
    const input = document.getElementById(inputId);
    const zone = document.getElementById(zoneId);
    const successDiv = document.getElementById(successId);
    const nameSpan = document.getElementById(nameId);

    if (!input || !zone) return;

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            successDiv.classList.remove('hidden');
            nameSpan.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            callback(file);
        }
    };

    zone.ondragover = (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--primary)';
        zone.style.background = 'rgba(99, 102, 241, 0.05)';
    };

    zone.ondragleave = (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--border-color)';
        zone.style.background = 'transparent';
    };

    zone.ondrop = (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--border-color)';
        zone.style.background = 'transparent';
        
        const file = e.dataTransfer.files[0];
        if (file) {
            input.files = e.dataTransfer.files;
            successDiv.classList.remove('hidden');
            nameSpan.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            callback(file);
        }
    };
}

// Reset File pickers UI
function resetFilePicker(successId, nameId) {
    document.getElementById(successId).classList.add('hidden');
    document.getElementById(nameId).textContent = '';
}

// ================= AUTH FORM PROCESSORS =================
function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById('login-name').value.trim();
    const pass = document.getElementById('login-password').value;
    
    if (loginRole === 'teacher') {
        if (name === DEFAULT_TEACHER.name && pass === DEFAULT_TEACHER.password) {
            showToast('Welcome Teacher/Admin!', 'success');
            loginUser(DEFAULT_TEACHER);
            document.getElementById('login-form').reset();
        } else {
            showToast('Invalid Teacher credentials.', 'error');
        }
    } else {
        const student = state.users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.role === 'student');
        if (!student) {
            showToast('User not found. Check name spelling or register.', 'error');
            return;
        }
        
        if (student.password !== pass) {
            showToast('Incorrect password.', 'error');
            return;
        }

        if (student.status === 'pending') {
            showToast('Login blocked: Registration is pending Admin approval.', 'warning');
            return;
        }

        showToast(`Welcome back, ${student.name}!`, 'success');
        loginUser(student);
        document.getElementById('login-form').reset();
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const college = document.getElementById('reg-college').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const password = document.getElementById('reg-password').value;

    // Check duplicate name
    const exists = state.users.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        showToast('A user with this name already exists.', 'error');
        return;
    }

    const newUser = {
        name, phone, college, address, password,
        role: 'student',
        status: 'pending'
    };

    state.users.push(newUser);
    saveState();
    showToast('Registration request sent to Admin successfully!', 'success');
    
    document.getElementById('register-form').reset();
    showAuthCard('login');
}

// ================= TEACHER DASHBOARD LOGIC =================
function renderTeacherOverview() {
    const studentsCount = state.users.filter(u => u.role === 'student' && u.status === 'approved').length;
    const pendingCount = state.users.filter(u => u.role === 'student' && u.status === 'pending').length;
    const questionsCount = state.questions.length;
    const subCount = state.submissions.length;

    document.getElementById('stat-teacher-students').textContent = studentsCount;
    document.getElementById('stat-teacher-pending').textContent = pendingCount;
    document.getElementById('stat-teacher-submissions').textContent = subCount;
    document.getElementById('stat-teacher-questions').textContent = questionsCount;

    // Render list summaries
    const pendingRequests = state.users.filter(u => u.role === 'student' && u.status === 'pending').slice(0, 3);
    const overviewRequests = document.getElementById('teacher-overview-requests-list');
    
    if (pendingRequests.length === 0) {
        overviewRequests.innerHTML = `<div class="empty-state" style="padding: 10px 0;"><p>No pending approvals</p></div>`;
    } else {
        overviewRequests.innerHTML = pendingRequests.map(r => `
            <div class="flex-between" style="padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                <div>
                    <div style="font-weight: 500;">${r.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${r.college}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary btn-sm" onclick="approveStudent('${r.name}')">Approve</button>
                </div>
            </div>
        `).join('');
    }

    const pendingGrades = state.submissions.filter(s => s.status === 'submitted').slice(0, 3);
    const overviewSubmissions = document.getElementById('teacher-overview-submissions-list');
    
    if (pendingGrades.length === 0) {
        overviewSubmissions.innerHTML = `<div class="empty-state" style="padding: 10px 0;"><p>No scripts pending grading</p></div>`;
    } else {
        overviewSubmissions.innerHTML = pendingGrades.map(s => {
            const q = state.questions.find(qy => qy.id === s.questionId) || {};
            return `
                <div class="flex-between" style="padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <div style="font-weight: 500;">${s.studentName}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${q.title || 'Unknown Exam'} (${q.subject || ''})</div>
                    </div>
                    <button class="btn btn-accent btn-sm" onclick="openGraderModal('${s.id}')">Grade</button>
                </div>
            `;
        }).join('');
    }
}

function renderTeacherRequests() {
    const list = state.users.filter(u => u.role === 'student' && u.status === 'pending');
    const table = document.getElementById('teacher-requests-table');
    const tbody = table.querySelector('tbody');
    const empty = document.getElementById('requests-empty');

    tbody.innerHTML = '';

    if (list.length === 0) {
        table.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        table.classList.remove('hidden');
        empty.classList.add('hidden');

        list.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 500;">${r.name}</td>
                <td>${r.phone}</td>
                <td>${r.college}</td>
                <td>${r.address}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-primary btn-sm" onclick="approveStudent('${r.name}')">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="rejectStudent('${r.name}')">Reject</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function approveStudent(username) {
    const user = state.users.find(u => u.name === username && u.role === 'student');
    if (user) {
        user.status = 'approved';
        saveState();
        showToast(`Registration request from ${username} approved!`, 'success');
        renderPaneData(getCurrentPaneId());
    }
}

function rejectStudent(username) {
    if (confirm(`Are you sure you want to reject registration from ${username}?`)) {
        state.users = state.users.filter(u => u.name !== username);
        saveState();
        showToast(`Registration request from ${username} rejected.`, 'info');
        renderPaneData(getCurrentPaneId());
    }
}

function renderTeacherStudents() {
    const list = state.users.filter(u => u.role === 'student' && u.status === 'approved');
    const table = document.getElementById('teacher-students-table');
    const tbody = table.querySelector('tbody');
    const empty = document.getElementById('students-empty');

    tbody.innerHTML = '';

    if (list.length === 0) {
        table.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        table.classList.remove('hidden');
        empty.classList.add('hidden');

        list.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 500;">${s.name}</td>
                <td>${s.phone}</td>
                <td>${s.college}</td>
                <td>${s.address}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function renderTeacherNotices() {
    const list = [...state.notices].reverse();
    const container = document.getElementById('teacher-notices-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No announcements published yet.</p></div>`;
        return;
    }

    list.forEach(n => {
        const item = document.createElement('div');
        item.className = 'glass-card notice-item';
        item.innerHTML = `
            <div class="flex-between" style="align-items: flex-start;">
                <div>
                    <div class="notice-meta">
                        <span class="notice-tag">${n.category}</span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                            ${n.date}
                        </span>
                    </div>
                    <div class="notice-title">${n.title}</div>
                    <div class="notice-excerpt">${n.content}</div>
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteNotice('${n.id}')" style="margin-left: 15px;">Delete</button>
            </div>
        `;
        // Exclude details reader popups for deleting buttons
        item.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') {
                openNoticeModal(n);
            }
        };
        container.appendChild(item);
    });
}

function handlePublishNotice(e) {
    e.preventDefault();
    const title = document.getElementById('notice-input-title').value.trim();
    const category = document.getElementById('notice-input-category').value;
    const content = document.getElementById('notice-input-content').value.trim();
    
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    const newNotice = {
        id: `not_${Date.now()}`,
        title, category, content,
        date: dateStr
    };

    state.notices.push(newNotice);
    saveState();
    showToast('Notice published successfully!', 'success');
    
    document.getElementById('publish-notice-form').reset();
    renderTeacherNotices();
}

function deleteNotice(id) {
    if (confirm('Delete this notice announcement?')) {
        state.notices = state.notices.filter(n => n.id !== id);
        saveState();
        showToast('Notice deleted.', 'info');
        renderTeacherNotices();
    }
}

function renderTeacherQuestions() {
    const list = state.questions;
    const container = document.getElementById('teacher-questions-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No question papers uploaded.</p></div>`;
        return;
    }

    list.forEach(q => {
        const card = document.createElement('div');
        card.className = 'glass-card item-card';
        card.innerHTML = `
            <div>
                <div class="item-subject" style="color: ${SUBJECT_COLORS[q.subject] || '#fff'}">${q.subject}</div>
                <div class="item-title">${q.title}</div>
                <div class="item-desc">${q.desc}</div>
            </div>
            <div class="item-footer">
                <span class="item-date">${q.date}</span>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" onclick="previewFile('${q.fileData}', '${q.fileName}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Preview
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteQuestion('${q.id}')">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function handleUploadQuestion(e) {
    e.preventDefault();
    const title = document.getElementById('question-input-title').value.trim();
    const subject = document.getElementById('question-input-subject').value;
    const desc = document.getElementById('question-input-desc').value.trim();
    
    if (!uploadedQuestionFile) {
        showToast('Please select a file to upload.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64 = evt.target.result.split(',')[1];
        
        const d = new Date();
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

        const newQ = {
            id: `q_${Date.now()}`,
            title, subject, desc,
            fileName: uploadedQuestionFile.name,
            fileData: base64,
            date: dateStr
        };

        state.questions.push(newQ);
        saveState();
        showToast('Question paper published successfully!', 'success');

        uploadedQuestionFile = null;
        document.getElementById('upload-question-form').reset();
        resetFilePicker('question-file-success', 'question-file-name');
        renderTeacherQuestions();
    };
    reader.readAsDataURL(uploadedQuestionFile);
}

function deleteQuestion(id) {
    if (confirm('Delete this question paper? Doing so will delete student scripts connected to it.')) {
        state.questions = state.questions.filter(q => q.id !== id);
        state.submissions = state.submissions.filter(s => s.questionId !== id);
        saveState();
        showToast('Question deleted.', 'info');
        renderTeacherQuestions();
    }
}

function renderTeacherGrader() {
    const list = state.submissions;
    const table = document.getElementById('teacher-grader-table');
    const tbody = table.querySelector('tbody');
    const empty = document.getElementById('grader-empty');

    tbody.innerHTML = '';

    if (list.length === 0) {
        table.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        table.classList.remove('hidden');
        empty.classList.add('hidden');

        list.forEach(s => {
            const q = state.questions.find(qy => qy.id === s.questionId) || { title: 'Deleted Question', subject: 'General' };
            const isGraded = s.status === 'graded';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 500;">${s.studentName}</td>
                <td style="color: ${SUBJECT_COLORS[q.subject] || '#fff'}; font-weight: 500;">${q.subject}</td>
                <td>${q.title}</td>
                <td>${s.date}</td>
                <td>
                    <span class="badge badge-${s.status}">${s.status}</span>
                </td>
                <td style="font-weight: 600;">${isGraded ? s.marks + '/100' : '—'}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="openGraderModal('${s.id}')">
                        ${isGraded ? 'Review / Edit' : 'Evaluate & Grade'}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function openGraderModal(subId) {
    const s = state.submissions.find(sub => sub.id === subId);
    if (!s) return;

    const q = state.questions.find(qy => qy.id === s.questionId) || { title: 'Deleted Question' };

    document.getElementById('grader-submission-id').value = s.id;
    document.getElementById('grader-student-name').textContent = s.studentName;
    document.getElementById('grader-exam-title').textContent = `${q.title} (${q.subject})`;
    
    // Set marks and comments if already graded
    document.getElementById('grade-input-marks').value = s.marks || '';
    document.getElementById('grade-input-comments').value = s.comment || '';

    // Render Answer sheet pane
    const display = document.getElementById('grader-script-display');
    const isText = s.fileName.endsWith('.txt');
    const fileStr = base64ToStr(s.fileData);

    if (isText) {
        display.innerHTML = `<pre class="file-text-preview">${escapeHtml(fileStr)}</pre>`;
    } else {
        // PDF simulation card
        display.innerHTML = `
            <div class="pdf-simulation-card">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                <h4>${s.fileName}</h4>
                <p>Simulated Document script uploaded by student.</p>
                <a class="btn btn-secondary btn-sm" href="data:application/octet-stream;base64,${s.fileData}" download="${s.fileName}">Download Script to Read</a>
            </div>
        `;
    }

    openModal('grader-modal');
}

function handleGraderSubmit(e) {
    e.preventDefault();
    const subId = document.getElementById('grader-submission-id').value;
    const marks = parseInt(document.getElementById('grade-input-marks').value);
    const comment = document.getElementById('grade-input-comments').value.trim();

    const s = state.submissions.find(sub => sub.id === subId);
    if (s) {
        s.marks = marks;
        s.comment = comment;
        s.status = 'graded';
        
        saveState();
        showToast('Submission graded successfully!', 'success');
        closeModal('grader-modal');
        renderPaneData(getCurrentPaneId());
    }
}

function renderTeacherMaterials() {
    const list = state.studyMaterials;
    const container = document.getElementById('teacher-materials-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No study materials uploaded.</p></div>`;
        return;
    }

    list.forEach(m => {
        const card = document.createElement('div');
        card.className = 'glass-card item-card';
        card.innerHTML = `
            <div>
                <div class="item-subject" style="color: ${SUBJECT_COLORS[m.subject] || '#fff'}">${m.subject}</div>
                <div class="item-title">${m.title}</div>
                <div class="item-desc">${m.desc}</div>
            </div>
            <div class="item-footer">
                <span class="item-date" style="font-size: 0.8rem;">${m.fileName}</span>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" onclick="previewFile('${m.fileData}', '${m.fileName}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Preview
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMaterial('${m.id}')">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function handleUploadMaterial(e) {
    e.preventDefault();
    const title = document.getElementById('material-input-title').value.trim();
    const subject = document.getElementById('material-input-subject').value;
    const desc = document.getElementById('material-input-desc').value.trim();
    
    if (!uploadedMaterialFile) {
        showToast('Please select a reference file.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64 = evt.target.result.split(',')[1];
        
        const newM = {
            id: `mat_${Date.now()}`,
            title, subject, desc,
            fileName: uploadedMaterialFile.name,
            fileData: base64
        };

        state.studyMaterials.push(newM);
        saveState();
        showToast('Study material published successfully!', 'success');

        uploadedMaterialFile = null;
        document.getElementById('upload-material-form').reset();
        resetFilePicker('material-file-success', 'material-file-name');
        renderTeacherMaterials();
    };
    reader.readAsDataURL(uploadedMaterialFile);
}

function deleteMaterial(id) {
    if (confirm('Delete this study material?')) {
        state.studyMaterials = state.studyMaterials.filter(m => m.id !== id);
        saveState();
        showToast('Study material deleted.', 'info');
        renderTeacherMaterials();
    }
}

function renderTeacherAnalytics() {
    const selectedSub = document.getElementById('teacher-analytics-subject-select').value;
    
    // Average scores per subject per exam
    // We aggregate scores subject-wise
    const subjects = selectedSub === 'All' ? Object.keys(SUBJECT_COLORS) : [selectedSub];
    
    // Gather graded submissions grouped by subject
    const chartData = {};
    
    subjects.forEach(sub => {
        chartData[sub] = [];
        
        // Find questions of this subject
        const qIds = state.questions.filter(q => q.subject === sub).map(q => q.id);
        
        // Get graded scores for these questions
        const subSubmissions = state.submissions.filter(s => qIds.includes(s.questionId) && s.status === 'graded');
        
        // Group by question title & calculate average score
        qIds.forEach(qId => {
            const q = state.questions.find(qy => qy.id === qId);
            const qSubs = subSubmissions.filter(s => s.questionId === qId);
            if (qSubs.length > 0) {
                const avg = qSubs.reduce((acc, curr) => acc + curr.marks, 0) / qSubs.length;
                chartData[sub].push({
                    label: q.title.length > 15 ? q.title.substring(0, 15) + '...' : q.title,
                    fullName: q.title,
                    score: Math.round(avg)
                });
            }
        });
    });

    drawSVGChart('teacher-chart-svg', 'teacher-chart-legend', chartData);
}


// ================= STUDENT DASHBOARD LOGIC =================
function renderStudentOverview() {
    const graded = state.submissions.filter(s => s.studentName === state.currentUser.name && s.status === 'graded');
    const materialsCount = state.studyMaterials.length;
    const noticesCount = state.notices.length;

    let averageMarks = 0;
    if (graded.length > 0) {
        const sum = graded.reduce((acc, curr) => acc + curr.marks, 0);
        averageMarks = Math.round(sum / graded.length);
    }

    document.getElementById('stat-student-graded').textContent = graded.length;
    document.getElementById('stat-student-marks').textContent = averageMarks + '%';
    document.getElementById('stat-student-materials').textContent = materialsCount;
    document.getElementById('stat-student-notices').textContent = noticesCount;

    // Latest notices summary
    const latestNotices = [...state.notices].reverse().slice(0, 2);
    const noticesDiv = document.getElementById('student-overview-notices');
    if (latestNotices.length === 0) {
        noticesDiv.innerHTML = `<div class="empty-state" style="padding: 10px 0;"><p>No announcements yet</p></div>`;
    } else {
        noticesDiv.innerHTML = latestNotices.map(n => `
            <div class="glass-card notice-item" style="padding: 14px;" onclick="openNoticeModalById('${n.id}')">
                <div class="notice-meta" style="margin-bottom: 4px;">
                    <span class="notice-tag">${n.category}</span>
                    <span>${n.date}</span>
                </div>
                <div class="notice-title" style="font-size: 0.95rem; margin-bottom: 0;">${n.title}</div>
            </div>
        `).join('');
    }

    // Pending/Available exam questions summary
    const availableExams = state.questions.slice(0, 2);
    const examsDiv = document.getElementById('student-overview-exams');
    if (availableExams.length === 0) {
        examsDiv.innerHTML = `<div class="empty-state" style="padding: 10px 0;"><p>No active exams</p></div>`;
    } else {
        examsDiv.innerHTML = availableExams.map(q => {
            const sub = state.submissions.find(s => s.questionId === q.id && s.studentName === state.currentUser.name);
            const statusLabel = sub ? `Status: <span style="font-weight:600; color:var(--success);">${sub.status.toUpperCase()}</span>` : `<span style="color:var(--warning);">NOT SUBMITTED</span>`;
            return `
                <div class="flex-between" style="padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <div style="font-weight: 500; font-size: 0.95rem;">${q.title}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${q.subject} • ${statusLabel}</div>
                    </div>
                    ${!sub ? `<button class="btn btn-primary btn-sm" onclick="openSubmitScriptModal('${q.id}')">Submit</button>` : ''}
                </div>
            `;
        }).join('');
    }
}

function renderStudentList() {
    const list = state.users.filter(u => u.role === 'student' && u.status === 'approved');
    const table = document.getElementById('student-peers-table');
    const tbody = table.querySelector('tbody');

    tbody.innerHTML = '';

    list.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 500;">${s.name} ${s.name === state.currentUser.name ? '<span style="color: var(--secondary); font-size: 0.8rem;">(You)</span>' : ''}</td>
            <td>${s.college}</td>
            <td>${s.address}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderStudentQuestions() {
    const list = state.questions;
    const container = document.getElementById('student-questions-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No exams released by the teacher yet.</p></div>`;
        return;
    }

    list.forEach(q => {
        // Check if student has already submitted script for this exam
        const sub = state.submissions.find(s => s.questionId === q.id && s.studentName === state.currentUser.name);
        
        let actionHTML = '';
        if (sub) {
            actionHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-${sub.status}">${sub.status}</span>
                    <button class="btn btn-secondary btn-sm" onclick="previewFile('${sub.fileData}', '${sub.fileName}')">My Script</button>
                </div>
            `;
        } else {
            actionHTML = `
                <button class="btn btn-accent btn-sm" onclick="openSubmitScriptModal('${q.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Submit Script
                </button>
            `;
        }

        const card = document.createElement('div');
        card.className = 'glass-card item-card';
        card.innerHTML = `
            <div>
                <div class="item-subject" style="color: ${SUBJECT_COLORS[q.subject] || '#fff'}">${q.subject}</div>
                <div class="item-title">${q.title}</div>
                <div class="item-desc">${q.desc}</div>
            </div>
            <div class="item-footer">
                <button class="btn btn-secondary btn-sm" onclick="previewFile('${q.fileData}', '${q.fileName}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Question File
                </button>
                ${actionHTML}
            </div>
        `;
        container.appendChild(card);
    });
}

function openSubmitScriptModal(qId) {
    const q = state.questions.find(qy => qy.id === qId);
    if (!q) return;

    document.getElementById('submit-question-id').value = qId;
    document.getElementById('submit-modal-exam-title').textContent = `${q.title} (${q.subject})`;
    
    // Clear picker file data
    uploadedScriptFile = null;
    document.getElementById('student-submit-script-form').reset();
    resetFilePicker('script-file-success', 'script-file-name');

    openModal('submit-script-modal');
}

function handleStudentScriptSubmit(e) {
    e.preventDefault();
    const qId = document.getElementById('submit-question-id').value;
    
    if (!uploadedScriptFile) {
        showToast('Please select your solved answer script file.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64 = evt.target.result.split(',')[1];
        
        const d = new Date();
        const dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const newSub = {
            id: `sub_${Date.now()}`,
            questionId: qId,
            studentName: state.currentUser.name,
            fileName: uploadedScriptFile.name,
            fileData: base64,
            date: dateStr,
            status: 'submitted',
            marks: '',
            comment: ''
        };

        state.submissions.push(newSub);
        saveState();
        showToast('Exam script submitted successfully!', 'success');
        
        closeModal('submit-script-modal');
        renderPaneData(getCurrentPaneId());
    };
    reader.readAsDataURL(uploadedScriptFile);
}

function renderStudentSubmissions() {
    const list = state.submissions.filter(s => s.studentName === state.currentUser.name);
    const table = document.getElementById('student-submissions-table');
    const tbody = table.querySelector('tbody');
    const empty = document.getElementById('student-submissions-empty');

    tbody.innerHTML = '';

    if (list.length === 0) {
        table.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        table.classList.remove('hidden');
        empty.classList.add('hidden');

        list.forEach(s => {
            const q = state.questions.find(qy => qy.id === s.questionId) || { title: 'Deleted Question', subject: 'General' };
            const isGraded = s.status === 'graded';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="color: ${SUBJECT_COLORS[q.subject] || '#fff'}; font-weight: 500;">${q.subject}</td>
                <td style="font-weight: 500;">${q.title}</td>
                <td>${s.date}</td>
                <td>
                    <span class="badge badge-${s.status}">${s.status}</span>
                </td>
                <td style="font-weight: 700; font-size:1.05rem; color:${isGraded ? 'var(--success)' : 'inherit'}">${isGraded ? s.marks + '/100' : '—'}</td>
                <td style="font-size: 0.9rem; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${s.comment || ''}">${s.comment || '—'}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-secondary btn-sm" onclick="previewFile('${s.fileData}', '${s.fileName}')">
                            My Script
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function renderStudentMaterials() {
    const list = state.studyMaterials;
    const container = document.getElementById('student-materials-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No materials shared by the teacher yet.</p></div>`;
        return;
    }

    list.forEach(m => {
        const card = document.createElement('div');
        card.className = 'glass-card item-card';
        card.innerHTML = `
            <div>
                <div class="item-subject" style="color: ${SUBJECT_COLORS[m.subject] || '#fff'}">${m.subject}</div>
                <div class="item-title">${m.title}</div>
                <div class="item-desc">${m.desc}</div>
            </div>
            <div class="item-footer">
                <span class="item-date" style="font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px;">${m.fileName}</span>
                <button class="btn btn-secondary btn-sm" onclick="previewFile('${m.fileData}', '${m.fileName}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    View & Download
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderStudentNotices() {
    const list = [...state.notices].reverse();
    const container = document.getElementById('student-notices-board-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No notifications posted.</p></div>`;
        return;
    }

    list.forEach(n => {
        const item = document.createElement('div');
        item.className = 'glass-card notice-item';
        item.innerHTML = `
            <div class="notice-meta">
                <span class="notice-tag">${n.category}</span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    ${n.date}
                </span>
            </div>
            <div class="notice-title">${n.title}</div>
            <div class="notice-excerpt">${n.content}</div>
        `;
        item.onclick = () => openNoticeModal(n);
        container.appendChild(item);
    });
}

function renderStudentAnalytics() {
    const selectedSub = document.getElementById('student-analytics-subject-select').value;
    const subjects = selectedSub === 'All' ? Object.keys(SUBJECT_COLORS) : [selectedSub];
    
    // Filter this specific student's graded exams grouped by subject
    const chartData = {};
    
    subjects.forEach(sub => {
        chartData[sub] = [];
        
        // Questions in subject
        const qIds = state.questions.filter(q => q.subject === sub).map(q => q.id);
        
        // Find this student's submissions for those questions
        const subList = state.submissions.filter(s => s.studentName === state.currentUser.name && qIds.includes(s.questionId) && s.status === 'graded');
        
        subList.forEach(s => {
            const q = state.questions.find(qy => qy.id === s.questionId);
            chartData[sub].push({
                label: q.title.length > 15 ? q.title.substring(0, 15) + '...' : q.title,
                fullName: q.title,
                score: s.marks
            });
        });
    });

    drawSVGChart('student-chart-svg', 'student-chart-legend', chartData);
}

// ================= MODALS CONTROLLER =================
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function openNoticeModal(notice) {
    document.getElementById('notice-modal-title').textContent = notice.title;
    document.getElementById('notice-modal-category').textContent = notice.category;
    document.getElementById('notice-modal-date').textContent = notice.date;
    document.getElementById('notice-modal-content').innerHTML = notice.content.replace(/\n/g, '<br>');
    openModal('notice-modal');
}

function openNoticeModalById(noticeId) {
    const n = state.notices.find(no => no.id === noticeId);
    if (n) openNoticeModal(n);
}

// Simulated File viewer
function previewFile(base64Data, fileName) {
    const modalTitle = document.getElementById('preview-modal-title');
    const modalBody = document.getElementById('preview-modal-body');
    const dlBtn = document.getElementById('preview-modal-download-btn');

    modalTitle.textContent = `Document Viewer: ${fileName}`;
    dlBtn.href = `data:application/octet-stream;base64,${base64Data}`;
    dlBtn.download = fileName;

    const fileStr = base64ToStr(base64Data);
    const isTxt = fileName.endsWith('.txt');

    if (isTxt) {
        modalBody.innerHTML = `<pre class="file-text-preview">${escapeHtml(fileStr)}</pre>`;
    } else {
        // PDF or image simulation UI
        const isImage = fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
        if (isImage) {
            modalBody.innerHTML = `
                <div style="display:flex; justify-content:center; align-items:center; height:100%; overflow:hidden;">
                    <img src="data:image/png;base64,${base64Data}" style="max-width:100%; max-height:100%; border-radius:6px; box-shadow:0 4px 10px rgba(0,0,0,0.5);" alt="${fileName}">
                </div>
            `;
        } else {
            // Simulated PDF reader
            modalBody.innerHTML = `
                <div class="pdf-simulation-card" style="height: 100%;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <h4>${fileName}</h4>
                    <p style="margin-bottom: 24px;">This is a simulated view of the uploaded PDF booklet.</p>
                    <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:6px; font-size:0.85rem; border:1px solid var(--border-color); text-align:left; width:100%; max-width:500px; font-family:monospace; color:var(--text-muted);">
                        [EduGrade PDF Parser Success]<br>
                        Filename: ${fileName}<br>
                        Encrypted Data Stream Size: ${(base64Data.length / 1024).toFixed(2)} KB<br>
                        Reader Mode: Ready to download
                    </div>
                </div>
            `;
        }
    }

    openModal('preview-modal');
}

// ================= CUSTOM SVG CHART DRAWING SYSTEM =================
function drawSVGChart(svgId, legendId, chartData) {
    const svg = document.getElementById(svgId);
    const legend = document.getElementById(legendId);
    if (!svg) return;

    // Reset SVG
    svg.innerHTML = '';
    legend.innerHTML = '';

    // Collect all data points to check if we actually have scores
    let totalPoints = 0;
    const allLabelsSet = new Set();
    
    Object.keys(chartData).forEach(sub => {
        totalPoints += chartData[sub].length;
        chartData[sub].forEach(pt => allLabelsSet.add(pt.label));
    });

    if (totalPoints === 0) {
        // Render Empty state in SVG
        svg.innerHTML = `
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="var(--text-muted)" font-size="14">
                No graded exam script data found to generate graphs.
            </text>
        `;
        return;
    }

    const labels = Array.from(allLabelsSet);
    
    // Set Dimensions
    const svgWidth = svg.clientWidth || 800;
    const svgHeight = svg.clientHeight || 350;
    
    const paddingLeft = 60;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 50;
    
    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const chartHeight = svgHeight - paddingTop - paddingBottom;

    // 1. Draw Grid Lines & Y-Axis Scale
    for (let i = 0; i <= 5; i++) {
        const score = i * 20;
        const y = paddingTop + chartHeight - (score / 100) * chartHeight;
        
        // Gridline
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', paddingLeft);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', paddingLeft + chartWidth);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('class', 'chart-grid-line');
        svg.appendChild(gridLine);

        // Text labels
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', paddingLeft - 15);
        text.setAttribute('y', y + 4);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('class', 'chart-axis-text');
        text.textContent = `${score}%`;
        svg.appendChild(text);
    }

    // 2. Draw X-Axis labels
    const numPoints = Math.max(labels.length, 1);
    const xStep = numPoints > 1 ? chartWidth / (numPoints - 1) : chartWidth;
    
    labels.forEach((lbl, index) => {
        const x = paddingLeft + index * xStep;
        const y = paddingTop + chartHeight + 25;
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'chart-axis-text');
        text.textContent = lbl;
        svg.appendChild(text);
    });

    // 3. Draw Lines & Points for each subject
    Object.keys(chartData).forEach(sub => {
        const points = chartData[sub];
        if (points.length === 0) return;

        const color = SUBJECT_COLORS[sub] || '#ffffff';
        let pathD = '';
        
        // Add legend element
        const legItem = document.createElement('div');
        legItem.className = 'legend-item';
        legItem.innerHTML = `
            <div class="legend-color-dot" style="background-color: ${color}"></div>
            <span>${sub}</span>
        `;
        legend.appendChild(legItem);

        const pointCoords = [];

        points.forEach((pt, index) => {
            // Match labels index
            const labelIndex = labels.indexOf(pt.label);
            const x = paddingLeft + labelIndex * xStep;
            const y = paddingTop + chartHeight - (pt.score / 100) * chartHeight;
            pointCoords.push({ x, y, score: pt.score, fullName: pt.fullName });

            if (index === 0) {
                pathD = `M ${x} ${y}`;
            } else {
                pathD += ` L ${x} ${y}`;
            }
        });

        // Append line path
        if (pointCoords.length > 1) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathD);
            path.setAttribute('class', 'chart-path');
            path.setAttribute('stroke', color);
            // Dynamic entry dash stroke animation
            const pathLength = 2000;
            path.setAttribute('stroke-dasharray', pathLength);
            path.setAttribute('stroke-dashoffset', pathLength);
            svg.appendChild(path);

            setTimeout(() => {
                path.style.strokeDashoffset = '0';
            }, 50);
        }

        // Draw Interactive Circles
        pointCoords.forEach(pt => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pt.x);
            circle.setAttribute('cy', pt.y);
            circle.setAttribute('r', '5');
            circle.setAttribute('fill', '#ffffff');
            circle.setAttribute('stroke', color);
            circle.setAttribute('class', 'chart-point');

            // Interactive Tooltip on hover
            circle.onmouseover = (e) => {
                circle.setAttribute('r', '8');
                showChartTooltip(svg, pt.x, pt.y - 12, `${pt.score}% - ${pt.fullName}`);
            };

            circle.onmouseout = () => {
                circle.setAttribute('r', '5');
                hideChartTooltip(svg);
            };

            svg.appendChild(circle);
        });
    });
}

let activeTooltip = null;

function showChartTooltip(svg, x, y, textContent) {
    hideChartTooltip(svg);

    // Dynamic group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', 'chart-tooltip-group');

    // Text to measure length
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y - 6);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'chart-label-text');
    text.textContent = textContent;
    
    // Backdrop rect
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'chart-label-bg');
    
    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);

    // Calculate bounding box and center it
    const bbox = text.getBBox();
    rect.setAttribute('x', bbox.x - 8);
    rect.setAttribute('y', bbox.y - 4);
    rect.setAttribute('width', bbox.width + 16);
    rect.setAttribute('height', bbox.height + 8);
    
    activeTooltip = g;
}

function hideChartTooltip(svg) {
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }
}

// ================= HELPERS =================
function getCurrentPaneId() {
    const activeItem = document.querySelector('.sidebar-menu:not(.hidden) .sidebar-menu-item.active');
    return activeItem ? activeItem.getAttribute('data-pane') : '';
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

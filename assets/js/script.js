document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api';

    // --- TOAST NOTIFICATION HELPER ---
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        if (type === 'success') icon = '<i class="fa fa-check-circle"></i>';
        if (type === 'error') icon = '<i class="fa-exclamation-circle"></i>';
        if (type === 'info') icon = '<i class="fa-info-circle"></i>';
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- API HELPER ---
    async function apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong');
            }
            return await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            throw error; // Re-throw to handle in the calling function if needed
        }
    }

    // --- EXPORT TO CSV HELPER ---
    async function exportToCSV(entity, filename) {
        try {
            const data = await apiCall(`/${entity}`);
            if (data.length === 0) {
                showToast('Tidak ada data untuk diekspor.', 'error');
                return;
            }
            const headers = Object.keys(data[0]).join(',');
            const csvRows = data.map(row => Object.values(row).join(','));
            const csvContent = [headers, ...csvRows].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('Data berhasil diekspor.', 'success');
        } catch (error) {
            // Error already handled by apiCall
        }
    }

    // --- STATE MANAGEMENT ---
    let currentEditId = null;
    let allStudents = [];
    let allTeachers = [];
    let allCorrespondence = [];
    let allAnnouncements = [];

    // --- DOM ELEMENTS ---
    const loginPage = document.getElementById('login-page');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const pageTitle = document.getElementById('page-title');
    const pageContents = document.querySelectorAll('.page-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // --- EVENT LISTENERS ---
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('student-form').addEventListener('submit', handleStudentSubmit);
    document.getElementById('teacher-form').addEventListener('submit', handleTeacherSubmit);
    document.getElementById('correspondence-form').addEventListener('submit', handleCorrespondenceSubmit);
    document.getElementById('announcement-form').addEventListener('submit', handleAnnouncementSubmit);
    document.getElementById('student-search').addEventListener('input', (e) => renderStudents(e.target.value));
    document.getElementById('teacher-search').addEventListener('input', (e) => renderTeachers(e.target.value));

    // --- FUNCTIONS ---

    // LOGIN / LOGOUT
    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin123') {
            loginPage.classList.add('hidden');
            appContainer.classList.remove('hidden');
            showPage('dashboard');
            showToast('Login berhasil! Selamat datang, Admin.', 'success');
        } else {
            showToast('Username atau Password salah!', 'error');
        }
    }

    function handleLogout() {
        appContainer.classList.add('hidden');
        loginPage.classList.remove('active');
        loginPage.classList.add('active');
        loginForm.reset();
        showToast('Anda telah keluar dari sistem.', 'info');
    }

    // NAVIGATION
    async function showPage(pageId) {
        pageContents.forEach(page => page.classList.remove('active'));
        document.getElementById(`${pageId}-page`).classList.add('active');

        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

        switch(pageId) {
            case 'dashboard':
                pageTitle.textContent = 'Dashboard';
                await renderDashboard();
                break;
            case 'students':
                pageTitle.textContent = 'Data Siswa';
                await fetchAndRenderStudents();
                break;
            case 'teachers':
                pageTitle.textContent = 'Data Guru & Staff';
                await fetchAndRenderTeachers();
                break;
            case 'correspondence':
                pageTitle.textContent = 'Manajemen Surat Menyurat';
                await fetchAndRenderCorrespondence();
                break;
            case 'announcements':
                pageTitle.textContent = 'Manajemen Pengumuman';
                await fetchAndRenderAnnouncements();
                break;
        }
    }

    // --- FETCH & RENDER FUNCTIONS ---
    async function fetchAndRenderStudents() {
        allStudents = await apiCall('/students');
        renderStudents();
    }
    async function fetchAndRenderTeachers() {
        allTeachers = await apiCall('/teachers');
        renderTeachers();
    }
    async function fetchAndRenderCorrespondence() {
        allCorrespondence = await apiCall('/correspondence');
        renderCorrespondence();
    }
    async function fetchAndRenderAnnouncements() {
        allAnnouncements = await apiCall('/announcements');
        renderAnnouncements();
    }

    async function renderDashboard() {
        await fetchAndRenderStudents();
        await fetchAndRenderTeachers();
        await fetchAndRenderCorrespondence();
        await fetchAndRenderAnnouncements();

        document.getElementById('total-students').textContent = allStudents.length;
        document.getElementById('total-teachers').textContent = allTeachers.length;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyCorrespondenceCount = allCorrespondence.filter(c => {
            const letterDate = new Date(c.date);
            return letterDate.getMonth() === currentMonth && letterDate.getFullYear() === currentYear;
        }).length;
        document.getElementById('monthly-correspondence').textContent = monthlyCorrespondenceCount;

        document.getElementById('total-announcements').textContent = allAnnouncements.length;

        const dashboardAnnouncementsList = document.getElementById('dashboard-announcements-list');
        dashboardAnnouncementsList.innerHTML = '';
        const latestAnnouncements = allAnnouncements.slice(-2).reverse();
        if (latestAnnouncements.length === 0) {
            dashboardAnnouncementsList.innerHTML = '<p>Belum ada pengumuman.</p>';
        } else {
            latestAnnouncements.forEach(ann => {
                dashboardAnnouncementsList.innerHTML += `
                    <div class="announcement-card">
                        <h4>${ann.title}</h4>
                        <p>${ann.content.substring(0, 100)}...</p>
                    </div>
                `;
            });
        }
    }

    function renderStudents(searchTerm = '') {
        const tbody = document.getElementById('students-table-body');
        tbody.innerHTML = '';
        const filteredStudents = allStudents.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm)
        );
        if (filteredStudents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Tidak ada data siswa.</td></tr>';
            return;
        }
        filteredStudents.forEach(student => {
            tbody.innerHTML += `
                <tr>
                    <td>${student.nis}</td>
                    <td><a href="#" onclick="showStudentDetail(${student.id}); return false;">${student.name}</a></td>
                    <td>${student.class}</td>
                    <td>${student.gender}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editStudent(${student.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }
    
    function showStudentDetail(id) {
        const student = allStudents.find(s => s.id === id);
        if (!student) return;

        const detailCard = document.getElementById('student-detail-card');
        detailCard.innerHTML = `
            <div class="detail-header">
                <img src="https://i.pravatar.cc/150?u=${student.nis}" alt="Avatar">
                <div>
                    <h2>${student.name}</h2>
                    <p>NIS: ${student.nis}</p>
                </div>
            </div>
            <div class="detail-body">
                <h3>Informasi Akademik</h3>
                <p><strong>Kelas:</strong> ${student.class}</p>
                <p><strong>Jenis Kelamin:</strong> ${student.gender}</p>
            </div>
        `;
        showPage('student-detail');
    }
    
    function goBackFromStudentDetail() {
        showPage('students');
    }

    function renderTeachers(searchTerm = '') {
        const tbody = document.getElementById('teachers-table-body');
        tbody.innerHTML = '';
        const filteredTeachers = allTeachers.filter(t => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.nip.includes(searchTerm)
        );
        if (filteredTeachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Tidak ada data guru/staff.</td></tr>';
            return;
        }
        filteredTeachers.forEach(teacher => {
            tbody.innerHTML += `
                <tr>
                    <td>${teacher.nip}</td>
                    <td>${teacher.name}</td>
                    <td>${teacher.position}</td>
                    <td>${teacher.subject}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editTeacher(${teacher.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteTeacher(${teacher.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    function renderCorrespondence() {
        const tbody = document.getElementById('correspondence-table-body');
        tbody.innerHTML = '';
        if (allCorrespondence.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada data surat.</td></tr>';
            return;
        }
        allCorrespondence.forEach(letter => {
            const typeClass = letter.type === 'Surat Masuk' ? 'success' : 'primary';
            tbody.innerHTML += `
                <tr>
                    <td><span style="color: var(--${typeClass}-color)">${letter.type}</span></td>
                    <td>${letter.number}</td>
                    <td>${letter.subject}</td>
                    <td>${letter.recipient}</td>
                    <td>${new Date(letter.date).toLocaleDateString('id-ID')}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteCorrespondence(${letter.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    function renderAnnouncements() {
        const list = document.getElementById('announcements-list');
        list.innerHTML = '';
        if (allAnnouncements.length === 0) {
            list.innerHTML = '<p>Belum ada pengumuman.</p>';
            return;
        }
        allAnnouncements.forEach(ann => {
            list.innerHTML += `
                <div class="announcement-card">
                    <div class="content">
                        <h3>${ann.title}</h3>
                        <p>${ann.content}</p>
                    </div>
                    <div class="actions">
                        <button class="btn btn-danger" onclick="deleteAnnouncement(${ann.id})">Hapus</button>
                    </div>
                </div>
            `;
        });
    }

    // --- CRUD OPERATIONS ---

    // STUDENT CRUD
    function openAddStudentModal() {
        currentEditId = null;
        document.getElementById('student-modal-title').textContent = 'Tambah Siswa Baru';
        document.getElementById('student-form').reset();
        document.getElementById('student-modal').classList.remove('hidden');
    }
    function closeStudentModal() { document.getElementById('student-modal').classList.add('hidden'); }

    async function handleStudentSubmit(e) {
        e.preventDefault();
        const studentData = {
            nis: document.getElementById('student-nis').value,
            name: document.getElementById('student-name').value,
            class: document.getElementById('student-class').value,
            gender: document.getElementById('student-gender').value,
        };

        try {
            if (currentEditId) {
                await apiCall(`/students/${currentEditId}`, {
                    method: 'PUT',
                    body: JSON.stringify(studentData)
                });
                showToast('Data siswa berhasil diperbarui.', 'success');
            } else {
                await apiCall('/students', {
                    method: 'POST',
                    body: JSON.stringify(studentData)
                });
                showToast('Siswa baru berhasil ditambahkan.', 'success');
            }
            await fetchAndRenderStudents();
            closeStudentModal();
        } catch (error) {
            // Error handled by apiCall
        }
    }

    function editStudent(id) {
        currentEditId = id;
        const student = allStudents.find(s => s.id === id);
        document.getElementById('student-modal-title').textContent = 'Edit Data Siswa';
        document.getElementById('student-nis').value = student.nis;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-class').value = student.class;
        document.getElementById('student-gender').value = student.gender;
        document.getElementById('student-modal').classList.remove('hidden');
    }

    async function deleteStudent(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
            try {
                await apiCall(`/students/${id}`, { method: 'DELETE' });
                await fetchAndRenderStudents();
                showToast('Data siswa berhasil dihapus.', 'info');
            } catch (error) {
                // Error handled by apiCall
            }
        }
    }

    // TEACHER CRUD
    function openAddTeacherModal() {
        currentEditId = null;
        document.getElementById('teacher-modal-title').textContent = 'Tambah Guru/Staff Baru';
        document.getElementById('teacher-form').reset();
        document.getElementById('teacher-modal').classList.remove('hidden');
    }
    function closeTeacherModal() { document.getElementById('teacher-modal').classList.add('hidden'); }

    async function handleTeacherSubmit(e) {
        e.preventDefault();
        const teacherData = {
            nip: document.getElementById('teacher-nip').value,
            name: document.getElementById('teacher-name').value,
            position: document.getElementById('teacher-position').value,
            subject: document.getElementById('teacher-subject').value,
        };

        try {
            if (currentEditId) {
                await apiCall(`/teachers/${currentEditId}`, {
                    method: 'PUT',
                    body: JSON.stringify(teacherData)
                });
                showToast('Data guru/staff berhasil diperbarui.', 'success');
            } else {
                await apiCall('/teachers', {
                    method: 'POST',
                    body: JSON.stringify(teacherData)
                });
                showToast('Guru/staff baru berhasil ditambahkan.', 'success');
            }
            await fetchAndRenderTeachers();
            closeTeacherModal();
        } catch (error) {}
    }

    function editTeacher(id) {
        currentEditId = id;
        const teacher = allTeachers.find(t => t.id === id);
        document.getElementById('teacher-modal-title').textContent = 'Edit Data Guru/Staff';
        document.getElementById('teacher-nip').value = teacher.nip;
        document.getElementById('teacher-name').value = teacher.name;
        document.getElementById('teacher-position').value = teacher.position;
        document.getElementById('teacher-subject').value = teacher.subject;
        document.getElementById('teacher-modal').classList.remove('hidden');
    }

    async function deleteTeacher(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data guru/staff ini?')) {
            try {
                await apiCall(`/teachers/${id}`, { method: 'DELETE' });
                await fetchAndRenderTeachers();
                showToast('Data guru/staff berhasil dihapus.', 'info');
            } catch (error) {}
        }
    }
    
    // CORRESPONDENCE CRUD
    function openAddCorrespondenceModal() {
        document.getElementById('correspondence-form').reset();
        document.getElementById('correspondence-modal').classList.remove('hidden');
    }
    function closeCorrespondenceModal() { document.getElementById('correspondence-modal').classList.add('hidden'); }

    async function handleCorrespondenceSubmit(e) {
        e.preventDefault();
        const correspondenceData = {
            type: document.getElementById('correspondence-type').value,
            number: document.getElementById('correspondence-number').value,
            subject: document.getElementById('correspondence-subject').value,
            recipient: document.getElementById('correspondence-recipient').value,
            date: document.getElementById('correspondence-date').value,
            description: document.getElementById('correspondence-desc').value,
        };

        try {
            await apiCall('/correspondence', {
                method: 'POST',
                body: JSON.stringify(correspondenceData)
            });
            await fetchAndRenderCorrespondence();
            closeCorrespondenceModal();
            showToast('Surat berhasil dicatat.', 'success');
        } catch (error) {}
    }
    
    async function deleteCorrespondence(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data surat ini?')) {
            try {
                await apiCall(`/correspondence/${id}`, { method: 'DELETE' });
                await fetchAndRenderCorrespondence();
                showToast('Data surat berhasil dihapus.', 'info');
            } catch (error) {}
        }
    }

    // ANNOUNCEMENT CRUD
    function openAddAnnouncementModal() {
        document.getElementById('announcement-form').reset();
        document.getElementById('announcement-modal').classList.remove('hidden');
    }
    function closeAnnouncementModal() { document.getElementById('announcement-modal').classList.add('hidden'); }

    async function handleAnnouncementSubmit(e) {
        e.preventDefault();
        const announcementData = {
            title: document.getElementById('announcement-title').value,
            content: document.getElementById('announcement-content').value,
        };
        try {
            await apiCall('/announcements', {
                method: 'POST',
                body: JSON.stringify(announcementData)
            });
            await fetchAndRenderAnnouncements();
            closeAnnouncementModal();
            showToast('Pengumuman berhasil dipublikasikan.', 'success');
        } catch (error) {}
    }

    async function deleteAnnouncement(id) {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            try {
                await apiCall(`/announcements/${id}`, { method: 'DELETE' });
                await fetchAndRenderAnnouncements();
                showToast('Pengumuman berhasil dihapus.', 'info');
            } catch (error) {}
        }
    }

    // --- EXPOSE FUNCTIONS TO GLOBAL SCOPE ---
    // Fungsi-fungsi ini dibuat global agar bisa dipanggil oleh atribut 'onclick' di HTML
    window.showPage = showPage;
    window.showStudentDetail = showStudentDetail;
    window.goBackFromStudentDetail = goBackFromStudentDetail;
    window.openAddStudentModal = openAddStudentModal;
    window.closeStudentModal = closeStudentModal;
    window.editStudent = editStudent;
    window.deleteStudent = deleteStudent;
    window.openAddTeacherModal = openAddTeacherModal;
    window.closeTeacherModal = closeTeacherModal;
    window.editTeacher = editTeacher;
    window.deleteTeacher = deleteTeacher;
    window.openAddCorrespondenceModal = openAddCorrespondenceModal;
    window.closeCorrespondenceModal = closeCorrespondenceModal;
    window.deleteCorrespondence = deleteCorrespondence;
    window.openAddAnnouncementModal = openAddAnnouncementModal;
    window.closeAnnouncementModal = closeAnnouncementModal;
    window.deleteAnnouncement = deleteAnnouncement;
    window.exportToCSV = exportToCSV;

});
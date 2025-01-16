let students = [];
const studentsPerPage = 5;
let currentPage = 1;

function addStudent(event) {
    event.preventDefault();
    const classSelect = document.getElementById("classSelect").value;
    const studentName = document.getElementById("studentName").value.trim();
    const subType = document.getElementById("subType").value;
    const chipsType = document.getElementById("chipsType").value;
    const cookieType = document.getElementById("cookieType").value;

    if (studentName === "") {
        alert("Please enter the student's name.");
        return;
    }

    const student = {
        id: Date.now(),
        class: classSelect,
        name: studentName,
        sub: subType,
        chips: chipsType,
        cookie: cookieType,
    };

    students.push(student);
    displayStudents();
    clearForm();
}

function displayStudents() {
    const studentTableBody = document.getElementById("studentTableBody");
    studentTableBody.innerHTML = "";

    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const paginatedStudents = students.slice(startIndex, endIndex);

    paginatedStudents.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.sub}</td>
            <td>${student.chips}</td>
            <td>${student.cookie}</td>
            <td><button class="deleteButton" onclick="deleteStudent(${student.id})">Delete</button></td>
        `;
        studentTableBody.appendChild(row);
    });

    updatePagination();
}

function deleteStudent(id) {
    students = students.filter((student) => student.id !== id);
    displayStudents();
}

function clearForm() {
    document.getElementById("studentForm").reset();
}

function updatePagination() {
    const totalPages = Math.ceil(students.length / studentsPerPage);
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayStudents();
    }
}

function nextPage() {
    const totalPages = Math.ceil(students.length / studentsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayStudents();
    }
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    let y = margin;

    doc.setFontSize(18);
    doc.text("Subway Order List", margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(100);

    students.forEach((student, index) => {
        if (y > pageHeight - 50) {
            doc.addPage();
            y = margin;
        }

        doc.text(`${index + 1}. ${student.name} (${student.class})`, margin, y);
        y += 7;
        doc.text(`   Sub: ${student.sub}, Chips: ${student.chips}, Cookie: ${student.cookie}`, margin, y);
        y += 10;
    });

    doc.save("Subway_Order_List.pdf");
}

// Event Listeners
document.getElementById("studentForm").addEventListener("submit", addStudent);
document.getElementById("prevPage").addEventListener("click", prevPage);
document.getElementById("nextPage").addEventListener("click", nextPage);

// Initial display
displayStudents();
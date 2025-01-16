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
    studentTableBody.innerHTML = ""; // Clear the existing rows

    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const studentsOnPage = students.slice(startIndex, endIndex);

    studentsOnPage.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.sub}</td>
            <td>${student.chips}</td>
            <td>${student.cookie}</td>
            <td><button class="deleteButton" onclick="deleteStudent(${student.id})">X</button></td>
        `;
        studentTableBody.appendChild(row);
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(students.length / studentsPerPage);
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayStudents();
        }
    };

    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayStudents();
        }
    };
}

function deleteStudent(id) {
    students = students.filter((student) => student.id !== id);
    displayStudents();
}

function clearForm() {
    document.getElementById("studentForm").reset();
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get the student list table
    const table = document.getElementById('studentTable');
    const tableHTML = `
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
            }
            th, td {
                padding: 10px;
                text-align: left;
                border: 1px solid #ddd;
            }
            th {
                background-color: #4CAF50;
                color: #fff;
                text-transform: uppercase;
            }
            tr:nth-child(even) td {
                background-color: #f9f9f9;
            }
            tr:hover td {
                background-color: #f1f8e9;
            }
        </style>
        ${table.outerHTML}
    `;

    // Add the styled HTML table to the PDF
    doc.html(tableHTML, {
        callback: function (doc) {
            doc.save("StudentList.pdf");
        },
        x: 10,
        y: 10,
        html2canvas: { scale: 0.5 }, // Adjust scaling for better fit
    });
}


// Event Listeners
document.getElementById("studentForm").addEventListener("submit", addStudent);
displayStudents();

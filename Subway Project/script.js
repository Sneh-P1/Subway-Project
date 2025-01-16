let students = [];
let currentPage = 1;
const itemsPerPage = 5;

function addStudent() {
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
    renderStudentList();
    clearForm();
}

function renderStudentList() {
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = "";

    const groupedByClass = students.reduce((acc, student) => {
        if (!acc[student.class]) acc[student.class] = [];
        acc[student.class].push(student);
        return acc;
    }, {});

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const studentsToShow = Object.entries(groupedByClass).flatMap(([className, classStudents]) => {
        return classStudents.map(student => ({ className, ...student }));
    }).slice(start, end);

    studentsToShow.forEach((student, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${student.name}</strong>
            <div class="studentDetails">
                <span>Class: ${student.className}</span>
                <span>Sub: ${student.sub}</span>
                <span>Chips: ${student.chips}</span>
                <span>Cookie: ${student.cookie}</span>
            </div>
            <button class="deleteButton" onclick="deleteStudent(${student.id})">X</button>
        `;
        studentList.appendChild(li);
    });

    updatePagination();
}

function deleteStudent(id) {
    students = students.filter((student) => student.id !== id);
    renderStudentList();
}

function clearForm() {
    document.getElementById("studentName").value = "";
    document.getElementById("classSelect").value = "Kindergarten";
    document.getElementById("subType").value = "Ham";
    document.getElementById("chipsType").value = "Regular";
    document.getElementById("cookieType").value = "Chocolate Chip";
}

// Pagination Functions
function updatePagination() {
    const totalPages = Math.ceil(students.length / itemsPerPage);
    document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${totalPages}`;

    document.querySelector(".prevPage").disabled = currentPage === 1;
    document.querySelector(".nextPage").disabled = currentPage === totalPages;
}

function nextPage() {
    const totalPages = Math.ceil(students.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderStudentList();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderStudentList();
    }
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const boxWidth = 80;
    const boxHeight = 50;
    const columnGap = 10;
    const rowGap = 10;
    let x = margin;
    let y = margin;

    const groupedByClass = students.reduce((acc, student) => {
        if (!acc[student.class]) acc[student.class] = [];
        acc[student.class].push(student);
        return acc;
    }, {});

    let isFirstClass = true;

    for (const [className, classStudents] of Object.entries(groupedByClass)) {
        if (!isFirstClass) {
            y += boxHeight + rowGap;
            if (y + boxHeight > pageHeight - margin) {
                doc.addPage();
                x = margin;
                y = margin;
            }
        }

        doc.setFontSize(12);
        doc.text(`Class: ${className}`, margin, y);
        y += 10;

        classStudents.forEach((student) => {
            if (y + boxHeight > pageHeight - margin) {
                doc.addPage();
                x = margin;
                y = margin;
                doc.text(`Class: ${className}`, margin, y);
                y += 10;
            }

            doc.rect(x, y, boxWidth, boxHeight);
            doc.text(`Name: ${student.name}`, x + 5, y + 10);
            doc.text(`Sub: ${student.sub}`, x + 5, y + 20);
            doc.text(`Chips: ${student.chips}`, x + 5, y + 30);
            doc.text(`Cookie: ${student.cookie}`, x + 5, y + 40);

            x += boxWidth + columnGap;
            if (x + boxWidth > pageWidth - margin) {
                x = margin;
                y += boxHeight + rowGap;
            }
        });

        isFirstClass = false;
        x = margin;
    }

    doc.save("Subway_Order_List.pdf");
}

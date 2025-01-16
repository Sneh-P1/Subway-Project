let students = [];

function addStudent() {
    const classSelect = document.getElementById("classSelect").value;
    const studentName = document.getElementById("studentName").value.trim();
    const subType = document.getElementById("subType").value;
    const chipsType = document.getElementById("chipsType").value;
    const cookieType = document.getElementById("cookieType").value;

    if (!studentName) {
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
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = "";

    const groupedByClass = students.reduce((acc, student) => {
        if (!acc[student.class]) acc[student.class] = [];
        acc[student.class].push(student);
        return acc;
    }, {});

    for (const [className, classStudents] of Object.entries(groupedByClass)) {
        const classHeader = document.createElement("h3");
        classHeader.textContent = className;
        studentList.appendChild(classHeader);

        const ul = document.createElement("ul");
        ul.classList.add("classList");

        classStudents.forEach((student) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${student.name}</strong>
                <div>
                    Sub: ${student.sub}, Chips: ${student.chips}, Cookie: ${student.cookie}
                </div>
                <button class="deleteButton" onclick="deleteStudent(${student.id})">X</button>
            `;
            ul.appendChild(li);
        });

        studentList.appendChild(ul);
    }
}

function deleteStudent(id) {
    students = students.filter((student) => student.id !== id);
    displayStudents();
}

function clearForm() {
    document.getElementById("studentName").value = "";
    document.getElementById("classSelect").value = "Kindergarten";
    document.getElementById("subType").value = "Ham";
    document.getElementById("chipsType").value = "Regular";
    document.getElementById("cookieType").value = "Chocolate Chip";
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    students.forEach((student, index) => {
        doc.text(`Student ${index + 1}:`, 10, y);
        y += 10;
        doc.text(`Name: ${student.name}`, 10, y);
        doc.text(`Class: ${student.class}`, 10, y + 10);
        doc.text(`Sub: ${student.sub}, Chips: ${student.chips}, Cookie: ${student.cookie}`, 10, y + 20);
        y += 30;
    });

    doc.save("students.pdf");
}

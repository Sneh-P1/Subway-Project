let students = [];

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
                <div class="studentDetails">
                    <span>Class: ${student.class}</span>
                    <span>Sub: ${student.sub}</span>
                    <span>Chips: ${student.chips}</span>
                    <span>Cookie: ${student.cookie}</span>
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
    const pageWidth = doc.internal.pageSize.width; // Page width
    const pageHeight = doc.internal.pageSize.height; // Page height
    const margin = 10; // Margin for the page
    const boxWidth = 80; // Width of each student box
    const boxHeight = 50; // Height of each student box
    const columnGap = 10; // Space between columns
    const rowGap = 10; // Space between rows
    let x = margin; // Starting X position
    let y = margin; // Starting Y position

    // Group students by class
    const groupedByClass = students.reduce((acc, student) => {
        if (!acc[student.class]) acc[student.class] = [];
        acc[student.class].push(student);
        return acc;
    }, {});

    let isFirstClass = true; // Track if this is the first class to avoid unnecessary spacing

    for (const [className, classStudents] of Object.entries(groupedByClass)) {
        if (!isFirstClass) {
            // Add extra spacing between classes only if this isn't the first class
            y += boxHeight + rowGap;
            if (y + boxHeight > pageHeight - margin) {
                doc.addPage();
                x = margin;
                y = margin;
            }
        }

        // Add Class Header
        doc.setFontSize(12);
        doc.text(`Class: ${className}`, margin, y);
        y += 10;

        classStudents.forEach((student) => {
            // Check if the current position exceeds the page height
            if (y + boxHeight > pageHeight - margin) {
                doc.addPage();
                x = margin;
                y = margin;
                doc.text(`Class: ${className}`, margin, y);
                y += 10;
            }

            // Draw the box for the student
            doc.rect(x, y, boxWidth, boxHeight); // Draw the border of the box
            doc.text(`Name: ${student.name}`, x + 5, y + 10);
            doc.text(`Sub: ${student.sub}`, x + 5, y + 20);
            doc.text(`Chips: ${student.chips}`, x + 5, y + 30);
            doc.text(`Cookie: ${student.cookie}`, x + 5, y + 40);

            // Update x and y for the next student
            x += boxWidth + columnGap;

            // If x exceeds the page width, move to the next row
            if (x + boxWidth > pageWidth - margin) {
                x = margin;
                y += boxHeight + rowGap;
            }
        });

        isFirstClass = false; // Mark that the first class has been processed
        x = margin; // Reset x after finishing the class
    }

    doc.save("Subway_Order_List.pdf");
}



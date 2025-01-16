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

// Event Listeners
document.getElementById("studentForm").addEventListener("submit", addStudent);
displayStudents();

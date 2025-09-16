// Global variables for managing student data and pagination
let students = []; // Array to store all student objects
const studentsPerPage = 5; // Number of students to display per page
let currentPage = 1; // Current page number for pagination

/**
 * Handles the form submission to add a new student
 * @param {Event} event - The form submission event
 */
function addStudent(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get form values from the DOM elements
    const classSelect = document.getElementById("classSelect").value;
    const studentName = document.getElementById("studentName").value.trim();
    const subType = document.getElementById("subType").value;
    const chipsType = document.getElementById("chipsType").value;
    const cookieType = document.getElementById("cookieType").value;

    // Validate that student name is not empty
    if (studentName === "") {
        alert("Please enter the student's name.");
        return;
    }

    // Create a new student object with unique ID and form data
    const student = {
        id: Date.now(), // Use timestamp as unique identifier
        class: classSelect,
        name: studentName,
        sub: subType,
        chips: chipsType,
        cookie: cookieType,
    };

    // Add the new student to the students array
    students.push(student);
    
    // Refresh the display and clear the form
    displayStudents();
    clearForm();
}

/**
 * Displays students in the table with pagination
 * Shows only the students for the current page
 */
function displayStudents() {
    // Get reference to the table body element
    const studentTableBody = document.getElementById("studentTableBody");
    studentTableBody.innerHTML = ""; // Clear the existing rows

    // Calculate which students to show on the current page
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const studentsOnPage = students.slice(startIndex, endIndex);

    // Create table rows for each student on the current page
    studentsOnPage.forEach((student) => {
        const row = document.createElement("tr");
        // Create HTML content for the student row with delete button
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

    // Update pagination controls
    updatePagination();
}

/**
 * Updates the pagination controls based on current page and total students
 * Enables/disables previous/next buttons and updates page info
 */
function updatePagination() {
    // Calculate total number of pages needed
    const totalPages = Math.ceil(students.length / studentsPerPage);
    
    // Get references to pagination elements
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    // Update page information display
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Enable/disable buttons based on current page
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    // Set up previous button click handler
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayStudents(); // Refresh the display
        }
    };

    // Set up next button click handler
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayStudents(); // Refresh the display
        }
    };
}

/**
 * Deletes a student from the students array by ID
 * @param {number} id - The unique ID of the student to delete
 */
function deleteStudent(id) {
    // Filter out the student with the matching ID
    students = students.filter((student) => student.id !== id);
    
    // Refresh the display to show updated list
    displayStudents();
}

/**
 * Clears all form fields by resetting the form
 */
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
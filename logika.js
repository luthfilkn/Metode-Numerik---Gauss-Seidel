document.getElementById("generateMatrix").addEventListener("click", function () {
    const size = parseInt(document.getElementById("matrixSize").value);
    const matrixInputs = document.getElementById("matrixInputs");
    matrixInputs.innerHTML = "";

    if (isNaN(size) || size < 2) {
        alert("Masukkan jumlah variabel yang valid (minimal 2).");
        return;
    }

    // Generate input fields for matrix
    const table = document.createElement("table");
    for (let i = 0; i < size; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j <= size; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.step = "0.01";
            input.style.width = "80px";
            input.placeholder = j === size ? "B" : `a[${i + 1},${j + 1}]`;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    matrixInputs.appendChild(table);
    document.getElementById("calculate").style.display = "block";
});

document.getElementById("calculate").addEventListener("click", function () {
    const size = parseInt(document.getElementById("matrixSize").value);
    const matrixInputs = document.querySelectorAll("#matrixInputs input");
    const matrix = [];
    const b = [];
    const tolerance = 0.00; // Error 0.00% untuk konvergensi
    const maxIterations = 100;

    // Parse input values
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(parseFloat(matrixInputs[i * (size + 1) + j].value));
        }
        matrix.push(row);
        b.push(parseFloat(matrixInputs[i * (size + 1) + size].value));
    }

    // Gauss-Seidel method
    const x = Array(size).fill(0);
    let iterations = 0;
    let convergence = false;

    const resultsTable = document.getElementById("resultsTable");
    resultsTable.innerHTML = ""; // Clear previous table

    // Add table header
    let headerRow = "<tr><th>Iterasi</th>";
    for (let i = 0; i < size; i++) {
        headerRow += `<th>x[${i + 1}]</th>`;
    }
    headerRow += "<th>Rumus Perhitungan</th></tr>";
    resultsTable.innerHTML += headerRow;

    // Tabel untuk nilai error
    // Inisialisasi header tabel untuk error
    const errorTable = document.getElementById("errorTable");
    errorTable.innerHTML = "<tr><th>Iterasi</th><th>Error x[1] (%)</th><th>Rumus Error x[1]</th><th>Error x[2]</th><th>Rumus Error x[2]</th><th>Error x[3]</th><th>Rumus Error x[3]</th>";

    while (iterations < maxIterations) {
        const xNew = [...x];
        const errors = [];
        let iterationDetails = "";

        // Iterasi perhitungan
        for (let i = 0; i < size; i++) {
            let sum = 0;
            for (let j = 0; j < size; j++) {
                if (j !== i) {
                    sum += matrix[i][j] * xNew[j];
                }
            }

            // Rumus Gauss-Seidel: x[i] = (b[i] - sum) / matrix[i][i]
            const newX = (b[i] - sum) / matrix[i][i];
            xNew[i] = newX;

            // Error calculation (absolute percentage)
            const error = (((newX - x[i]) / newX) * 100).toFixed(2);
            errors.push(error);

            // Menyusun rumus iterasi
            iterationDetails += `x[${i + 1}] = (${b[i]} - ${sum.toFixed(4)}) / ${matrix[i][i]} = ${newX.toFixed(4)}<br>`;
        }

        // Menambahkan baris ke tabel hasil
        let row = `<tr><td>${iterations + 1}</td>`;
        for (let i = 0; i < size; i++) {
            row += `<td>${xNew[i].toFixed(4)}</td>`; // Nilai variabel (negatif tetap ada)
        }
        row += `<td>${iterationDetails}</td></tr>`;
        resultsTable.innerHTML += row;

        // Menambahkan baris ke tabel error
        let errorRow = `<tr><td>${iterations + 1}</td>`;
        for (let i = 0; i < size; i++) {
            errorRow += `<td>${errors[i]}</td>`; // Nilai error absolut
            const errorFormula = `((${xNew[i].toFixed(4)} - ${x[i].toFixed(4)}) / ${xNew[i].toFixed(4)}) * 100`;
            errorRow += `<td>${errorFormula}</td>`; // Rumus error
        }
        errorRow += "</tr>";
        errorTable.innerHTML += errorRow;

        // Check for convergence
        const allErrorsZero = errors.every((error) => parseFloat(error) <= tolerance);
        if (allErrorsZero) {
            convergence = true;
            break;
        }

        x.splice(0, size, ...xNew);
        iterations++;
    }

    const finalResult = document.getElementById("finalResult");
    finalResult.innerHTML = `<h3>Hasil:</h3>
        <p>${convergence ? "Konvergensi tercapai" : "Tidak konvergen"} dalam ${iterations} iterasi</p>`;
});

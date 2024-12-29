document.getElementById("generateMatrix").addEventListener("click", function () {
    const size = parseInt(document.getElementById("matrixSize").value);
    const matrixInputs = document.getElementById("matrixInputs");
    const guessInputs = document.getElementById("guessInputs");
    matrixInputs.innerHTML = "";
    guessInputs.innerHTML = "";

    if (isNaN(size) || size < 2) {
        alert("Masukkan jumlah jaringan pipa yang valid (minimal 2).");
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
            input.step = "1";
            input.style.width = "80px";
            input.placeholder = j === size ? "B" : `a[${i + 1},${j + 1}]`;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    matrixInputs.appendChild(table);

    // Generate input fields for initial guesses
    for (let i = 0; i < size; i++) {
        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.placeholder = `x[${i + 1}]`;
        guessInputs.appendChild(input);
    }

    // Tampilkan tulisan "Nilai Awal Aliran" di tengah
    const initialGuessSection = document.getElementById("initialGuess");
    initialGuessSection.style.display = "flex";

    // Tampilkan input toleransi
    const toleranceSection = document.getElementById("toleranceSection");
    toleranceSection.style.display = "block";

    // Tampilkan tombol "Hitung Aliran"
    document.getElementById("calculate").style.display = "block";
});

document.getElementById("calculate").addEventListener("click", function () {
    const size = parseInt(document.getElementById("matrixSize").value);
    const matrixInputs = document.querySelectorAll("#matrixInputs input");
    const guessInputs = document.querySelectorAll("#guessInputs input");
    const toleranceInput = parseFloat(document.getElementById("tolerance").value) || 0.001;
    const matrix = [];
    const b = [];
    const tolerance = toleranceInput; // Toleransi yang diinput pengguna
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

    // Parse initial guesses
    const x = [];
    for (let i = 0; i < size; i++) {
        x.push(parseFloat(guessInputs[i].value) || 0);
    }

    let iterations = 0;
    let convergence = false;

    const resultsTable = document.getElementById("resultsTable");
    resultsTable.innerHTML = ""; // Clear previous table

    // Add table header
    let headerRow = "<tr><th>Iterasi</th>";
    for (let i = 0; i < size; i++) {
        headerRow += `<th>x[${i + 1}]</th>`;
    }
    headerRow += "<th>Rumus Perhitungan Iterasi</th></tr>";
    resultsTable.innerHTML += headerRow;

    // Tabel untuk nilai error
    const errorTable = document.getElementById("errorTable");
    errorTable.innerHTML = "<tr><th>Iterasi</th><th>x[1](%)</th><th>Rumus x[1](%)</th><th>x[2](%)</th><th>Rumus x[2](%)<th>x[3](%)</th><th>Rumus x[3](%)</th>";

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
            const error = newX !== 0 ? (((newX - x[i]) / newX) * 100).toFixed(2) : 0;
            errors.push(error);

            // Menyusun rumus iterasi
            iterationDetails += `x[${i + 1}] = (${b[i]} - ${sum.toFixed(4)}) / ${matrix[i][i]} = ${newX.toFixed(4)}<br>`;
        }

        // Menambahkan baris ke tabel hasil
        let row = `<tr><td>${iterations + 1}</td>`;
        for (let i = 0; i < size; i++) {
            row += `<td>${xNew[i].toFixed(4)}</td>`;
        }
        row += `<td>${iterationDetails}</td></tr>`;
        resultsTable.innerHTML += row;

        // Menambahkan baris ke tabel error
        let errorRow = `<tr><td>${iterations + 1}</td>`;
        for (let i = 0; i < size; i++) {
            errorRow += `<td>${errors[i]}</td>`;
            const errorFormula = `((${xNew[i].toFixed(4)} - ${x[i].toFixed(4)}) / ${xNew[i].toFixed(4)}) * 100`;
            errorRow += `<td>${errorFormula}</td>`;
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
        <p>${convergence ? "Penyelesaian Tercapai" : "Tidak konvergen"} dalam ${iterations} Siklus</p>`;
});

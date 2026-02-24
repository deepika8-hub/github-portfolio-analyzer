async function analyzeProfile() {

    const input = document.getElementById("githubUrl").value.trim();
    const resultDiv = document.getElementById("result");

    if (!input) {
        resultDiv.innerHTML = "<p style='color:red'>Enter a username</p>";
        return;
    }

    let username = input;

    if (input.includes("github.com")) {
        username = input.split("github.com/")[1].replace("/", "");
    }

    resultDiv.innerHTML = "<p>Analyzing...</p>";

    try {

        const response = await fetch("https://github-portfolio-analyzer-8ab1.onrender.com/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username })
        });

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p style="color:red">${data.error}</p>`;
            return;
        }

        resultDiv.innerHTML = `
            <h2>Overall Score: ${data.scores.overall_score}/100</h2>

            ${createBar("Engineering Depth", data.scores.engineering_depth)}
            ${createBar("Impact", data.scores.impact)}
            ${createBar("Consistency", data.scores.consistency)}
            ${createBar("Documentation", data.scores.documentation)}
            ${createBar("Professionalism", data.scores.professionalism)}

            <div class="recommendations">
                <h3>Recommendations</h3>
                <ul>
                    ${data.recommendations.map(r => `<li>${r}</li>`).join("")}
                </ul>
            </div>
        `;

    } catch (error) {
        resultDiv.innerHTML = "<p style='color:red'>Backend not reachable</p>";
    }
}

function createBar(label, value) {
    return `
        <div class="score-bar">
            <p>${label} (${value}/20)</p>
            <div class="bar">
                <div class="bar-fill" style="width:${value * 5}%"></div>
            </div>
        </div>
    `;
}
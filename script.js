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

    resultDiv.innerHTML = "<p>Analyzing profile...</p>";

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
            <h2>${data.username}</h2>
            <h3>Profile Tier: ${data.tier}</h3>
            <h1>${data.scores.overall_score}/100</h1>

            ${createBar("Engineering Depth", data.scores.engineering_depth)}
            ${createBar("Impact", data.scores.impact)}
            ${createBar("Consistency", data.scores.consistency)}
            ${createBar("Documentation", data.scores.documentation)}
            ${createBar("Professionalism", data.scores.professionalism)}

            <div class="summary-box">
                <h3>Recruiter Summary</h3>
                <p>${data.summary}</p>
            </div>

            <div class="signals">
                <h3>Strong Signals</h3>
                <ul>${data.strong_signals.map(s => `<li>${s}</li>`).join("")}</ul>
            </div>

            <div class="flags">
                <h3>Red Flags</h3>
                <ul>${data.red_flags.map(f => `<li>${f}</li>`).join("")}</ul>
            </div>
        `;

    } catch (error) {
        resultDiv.innerHTML = "<p style='color:red'>Backend unreachable</p>";
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
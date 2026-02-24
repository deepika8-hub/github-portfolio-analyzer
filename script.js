async function analyzeProfile() {

    const inputElement = document.getElementById("githubUrl");
    const resultDiv = document.getElementById("result");

    const input = inputElement.value.trim();

    if (!input) {
        resultDiv.innerHTML = `<p style="color:red">Please enter a GitHub username</p>`;
        return;
    }

    let username = input;

    if (input.includes("github.com")) {
        username = input.split("github.com/")[1];
        username = username.replace("/", "");
    }

    try {

        resultDiv.innerHTML = `<p style="color:#555;">Analyzing profile...</p>`;

        const response = await fetch("https://github-portfolio-analyzer-8ab1.onrender.com/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p style="color:red">${data.error}</p>`;
            return;
        }

        resultDiv.innerHTML = `
            <h2>Overall Score: ${data.scores.overall_score}/100</h2>
            <p><strong>Tier:</strong> ${data.tier}</p>
            <p><strong>Followers:</strong> ${data.followers}</p>
            <p><strong>Public Repositories:</strong> ${data.public_repos}</p>
            <p><strong>Total Stars:</strong> ${data.total_stars}</p>
            <p><strong>Total Forks:</strong> ${data.total_forks}</p>

            <hr>

            <h3>Score Breakdown</h3>
            ${createBar("Engineering Depth", data.scores.engineering_depth)}
            ${createBar("Impact", data.scores.impact)}
            ${createBar("Consistency", data.scores.consistency)}
            ${createBar("Documentation", data.scores.documentation)}
            ${createBar("Professionalism", data.scores.professionalism)}

            <hr>

            <h3>Red Flags</h3>
            ${data.red_flags.length ? 
                `<ul>${data.red_flags.map(flag => `<li>${flag}</li>`).join("")}</ul>` 
                : "<p>No major red flags.</p>"
            }

            <hr>

            <h3>Summary</h3>
            <p>${data.summary}</p>
        `;

    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red">Error connecting to backend</p>`;
        console.error(error);
    }
}

function createBar(label, value) {
    return `
        <div style="margin-bottom:10px;">
            <p>${label}: ${value}/20</p>
            <div style="background:#eee; height:12px; border-radius:8px;">
                <div style="
                    width:${value * 5}%;
                    height:12px;
                    background:#2563eb;
                    border-radius:8px;">
                </div>
            </div>
        </div>
    `;
}
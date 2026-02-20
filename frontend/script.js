async function analyzeProfile() {

    const inputElement = document.getElementById("githubUrl");
    const resultDiv = document.getElementById("result");

    const input = inputElement.value.trim();

    if (!input) {
        resultDiv.innerHTML = `<p style="color:red">Please enter a GitHub URL</p>`;
        return;
    }

    let username = input;

    if (input.includes("github.com")) {
        username = input.split("github.com/")[1];
        username = username.replace("/", "");
    }

    try {
        resultDiv.innerHTML = `<p>Analyzing profile... </p>`;

        const response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: username })
        });

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p style="color:red">${data.error}</p>`;
        } else {

        const resultDiv = document.getElementById("result");

        resultDiv.innerHTML = `
        <h3>Overall Score: ${data.scores.overall_score}/100</h3>

        <h4>Score Breakdown:</h4>
        <p>Engineering Depth: ${data.scores.engineering_depth}</p>
        <p>Impact: ${data.scores.impact}</p>
        <p>Consistency: ${data.scores.consistency}</p>
        <p>Documentation: ${data.scores.documentation}</p>
        <p>Professionalism: ${data.scores.professionalism}</p>

        <h4>Profile Stats:</h4>
        <p>Followers: ${data.followers}</p>
        <p>Public Repositories: ${data.public_repos}</p>

        <h4>Recommendations:</h4>
        <ul>
            ${data.recommendations.map(rec => `<li>${rec}</li>`).join("")}
        </ul>
        `;
        }

    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red">Error connecting to backend</p>`;
        console.error(error);
    }
}
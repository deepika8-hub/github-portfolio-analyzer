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

        const response = await fetch("https://your-render-url.onrender.com/analyze", {
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
            document.getElementById("result").innerHTML = `
    <h2>Overall Score: ${data.scores.overall_score}/100</h2>

    <div class="score-bar">
        <p>Engineering Depth</p>
        <div class="bar"><div style="width:${data.scores.engineering_depth * 5}%"></div></div>
    </div>

    <div class="score-bar">
        <p>Impact</p>
        <div class="bar"><div style="width:${data.scores.impact * 5}%"></div></div>
    </div>

    <div class="score-bar">
        <p>Consistency</p>
        <div class="bar"><div style="width:${data.scores.consistency * 5}%"></div></div>
    </div>

    <div class="score-bar">
        <p>Documentation</p>
        <div class="bar"><div style="width:${data.scores.documentation * 5}%"></div></div>
    </div>

    <div class="score-bar">
        <p>Professionalism</p>
        <div class="bar"><div style="width:${data.scores.professionalism * 5}%"></div></div>
    </div>
`;
       
        }

    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red">Error connecting to backend</p>`;
        console.error(error);
    }
}
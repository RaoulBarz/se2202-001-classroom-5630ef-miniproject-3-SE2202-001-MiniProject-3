// Define the Job class
class Job {
    constructor(title, posted, type, level, skill, detail) {
        this.title = title || "Unknown";
        this.posted = posted || "Unknown";
        this.type = type || "Unknown";
        this.level = level || "Unknown";
        this.skill = skill || "Unknown";
        this.detail = detail || "No details available";
    }

    getDetails() {
        return `
            <strong>Title:</strong> ${this.title}<br>
            <strong>Posted:</strong> ${this.posted}<br>
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Skill:</strong> ${this.skill}<br>
            <strong>Detail:</strong> ${this.detail}
        `;
    }

    getFormattedPostedTime() {
        const parsedDate = new Date(this.posted);
        if (isNaN(parsedDate)) {
            console.error(`Invalid date format for job: ${this.title}, posted: ${this.posted}`);
            return new Date(0); // Default to epoch for invalid dates
        }
        return parsedDate;
    }
}

let jobs = []; // Holds the loaded job data
let filteredJobs = []; // Holds filtered jobs for further sorting

// Load JSON file
document.getElementById("jobFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file || file.name !== "upwork_jobs.json") {
        alert("Please upload the correct file: upwork_jobs.json.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            jobs = data.map(job => new Job(job.Title, job.Posted, job.Type, job.Level, job.Skill, job.Detail));
            filteredJobs = [...jobs];
            populateFilters();
            renderJobs(filteredJobs);
        } catch (error) {
            alert("Error parsing JSON file. Ensure it is properly formatted.");
        }
    };
    reader.readAsText(file);
});

// Populate Filters
function populateFilters() {
    const levels = new Set(jobs.map(job => job.level));
    const types = new Set(jobs.map(job => job.type));
    const skills = new Set(jobs.map(job => job.skill));

    populateDropdown("filterLevel", levels);
    populateDropdown("filterType", types);
    populateDropdown("filterSkill", skills);
}

function populateDropdown(id, items) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = '<option value="All">All</option>'; // Reset dropdown
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
}

// Filtering functionality
document.getElementById("applyFilters").addEventListener("click", () => {
    const level = document.getElementById("filterLevel").value;
    const type = document.getElementById("filterType").value;
    const skill = document.getElementById("filterSkill").value;

    filteredJobs = jobs.filter(job => {
        return (level === "All" || job.level === level) &&
               (type === "All" || job.type === type) &&
               (skill === "All" || job.skill === skill);
    });

    renderJobs(filteredJobs);
});

// Sorting functionality
document.getElementById("applySorting").addEventListener("click", () => {
    const sortBy = document.getElementById("sortOptions").value;

    filteredJobs.sort((a, b) => {
        const dateA = a.getFormattedPostedTime();
        const dateB = b.getFormattedPostedTime();

        if (sortBy === "titleAsc") {
            return a.title.localeCompare(b.title);
        } else if (sortBy === "titleDesc") {
            return b.title.localeCompare(a.title);
        } else if (sortBy === "postedNewest") {
            return dateB - dateA; // Newest first
        } else if (sortBy === "postedOldest") {
            return dateA - dateB; // Oldest first
        }
        return 0;
    });

    renderJobs(filteredJobs);
});

// Render Jobs
function renderJobs(jobList) {
    const jobListContainer = document.getElementById("jobList");
    jobListContainer.innerHTML = "";

    jobList.forEach(job => {
        const jobDiv = document.createElement("div");
        jobDiv.className = "job";
        jobDiv.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Posted:</strong> ${job.posted}</p>
            <p><strong>Type:</strong> ${job.type}</p>
            <p><strong>Level:</strong> ${job.level}</p>
            <p><strong>Skill:</strong> ${job.skill}</p>
            <button onclick="showJobDetails('${job.title}')">View Details</button>
        `;
        jobListContainer.appendChild(jobDiv);
    });
}

// Show Job Details
function showJobDetails(title) {
    const job = jobs.find(job => job.title === title);
    if (!job) return;

    const detailsContainer = document.getElementById("jobDetails");
    const detailsContent = document.getElementById("detailsContent");
    detailsContent.innerHTML = job.getDetails();
    detailsContainer.style.display = "block";
}

// Close Job Details
document.getElementById("closeDetails").addEventListener("click", () => {
    document.getElementById("jobDetails").style.display = "none";
});




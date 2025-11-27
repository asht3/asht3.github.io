export const profileApp = {
    name: 'Profile.dat',
    content: `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-image-container">
                    <div class="profile-image">
                        <div class="image-placeholder"><img src="assets/astronaut.png"></div>
                        <div class="scan-line"></div>
                    </div>
                    <div class="online-status">
                        <span class="status-indicator"></span>
                        STATUS: ONLINE
                    </div>
                </div>
                
                <div class="profile-basic-info">
                    <div class="info-row">
                        <span class="label">NAME:</span>
                        <span class="value" data-field="name">ASHLEY</span>
                    </div>
                    <div class="info-row">
                        <span class="label">ALIAS:</span>
                        <span class="value cyber-text" data-field="alias">@asht3 ON GITHUB</span>
                    </div>
                    <div class="info-row">
                        <span class="label">ID:</span>
                        <span class="value" data-field="id">DEV-${Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">CLEARANCE:</span>
                        <span class="value clearance-level">ENTRY LEVEL</span>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3 class="section-title">>> BIO_DATA</h3>
                <div class="bio-content" data-field="bio">
                    Entry-level software engineer possessing a solid foundation in a strong foundation in programming and web technologies.
                    Demonstrates proficiency in languages such as Java, C, and C++, and is skilled in web development using WordPress and CSS.
                    Knowledgeable in modern development practices, including version control and collaboration using Git and GitHub.
                    Equipped with a solid understanding of data structures and algorithm design, enabling effective problem-solving capabilities.
                </div>
            </div>

            <div class="profile-section">
                <h3 class="section-title">>> SKILL_MATRIX</h3>
                <div class="skills-grid">
                    <div class="skill-category">
                        <h4>LANGUAGES</h4>
                        <div class="skill-list">
                            <span class="skill-tag">JavaScript</span>
                            <span class="skill-tag">Java</span>
                            <span class="skill-tag">C++</span>
                            <span class="skill-tag">C</span>
                            <span class="skill-tag">ARM Assembly/nasm 64</span>
                            <span class="skill-tag">Ruby</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4>TOOLS</h4>
                        <div class="skill-list">
                            <span class="skill-tag">Git</span>
                            <span class="skill-tag">GitHub</span>
                            <span class="skill-tag">Vim</span>
                            <span class="skill-tag">Shell</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4>FRONTEND</h4>
                        <div class="skill-list">
                            <span class="skill-tag">HTML</span>
                            <span class="skill-tag">CSS</span>
                            <span class="skill-tag">Wordpress</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4>TESTING/DEBUGGING</h4>
                        <div class="skill-list">
                            <span class="skill-tag">Valgrind</span>
                            <span class="skill-tag">GDB</span>
                            <span class="skill-tag">JUnit</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3 class="section-title">>> EXPERIENCE_LOG</h3>
                <div class="experience-list">
                    <div class="experience-item">
                        <div class="exp-header">
                            <span class="exp-title">Teaching Assistant</span>
                            <span class="exp-date">2024-Present</span>
                        </div>
                        <div class="exp-company">Qwasar Silicon Valley College of Engineering</div>
                        <div class="exp-description">
                            Reviewed 20+ student projects, assessing code quality and functionality to improve learning outcomes.
                            Delivered constructive feedback, assisting students in refining their debugging skills and adopting industry-standard coding practices.
                        </div>
                    </div>
                    <div class="experience-item">
                        <div class="exp-header">
                            <span class="exp-title">Freelance Web Developer</span>
                            <span class="exp-date">2024-Present</span>
                        </div>
                        <div class="exp-company">Southern California Apprenticeship Network</div>
                        <div class="exp-description">
                            Collaborated with clients to gather website requirements and feedback for an optimal user experience.
                            Built a customized website using WordPress and CSS. Optimized it for SEO, caching, and easy maintenance.
                        </div>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3 class="section-title">>> EDUCATION_PROFILE</h3>
                <div class="education-list">
                    <div class="education-item">
                        <div class="edu-header">
                            <span class="edu-degree">Bachelor of Science in Mathematics - Computer Science</span>
                            <span class="edu-date">2019-2023</span>
                        </div>
                        <div class="edu-school">University of California, San Diego</div>
                        <div class="edu-focus">Specialization: Programming</div>
                    </div>
                </div>
            </div>

            <div class="profile-footer">
                <div class="security-notice">
                    ⚠️ THIS PROFILE IS ENCRYPTED - UNAUTHORIZED ACCESS WILL BE LOGGED
                </div>
            </div>
        </div>
    `,
    width: 700,
    height: 625
};
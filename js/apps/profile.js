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
                    Full-stack developer specializing in cyberpunk aesthetics and immersive web experiences. 
                    Passionate about creating digital worlds that blend futuristic design with cutting-edge technology.
                </div>
            </div>

            <div class="profile-section">
                <h3 class="section-title">>> SKILL_MATRIX</h3>
                <div class="skills-grid">
                    <div class="skill-category">
                        <h4>FRONTEND</h4>
                        <div class="skill-list">
                            <span class="skill-tag">JavaScript/ES6+</span>
                            <span class="skill-tag">React/Vue.js</span>
                            <span class="skill-tag">Three.js/WebGL</span>
                            <span class="skill-tag">CSS3/Animations</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4>BACKEND</h4>
                        <div class="skill-list">
                            <span class="skill-tag">Node.js</span>
                            <span class="skill-tag">Python</span>
                            <span class="skill-tag">MongoDB</span>
                            <span class="skill-tag">REST APIs</span>
                        </div>
                    </div>
                    <div class="skill-category">
                        <h4>SYSTEMS</h4>
                        <div class="skill-list">
                            <span class="skill-tag">Docker</span>
                            <span class="skill-tag">AWS</span>
                            <span class="skill-tag">Git</span>
                            <span class="skill-tag">WebSockets</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3 class="section-title">>> EXPERIENCE_LOG</h3>
                <div class="experience-list">
                    <div class="experience-item">
                        <div class="exp-header">
                            <span class="exp-title">Senior Full-Stack Developer</span>
                            <span class="exp-date">2022-PRESENT</span>
                        </div>
                        <div class="exp-company">NeonCorp Industries</div>
                        <div class="exp-description">Leading development of immersive web applications and cyberpunk-themed interfaces.</div>
                    </div>
                    <div class="experience-item">
                        <div class="exp-header">
                            <span class="exp-title">Frontend Architect</span>
                            <span class="exp-date">2020-2022</span>
                        </div>
                        <div class="exp-company">DataStream Systems</div>
                        <div class="exp-description">Designed and implemented real-time data visualization dashboards.</div>
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
                        <div class="edu-focus">Specialization: Human-Computer Interaction & UI Design</div>
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
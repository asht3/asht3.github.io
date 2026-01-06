document.addEventListener('DOMContentLoaded', function() {
    // Initialize all descriptions
    document.querySelectorAll('.project-description').forEach(description => {
        // Check if text needs truncation
        if (description.scrollHeight > 70) { // Approx 3 lines height
            // Set initial collapsed state
            description.classList.add('collapsed');
            
            // Show View More container
            const viewMoreContainer = description.nextElementSibling;
            if (viewMoreContainer && viewMoreContainer.classList.contains('view-more-container')) {
                viewMoreContainer.style.display = 'block';
            }
        } else {
            // Hide both View More and View Less if not needed
            const viewMoreContainer = description.nextElementSibling;
            const viewLessContainer = viewMoreContainer ? viewMoreContainer.nextElementSibling : null;
            
            if (viewMoreContainer && viewMoreContainer.classList.contains('view-more-container')) {
                viewMoreContainer.style.display = 'none';
            }
            if (viewLessContainer && viewLessContainer.classList.contains('view-less-container')) {
                viewLessContainer.style.display = 'none';
            }
        }
    });
    
    // Handle View More clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-toggle')) {
            e.preventDefault();
            const description = e.target.closest('.description-container')
                                .querySelector('.project-description');
            
            // Expand the description
            description.classList.remove('collapsed');
            description.classList.add('expanded');
            
            // Hide View More, show View Less
            const viewMoreContainer = e.target.closest('.view-more-container');
            const viewLessContainer = viewMoreContainer.nextElementSibling;
            
            viewMoreContainer.style.display = 'none';
            viewLessContainer.style.display = 'block';
        }
        
        if (e.target.classList.contains('view-toggle-less')) {
            e.preventDefault();
            const description = e.target.closest('.description-container')
                                .querySelector('.project-description');
            
            // Collapse the description
            description.classList.remove('expanded');
            description.classList.add('collapsed');
            
            // Show View More, hide View Less
            const viewLessContainer = e.target.closest('.view-less-container');
            const viewMoreContainer = viewLessContainer.previousElementSibling;
            
            viewLessContainer.style.display = 'none';
            viewMoreContainer.style.display = 'block';
        }
    });
});
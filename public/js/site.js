document.addEventListener('DOMContentLoaded', function() {
  console.log('Hello from site.js!');

  const imageInput = document.getElementById('imageInput');
  const uploadButton = document.getElementById('uploadButton');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const tagsContainer = document.getElementById('tagsContainer');
  const tagsResult = document.getElementById('tagsResult');

  imageInput.addEventListener('change', () => {
    if (imageInput.files.length === 0) {
      imagePreviewContainer.style.display = 'none';
      return;
    }

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      imagePreview.src = reader.result;
      imagePreviewContainer.style.display = 'block';
    };

    reader.readAsDataURL(file);
  });

  uploadButton.addEventListener('click', async () => {
    if (imageInput.files.length === 0) {
      alert('Please select an image');
      return;
    }

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

      try {
        const response = await fetch('/api/tags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imageBase64: base64Image })
        });

        const result = await response.json();
        if (response.ok) {
          displayTags(result.records[0]._tags);
          tagsResult.textContent = '';
        } else {
          tagsResult.textContent = 'Error: ' + result.error;
        }
      } catch (error) {
        console.error('Error:', error);
        tagsResult.textContent = 'Error: ' + error.message;
      }
    };

    reader.readAsDataURL(file);
  });

  function displayTags(tags) {
    tagsContainer.innerHTML = '';

    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.classList.add('tag');

      const tagName = document.createElement('span');
      tagName.textContent = tag.name + ': ';

      const tagProb = document.createElement('span');
      tagProb.textContent = (tag.prob * 100).toFixed(1) + '%';

      const progressBarContainer = document.createElement('div');
      progressBarContainer.classList.add('progress-bar-container');

      const progressBar = document.createElement('div');
      progressBar.classList.add('progress-bar');
      progressBar.style.width = (tag.prob * 100) + '%';

      progressBarContainer.appendChild(progressBar);
      tagElement.appendChild(tagName);
      tagElement.appendChild(tagProb);
      tagElement.appendChild(progressBarContainer);

      tagsContainer.appendChild(tagElement);
    });
  }
});

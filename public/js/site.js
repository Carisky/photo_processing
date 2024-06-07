document.addEventListener('DOMContentLoaded', function() {
  console.log('Hello from site.js!');

  const imageInput = document.getElementById('imageInput');
  const uploadButton = document.getElementById('uploadButton');
  const tagsResult = document.getElementById('tagsResult');

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
          tagsResult.textContent = JSON.stringify(result, null, 2);
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
});

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const dropArea = document.getElementById("drop-area");
    const previewImage = document.getElementById("preview-image");
    const loader = document.getElementById("loader");
    const removeBgBtn = document.getElementById("remove-bg-btn");
    const downloadBtn = document.getElementById("download-btn");

    // Handle Drag & Drop
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("drag-over");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("drag-over");
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("drag-over");
        const file = event.dataTransfer.files[0];
        handleFile(file);
    });

    // Handle File Selection
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.classList.remove("hidden");
                removeBgBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    }

    // Remove Background Button Click
    removeBgBtn.addEventListener("click", async () => {
        if (!fileInput.files[0]) return;

        loader.classList.remove("hidden"); // Show loader
        previewImage.classList.add("hidden"); // Hide current preview

        const formData = new FormData();
        formData.append("image", fileInput.files[0]);

        try {
            const response = await fetch("/remove-bg", {
                method: "POST",
                body: formData
            });

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            // Show processed image inside the same preview box (300x500)
            previewImage.src = imageUrl;
            previewImage.classList.remove("hidden");
            loader.classList.add("hidden"); // Hide loader

            // Enable download button
            downloadBtn.href = imageUrl;
            downloadBtn.classList.remove("hidden");
        } catch (error) {
            console.error("Error:", error);
            loader.classList.add("hidden");
        }
    });
});

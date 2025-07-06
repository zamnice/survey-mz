document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero');
    const surveyFormSection = document.getElementById('survey-form');
    const surveyForm = document.getElementById('main-survey-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const questions = document.querySelectorAll('.survey-question');
    const progressBar = document.querySelector('.progress-bar .progress');

    let currentQuestionIndex = 0;
    const totalQuestions = questions.length; // Total pertanyaan termasuk halaman 'final'

    // Fungsi untuk memulai survei dari hero section
    window.startSurvey = () => {
        heroSection.style.display = 'none';
        surveyFormSection.style.display = 'block';
        showQuestion(currentQuestionIndex);
        updateProgressBar();
    };

    // Fungsi untuk menampilkan pertanyaan berdasarkan indeks
    function showQuestion(index) {
        questions.forEach((q, i) => {
            if (i === index) {
                q.classList.add('active');
            } else {
                q.classList.remove('active');
            }
        });
        updateProgressBar();
    }

    // Fungsi untuk update progress bar
    function updateProgressBar() {
        // Hitung persentase, pastikan tidak termasuk halaman terakhir "Terima Kasih" jika itu hanya display
        const completedQuestions = currentQuestionIndex; // Misal halaman final tidak dihitung sbg pertanyaan
        const actualQuestions = totalQuestions - 1; // Jika halaman terakhir adalah "Terima Kasih"
        const progressPercentage = (completedQuestions / actualQuestions) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Navigasi "Selanjutnya"
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', () => {
            // Validasi jawaban sebelum pindah ke pertanyaan berikutnya (opsional)
            const currentQuestionElement = questions[currentQuestionIndex];
            const inputs = currentQuestionElement.querySelectorAll('input[type="radio"], input[type="checkbox"], textarea');
            let isValid = true;

            // Contoh validasi sederhana: pastikan ada input yang dipilih/diisi
            if (inputs.length > 0) {
                let hasInput = false;
                inputs.forEach(input => {
                    if ((input.type === 'radio' || input.type === 'checkbox') && input.checked) {
                        hasInput = true;
                    } else if (input.tagName === 'TEXTAREA' && input.value.trim() !== '') {
                        hasInput = true;
                    }
                });
                if (!hasInput && currentQuestionElement.dataset.question !== 'final') { // Jangan validasi halaman "final"
                    alert('Mohon lengkapi jawaban Anda sebelum melanjutkan.');
                    isValid = false;
                }
            }

            if (isValid && currentQuestionIndex < totalQuestions - 1) {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            }
        });
    });

    // Navigasi "Sebelumnya"
    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion(currentQuestionIndex);
            }
        });
    });

    // Handle submit form
    surveyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(surveyForm);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        console.log('Data yang akan dikirim:', data); // Untuk debugging

        // Kirim data ke Google Apps Script Web App
        // GANTI URL INI DENGAN URL WEB APP KAMU!
        const GOOGLE_APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx6edAQULM3uiiqcfFVKRo--velVx_pfeggQjRgxoiT1NbpezKPVKJkgIs0CV_yoa3D/exec'; // Contoh

        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // Penting untuk Apps Script karena CORS
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Kirim sebagai form-urlencoded
                },
                body: new URLSearchParams(data).toString(), // Ubah object ke URLSearchParams
            });

            // Karena mode: 'no-cors', kita tidak bisa membaca response.ok atau response.json()
            // Tapi kita bisa asumsikan pengiriman berhasil jika tidak ada error jaringan.
            console.log('Data berhasil dikirim (asumsi no-cors)');
            surveyForm.style.display = 'none';
            thankYouMessage.style.display = 'block';

        } catch (error) {
            console.error('Error mengirim data:', error);
            alert('Terjadi kesalahan saat mengirim survei. Silakan coba lagi.');
        }
    });
});

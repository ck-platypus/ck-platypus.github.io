$(document).ready(function() {
    $('#toggleButton').click(function() {
        $('#content').toggleClass('active');
    });

    let slideIndex = 0;
    showSlides(slideIndex);

    function showSlides(n) {
        let slides = $('.slide');
        if (n >= slides.length) slideIndex = 0;
        if (n < 0) slideIndex = slides.length - 1;
        slides.hide().eq(slideIndex).fadeIn();
    }

    $('.next').click(function() {
        slideIndex++;
        showSlides(slideIndex);
    });

    $('.prev').click(function() {
        slideIndex--;
        showSlides(slideIndex);
    });

    let timer;
    $('#startTimer').click(function() {
        let time = 30; // Timer in seconds
        clearInterval(timer);
        timer = setInterval(function() {
            time--;
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            $('#time').text(`00:${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
            if (time <= 0) clearInterval(timer);
        }, 1000);
    });

    $('.answer').click(function() {
        let isCorrect = $(this).data('correct');
        $('#quizResult').text(isCorrect ? '正確！' : '錯誤！');
        $('.answer').prop('disabled', true);
    });
});

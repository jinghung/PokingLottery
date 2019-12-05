
/*function preloader() {
    var i = 1;
    imageObj = new Image();
    for (i = 1; i <= 12; i++) {
        imageObj.src = 'images/poke/' + i + '.png';
        console.log(imageObj.src);
    }
} */
function onImageLoaded(url, cb) {
    var image = new Image()
    image.src = url

    if (image.complete) {
        // 圖片已經被載入
        cb(image)
    } else {
        // 如果圖片未被載入，則設定載入時的回調
        image.onload = function () {
            cb(image)
        }
    }
}

onImageLoaded('images/poke/9.png', function (icon) {
    console.log('Google 的 Favicon 載入完成啦！')
})

$(function () {
    SizeChange();
    //preloader();
});

$(window).resize(function () {
    SizeChange();
});

function SizeChange() {
    const BodyWidth = $('body').width();

    if (BodyWidth <= 720) {
        $('#PokeBg').attr('src', 'images/app/poke_bg.jpg');
    } else {
        $('#PokeBg').attr('src', 'images/poke_bg.jpg');
    }
}

//獲獎POP
function PopComplate(Info, Img, Pokei) {
    const PopDIv = '<div id="complate-mask"><div class="complate-wrap"><div class="complate-con"><div class="complate-info"><div class="complate-text color01"></div><div class="complate-giftimg"><img /></div></div><div class="complate-btn"><button><img src="https://static.08online.com/Event/AT/2019/E03_19103101/images/pop_sure.png" class="Ch-Img" /></button></div></div></div></div>';
    $('body').append(PopDIv);
    $('#complate-mask .complate-text').html(Info);
    $('#complate-mask .complate-giftimg>img').attr('src', Img);
    $('button').click(function () {
        PopComplateClose(Pokei);
    })
    PopSizeChange(688, 434);

}

//獲獎POP-close
function PopComplateClose(Pokei) {
    $('#complate-mask').remove();
    //判斷洞已顯示五個
    $('.PokeItem' + Pokei).addClass('CursorNon');
    const ChangeLength = $('.PokeList>.CursorNon').length;
    if (ChangeLength >= 5) {
        location.reload();
    }
}

//獲獎POP-resize
function PopSizeChange(boxW, boxH) {
    const BodyWidth = $('body').width();
    if (BodyWidth <= 720) {
        var PopH = ((BodyWidth * boxH) / boxW);
        $('.complate-wrap').css({
            'height': PopH,
            'margin-top': -(PopH / 2)
        });
    }
}
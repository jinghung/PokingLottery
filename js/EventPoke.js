angular.module('SGT', ['ngSanitize']).controller('PockControll', function ($scope) {

    //戳戳樂-數量
    $scope.PokeList = new Array(15);
    for (i = 0; i < $scope.PokeList.length; i++) {
        $scope.PokeList[i] = i + 1;
    }

    /*戳戳樂動畫*/
    $scope.BannerNum = 0;
    $scope.Rotate = function (GetGiftInfo, GetAwardImg, i) {
        $scope.BannerNum++;
        if ($scope.BannerNum > 12) { //動畫圖片數量
            $('.PokeItem' + i).find('.poke-status-click').hide();
            $('.PokeItem' + i).find('.poke-status-end').show();
            $scope.BannerNum = 0;
            $scope.PokeMode = 1;
            PopComplate(GetGiftInfo, GetAwardImg, i);
            return;
        }
        $('.PokeItem' + i).find('.poke-status-change').attr('src', 'images/poke/' + $scope.BannerNum + '.png'); 
        setTimeout(function () {
            $scope.Rotate(GetGiftInfo, GetAwardImg, i)
        }, 100); //圖片切換的時間,1000個單位為一秒鐘
    }

    $scope.PokeMode = 1; //戳戳樂狀態-0:點擊中,1:沒點。

    //戳戳樂
    $scope.PokeDay = function (i) { //i:第i個戳戳樂
        $scope.PokeOut = $('.PokeItem' + i).attr('class');
        if ($scope.PokeMode == 1 && $scope.PokeOut.indexOf('CursorNon') == -1) {
            $scope.PokeMode = 0;
            $('.PokeItem' + i).find('.poke-status-click').show();
            $.ajax({
                type: 'GET',
                url: './js/GetWordCardWeekData.json',
                async: false,
                success: function (n) {
                    $scope.GetAward = n.Data[Math.floor((Math.random() * n.Data.length))];

                    if ($scope.GetAward.ItemID == '10009') {
                        $scope.GetGiftInfo = '恭喜獲得' + $scope.GetAward.Cnt + ' 老幣。';
                    } else {
                        $scope.GetGiftInfo = '恭喜獲得' + $scope.GetAward.ItemName + 'X' + $scope.GetAward.Cnt + '。';
                    }

                    $scope.Rotate($scope.GetGiftInfo, $scope.GetAward.img, i);//執行戳戳樂動畫

                },
                error: function (e) {
                    console.log(e);
                }
            })
        }
    }

});

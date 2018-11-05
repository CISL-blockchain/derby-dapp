// 封装了一些工具函数，比如日期计算、日期插件渲染
Util = {}
Util.date = {
    initDatepicker: function () {
        var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        $('#startDate').datepicker({
            uiLibrary: 'bootstrap4',
            iconsLibrary: 'fontawesome',
            minDate: today,
            maxDate: function () {
                return $('#endDate').val();
            },
            format: 'yyyy-mm-dd'
        });
        $('#endDate').datepicker({
            uiLibrary: 'bootstrap4',
            iconsLibrary: 'fontawesome',
            minDate: function () {
                return $('#startDate').val();
            },
            format: 'yyyy-mm-dd'
        });
    },
    
    // 检查日期是否填写
    isDateFilled: function () {
        return $('#startDate').val() != "" && $('#endtDate').val() != "";
    },

    // 计算两个日期差的函数
    getDateDifference: function (sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        var dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        return Math.floor(dateSpan / (24 * 3600 * 1000));
    },

}
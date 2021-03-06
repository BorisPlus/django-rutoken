$(function(){
    var devicesSelect = $('#id_devices');
    var certsSelect = $('#id_certs');
    var keySelect = $("#keys");
    keySelect.clear = function(){
        this.find("option").remove();
    };
    var keyByCertificate = $("#key_by_current_certificate");
    var keyByCertificateBtn = $("#get_key");
    var pinBtn = $('#id_pin').focus();
    var submitBtn = $('form button[type=submit]');
    keyByCertificate.clear = function(){
        this.text("");
    };


    function toggleButtons(state){
        switch (state){
            case "openPin":{
                console.log("1");
                console.log("2");
                pinBtn.removeAttr('disabled');

                deleteCertificateBtn.attr('disabled', 'disabled');
                keyByCertificateBtn.attr('disabled', 'disabled');
                keyByCertificate.clear();
                keySelect.attr('disabled', 'disabled');
                keySelect.clear();
                deleteKeyBtn.attr('disabled', 'disabled');
                break;
            }
            case "openAll":
                console.log("3");
                console.log("4");
                pinBtn.attr('disabled', 'disabled');

                deleteCertificateBtn.removeAttr('disabled');
                keyByCertificate.removeAttr('disabled');
                keySelect.removeAttr('disabled');
                deleteKeyBtn.removeAttr('disabled');

                break;
        }
    }

    var crypto_ui = new CryptoUI({
        contentBox: $("form"),
        devicesSelect: devicesSelect,
        certsSelect: certsSelect,
        keysSelect: keySelect
    });

    var refreshDevicesBtn = $("#refresh_devices").click(function(){
        crypto_ui.refreshDevices(deviceRefreshCallback);
    });

    var getKeyByCertificateBtn = $("#get_key").click(function(){
        crypto_ui.plugin.pluginObject.getKeyByCertificate(devicesSelect.val(), certsSelect.val(), function(keyId){
            $("#key_by_current_certificate").text(keyId);
        }, function(errorCode){
            keyByCertificate.clear();
            crypto_ui.errorCallback(errorCode);
        });
    });

    var deleteCertificateBtn = $("#delete_cerfiticate").click(function(){
        crypto_ui.plugin.pluginObject.deleteCertificate(devicesSelect.val(), certsSelect.val(), function(){
            crypto_ui.refreshDevices(deviceRefreshCallback);
        }, function(errorCode){
            crypto_ui.errorCallback(errorCode);
        });
    });

    var deleteKeyBtn= $("#delete_key").click(function(){
        crypto_ui.deleteKey(devicesSelect.val(), keySelect.val(),  function(keys){
            crypto_ui.enumerateKeys(devicesSelect.val(),"", function(keys){
                console.log("keys внутриу deleteKeyBtn", keys);
            });
        });
    }).attr("disabled", 'disabled');


    // заблокируем до времени не нужные элементы формы
    pinBtn.attr('disabled', 'disabled');

    // модальное окно для ввода pin-кода
    pinBtn.click(openPINModal);

    crypto_ui.refreshDevices(deviceRefreshCallback);
//    crypto_ui.refreshDevices(deviceRefreshCallback);

    $("#id_devices").change(function(i,val){
        var ui = crypto_ui;
        ui.certsSelect.find('option').remove();

        var device = ui.plugin.devices[ui.devicesSelect.val()];
        $.each(device.getAllCerts(), function(i, cert) {
            var option_html = '<option value="'+ cert.id +'">'+ cert.getLabel() +'</option>';
            ui.certsSelect.append(option_html);
        });
        toggleButtons('openPin');
        crypto_ui.clearErrorReport();
        pinBtn.removeAttr('disabled').focus();
        keysSelect.find('option').remove();
//        keysSelect.attr('disabled', 'disabled');
//        deleteCertificateBtn.attr('disabled', 'disabled');
//        deleteKeyBtn.attr('disabled', 'disabled');
//        getKeyByCertificateBtn.attr('disabled', 'disabled');
//        keyByCertificate.clear();
    });



    /**
     * окно ввода пин кода
     */
    function openPINModal(){
        crypto_ui.login({
            loginModal: $('#loginPINModal'),
            pinSuccessCallback: pinSuccessCallback
        });


        function pinSuccessCallback(){
            // заблокируем ввод пина чтобы не отвлекать пользователя
//            pinBtn.attr('disabled', 'disabled');

            toggleButtons("openAll");
            keySelect.removeAttr("disabled");
            deleteKeyBtn.removeAttr("disabled");
            getKeyByCertificateBtn.removeAttr("disabled");
            deleteCertificateBtn.removeAttr("disabled");
            delete
            crypto_ui.enumerateKeys(devicesSelect.val(), "", function(keys){
            });

        }
    }

    /**
     * обработчик успешного окончания обновлнеия списка устройств
     */
    function deviceRefreshCallback() {
        var selectedDeviceID = devicesSelect.val();
        pinBtn.focus();
        if (!selectedDeviceID || selectedDeviceID=="Список обновляется..."){ // если не оказалось устройств
            devicesSelect.append("<option>Нет подключенных устройств</option>");
            return;
        }
        if (!selectedDeviceID) return;

        toggleButtons("openPin");
        pinBtn.focus();
        crypto_ui.clearErrorReport();

    }

    function deleteCerfiticate(){
        var selectedDeviceID = devicesSelect.val()
    }

});

import $ from 'jquery';

function start_moodja_set() {
    window.loadMDSETSScript = function(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback()
                }
            };
        } else {
            script.onload = function() {
                callback()
            }
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script)
    };
    window.checkMDSETAppInstalled = function(version) {
        window.moodja_set.is_product_option = true;
        commonMDSETJS(version);
        productPageMDSETJS(version);
    };
    window.commonMDSETJS = function($) {
        window.moodja_setStart = function($) {
            if (window.moodja_set.page_type == "product") {
              	$('#moodja_set_custom_options_' + window.moodja_set.product_id).closest("form").find(':submit').attr("disabled", true);
                      
                $.ajax({
                    type: "GET",
                    url: window.moodja_set.moodja_set_url + "/get_sets2",
                    data: {
                        pid: window.moodja_set.product_id,
                        store_id: window.moodja_set.store_id
                    },
                    sync: false,
                    crossDomain: true,
                    success: function(data) {
                      $("#moodja_set_custom_options_" + window.moodja_set.product_id).html(data);
                      
                      if($(".moodja_set_dd").length>0)
                      {
                        $('#moodja_set_custom_options_' + window.moodja_set.product_id).closest("form").find(':submit').addClass('moodja_set_submit_cart');
                        $(".moodja_set_dd").each(function() {
                          $(this).change(function () {
                            generate_SKUS();
                          });

                        });
                      }
                      $('#moodja_set_custom_options_' + window.moodja_set.product_id).closest("form").find(':submit').removeAttr("disabled");
                    }
                })
            }
            
        };
        console.log('started');
        moodja_setStart($)
    };
    
    window.productPageMDSETJS = function($) {
        window.generate_SKUS = function() {
          $('#moodja_sets_hidden_props').children().each(function() {
            $(this).remove();

          });
          var _sku_concat = "";
          $(".moodja_set_dd").each(function() {
            _sku_concat += $(this).children("option:selected").attr('sku')+",";

          });
          $(".moodja_set_hidden_sku").each(function() {
            _sku_concat += $(this).attr('value')+",";
          }); 
          _sku_concat = _sku_concat.replace(/,\s*$/, "");
          if(_sku_concat.length > 0)
          {
            $('<input>').attr({
              type: 'hidden',
              name: 'properties[_skus]',
              value: _sku_concat
            }).appendTo('#moodja_sets_hidden_props');
          }
          
        };
        window.validate_MDSETsoptions = function(product_id) {
            var good = true;
            $(".moodja_set_option:visible").each(function() {
                if ($(this).hasClass("validation_error")) {
                    good = false
                }
            });
            $('#moodja_set_options_' + product_id + ' #error_text').html('');
            var moodja_set_req = $("#moodja_set_option_list_" + product_id + ":visible .required:visible");
            var i;
            for (i = 0; i < moodja_set_req.length; i += 1) {
                if ($(moodja_set_req[i]).find("select[name^='properties']").length == 1 && !$(moodja_set_req[i]).find("select[name^='properties']").val()) {
                    $(moodja_set_req[i]).addClass("validation_error");
                    good = false
                } else {
                    $(moodja_set_req[i]).removeClass("validation_error")
                }
            }
            if(good)
            {
              var _sku_concat = "";
              $(".moodja_set_dd").each(function() {
                _sku_concat += $(this).children("option:selected").attr('sku')+",";

              });
              $(".moodja_set_hidden_sku").each(function() {
                _sku_concat += $(this).attr('value')+",";
              }); 
              _sku_concat = _sku_concat.replace(/,\s*$/, "");
              if(_sku_concat.length > 0)
              {
                $('<input>').attr({
                  type: 'hidden',
                  name: 'properties[_skus]',
                  value: _sku_concat
                }).appendTo('#moodja_sets_hidden_props');
              }
            }
            return good
        };
       
        var moodja_set_flag = 0;
        $("body").on('click', '.moodja_set_submit_cart', function(e) {
            if (moodja_set_flag == 0) {
                e.preventDefault();
                var res = true;
                if (validate_MDSETsoptions(window.moodja_set.product_id)) {
                    $('#moodja_sets_hidden_props').children().each(function() {
                        $(this).remove();
                        
                    });
                    var _sku_concat = "";
                    $(".moodja_set_dd").each(function() {
                      	_sku_concat += $(this).children("option:selected").attr('sku')+",";
                        
                    });
                    $(".moodja_set_hidden_sku").each(function() {
                      	_sku_concat += $(this).attr('value')+",";
                    }); 
                  	_sku_concat = _sku_concat.replace(/,\s*$/, "");
                    if(_sku_concat.length > 0)
                    {
                     	 $('<input>').attr({
                            type: 'hidden',
                            name: 'properties[_skus]',
                            value: _sku_concat
                        }).appendTo('#moodja_sets_hidden_props');
                    }
                    $("[name^='properties']").each(function() {
                        if ($(this).val() == '') {
                            $(this).attr('disabled', true)
                        }
                    });
                    moodja_set_flag = 1;
                    $('.moodja_set_submit_cart').click()
                }
            }
        })
    }
}
start_moodja_set();
if (typeof window.moodja_set !== 'undefined') {
  checkMDSETAppInstalled(jQuery);
}

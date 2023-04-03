import $ from 'jquery';

export default class Addresses {
    constructor() {
        this.$addAddressForm = $(".js-addAddress > form");
        this.$editAddressForm = $(".js-editAddress > form");
        this.validating();
    }

    validating() {
        const { $addAddressForm, $editAddressForm} = this;
        $addAddressForm.add($editAddressForm).submit(function (e) {
            var isEmpty = true;

            // Display notification if input is empty
            $(this).find('input').not(".optional").each(function () {
                if (!$(this).val()) {
                    $(this).next().addClass("validation--showup");
                } else {
                    $(this).next().removeClass("validation--showup");
                }
            });

            // Detect whether form is valid
            $(this).find('input').not(".optional").each(function () {
                if (!$(this).val()) {
                    isEmpty = false;
                }
            });
            if (!isEmpty) {
                return false;
            }
        });
    }
}

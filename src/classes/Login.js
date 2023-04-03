import $ from 'jquery';

export default class Login {
    constructor() {
        $('.js-recoverToggle').on('click', Login.recoveryShow);
        $('.js-recoverCancel').on('click', Login.recoveryHide);
    }

    static recoveryShow(e) {
        e.preventDefault();

        $('.js-loginForm').hide();
        $('.js-recoverForm').show();
    }

    static recoveryHide(e) {
        e.preventDefault();

        $('.js-loginForm').show();
        $('.js-recoverForm').hide();
    }
}

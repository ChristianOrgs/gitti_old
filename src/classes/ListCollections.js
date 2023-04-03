import $ from 'jquery';
import 'trunk8';
import Gitti from './Gitti';
import Reqs from './Reqs';

export default class ListCollections extends Gitti {
    constructor(options) {
        super(options);
        var collectionList = $('.js-collection-grid');
        this.$window
            .on('load', () => {
                this.truncateBlockText(collectionList);
            })
            .on('resize', Reqs.throttle(() => {
                this.truncateBlockText(collectionList);
        }, 50));

        this.$document.on('ajaxify:updated', () => {
            this.truncateBlockText(collectionList);
        });
    }

    truncateBlockText(collectionList) {
        collectionList.find('.collectionBlock-info h4').trunk8({
            lines: 3
        });

        collectionList.find('.collectionBlock-info h2').trunk8({
            lines: 2
        });

        collectionList.find('.collectionBlock').removeClass('is-loading');
    }
}

const default_data = {
    visible: false,
    content: '',
    duration: 2,
    type: 'default', // default || success || warning || error
};

let timmer = null;

Component({
    externalClasses: ['i-class'],

    data: {
        visible: false,
        content: '',
        duration: 2,
        type: 'default', // default || success || warning || error
    },

    methods: {
        handleShow (options) {
            const { type = 'default', duration = 2 } = options;
            let param = Object.assign({}, options, {
                type,
                duration,
                visible: true
            })
            this.setData(param);

            const d = this.data.duration * 1000;

            if (timmer) clearTimeout(timmer);
            if (d !== 0) {
                timmer = setTimeout(() => {
                    this.handleHide();
                    timmer = null;
                }, d);
            }
        },

        handleHide () {
            this.setData({
                visible: false,
                content: '',
                duration: 2,
                type: 'default', // default || success || warning || error
            });
        }
    }
});
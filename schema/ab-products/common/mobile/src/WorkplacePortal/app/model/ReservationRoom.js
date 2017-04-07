Ext.define('WorkplacePortal.model.ReservationRoom', {
    extend: 'Common.data.Model',

    config: {
        fields: [
            {
                name: 'id',
                type: 'auto'
            },
            {
                name: 'rmres_id',
                type: 'IntegerClass'
            },
            {
                name: 'res_id',
                type: 'IntegerClass'
            },
            {
                name: 'date_start',
                type: 'DateClass',
                defaultValue: new Date()
            },
            {
                name: 'time_start',
                type: 'TimeClass',
                defaultValue: new Date()
            },
            {
                name: 'time_end',
                type: 'TimeClass',
                defaultValue: new Date()
            },
            {
                name: 'bl_id',
                type: 'string'
            },
            {
                name: 'fl_id',
                type: 'string'
            },
            {
                name: 'rm_id',
                type: 'string'
            },
            {
                name: 'status',
                type: 'string'
            },
            {
                name: 'verified',
                type: 'int'
            },
            {
                name: 'config_id',
                type: 'string'
            },
            {
                name: 'rm_arrange_type_id',
                type: 'string'
            },
            {
                name: 'cost_rmres',
                type: 'IntegerClass'
            }
        ]
    },

    canCheckIn: function () {
        var dateStart = this.get('date_start'),
            timeStart = this.get('time_start'),
            currentTime = new Date(),
            timeDeltaMillis = 30 * 60 * 1000; // 30 minutes

        dateStart.setHours(timeStart.getHours());
        dateStart.setMinutes(timeStart.getMinutes());
        dateStart.setSeconds(timeStart.getSeconds());

        return Math.abs(dateStart - currentTime) <= timeDeltaMillis;
    }

});
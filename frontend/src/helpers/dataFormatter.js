import dayjs from 'dayjs';
import _ from 'lodash';

export default {
    filesFormatter(arr) {
        if (!arr || !arr.length) return [];
        return arr.map((item) => item);
    },
    imageFormatter(arr) {
        if (!arr || !arr.length) return []
        return arr.map(item => ({
            publicUrl: item.publicUrl || ''
        }))
    },
    oneImageFormatter(arr) {
        if (!arr || !arr.length) return ''
        return arr[0].publicUrl || ''
    },
    dateFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD')
    },
    dateTimeFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    booleanFormatter(val) {
        return val ? 'Yes' : 'No'
    },
    dataGridEditFormatter(obj) {
        return _.transform(obj, (result, value, key) => {
            if (_.isArray(value)) {
                result[key] = _.map(value, 'id');
            } else if (_.isObject(value)) {
                result[key] = value.id;
            } else {
                result[key] = value;
            }
        });
    },

        customersManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.name)
        },
        customersOneListFormatter(val) {
            if (!val) return ''
            return val.name
        },
        customersManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.name}
            });
        },
        customersOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.name, id: val.id}
        },

        queue_entriesManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.status)
        },
        queue_entriesOneListFormatter(val) {
            if (!val) return ''
            return val.status
        },
        queue_entriesManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.status}
            });
        },
        queue_entriesOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.status, id: val.id}
        },

        servicesManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.name)
        },
        servicesOneListFormatter(val) {
            if (!val) return ''
            return val.name
        },
        servicesManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.name}
            });
        },
        servicesOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.name, id: val.id}
        },

}
